/**
 * MongoDB Restore Script for TMSM
 * Restores collections and indexes from an EJSON backup folder created by backup-db.js.
 * 
 * Usage:
 *   node scripts/restore-db.js [path-to-backup-folder]
 */

const { MongoClient, BSON } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://tmsm_user:sns%402026@72.60.29.78:27017/tmsm?authSource=tmsm';

async function restoreDatabase() {
  const targetDir = process.argv[2];

  let backupPath = targetDir;
  if (!backupPath) {
    // Find the latest backup in backups/ directory
    const backupsRoot = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupsRoot)) {
      console.error('No backups directory found.');
      process.exit(1);
    }
    const folders = fs.readdirSync(backupsRoot)
      .filter((f) => fs.statSync(path.join(backupsRoot, f)).isDirectory() && f.startsWith('tmsm_backup_'))
      .sort()
      .reverse();

    if (folders.length === 0) {
      console.error('No backups found in backups/ directory.');
      process.exit(1);
    }
    backupPath = path.join(backupsRoot, folders[0]);
    console.log(`No backup path specified. Using latest backup: ${folders[0]}`);
  }

  if (!fs.existsSync(backupPath)) {
    console.error(`Backup folder not found: ${backupPath}`);
    process.exit(1);
  }

  console.log('='.repeat(60));
  console.log(`Starting MongoDB Restore from: ${backupPath}`);
  console.log('='.repeat(60));

  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('\nConnecting to MongoDB...');
    await client.connect();
    const db = client.db();
    console.log(`Connected to database: ${db.databaseName}\n`);

    const files = fs.readdirSync(backupPath);
    const dataFiles = files.filter((f) => f.endsWith('.json') && !f.endsWith('.indexes.json') && f !== 'metadata.json');

    for (const file of dataFiles) {
      const colName = path.basename(file, '.json');
      const filePath = path.join(backupPath, file);
      const indexFilePath = path.join(backupPath, `${colName}.indexes.json`);

      console.log(`Restoring collection '${colName}'...`);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const docs = BSON.EJSON.parse(raw);

      const collection = db.collection(colName);

      if (docs.length > 0) {
        // Option: clean or insert
        await collection.deleteMany({});
        await collection.insertMany(docs);
        console.log(`  ✓ Inserted ${docs.length} documents into '${colName}'.`);
      } else {
        console.log(`  - 0 documents to insert for '${colName}'.`);
      }

      // Restore indexes if available
      if (fs.existsSync(indexFilePath)) {
        try {
          const indexRaw = fs.readFileSync(indexFilePath, 'utf-8');
          const indexes = JSON.parse(indexRaw);
          for (const idx of indexes) {
            if (idx.name === '_id_') continue; // Skip default _id index
            const key = idx.key;
            const options = { name: idx.name };
            if (idx.unique) options.unique = true;
            if (idx.sparse) options.sparse = true;
            if (idx.expireAfterSeconds) options.expireAfterSeconds = idx.expireAfterSeconds;
            await collection.createIndex(key, options);
          }
          console.log(`  ✓ Restored indexes for '${colName}'.`);
        } catch (idxErr) {
          console.warn(`  [!] Index restoration warning for '${colName}':`, idxErr.message);
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('RESTORE COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n[X] Restore failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

restoreDatabase();
