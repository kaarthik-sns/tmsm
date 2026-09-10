/**
 * MongoDB Backup Script for TMSM
 * Backs up all collections and indexes with full BSON type fidelity (EJSON format).
 */

const { MongoClient, BSON } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://tmsm_user:sns%402026@72.60.29.78:27017/tmsm?authSource=tmsm';

function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const YYYY = now.getFullYear();
  const MM = pad(now.getMonth() + 1);
  const DD = pad(now.getDate());
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  return `${YYYY}-${MM}-${DD}_${hh}-${mm}-${ss}`;
}

async function backupDatabase() {
  const timestamp = getTimestamp();
  const backupDir = path.join(__dirname, '..', 'backups', `tmsm_backup_${timestamp}`);

  console.log('='.repeat(60));
  console.log(`Starting MongoDB Backup at ${new Date().toISOString()}`);
  console.log(`Backup Directory: ${backupDir}`);
  console.log('='.repeat(60));

  fs.mkdirSync(backupDir, { recursive: true });

  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('\nConnecting to MongoDB...');
    await client.connect();
    console.log('Successfully connected to MongoDB server.\n');

    // Extract DB name from URI or connection
    const db = client.db();
    const dbName = db.databaseName;
    console.log(`Target Database: ${dbName}`);

    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collection(s) in '${dbName}':`);
    collections.forEach((c) => console.log(`  - ${c.name}`));

    const backupSummary = {
      database: dbName,
      timestamp: new Date().toISOString(),
      timestampFolder: timestamp,
      totalCollections: collections.length,
      collections: {},
    };

    console.log('\nExporting collections...');

    for (const colInfo of collections) {
      const colName = colInfo.name;
      const collection = db.collection(colName);

      // Fetch documents
      const docs = await collection.find({}).toArray();
      const count = docs.length;

      // Fetch indexes
      let indexes = [];
      try {
        indexes = await collection.indexes();
      } catch (err) {
        console.warn(`  [!] Warning: Could not get indexes for '${colName}':`, err.message);
      }

      // Serialize with BSON EJSON to preserve types (ObjectIds, Dates, etc.)
      const ejsonContent = BSON.EJSON.stringify(docs, null, 2);
      const filePath = path.join(backupDir, `${colName}.json`);
      fs.writeFileSync(filePath, ejsonContent, 'utf-8');

      // Save index definitions
      const indexFilePath = path.join(backupDir, `${colName}.indexes.json`);
      fs.writeFileSync(indexFilePath, JSON.stringify(indexes, null, 2), 'utf-8');

      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);

      backupSummary.collections[colName] = {
        documentCount: count,
        fileSizeKB: parseFloat(sizeKB),
        dataFile: `${colName}.json`,
        indexFile: `${colName}.indexes.json`,
        indexCount: indexes.length,
      };

      console.log(`  ✓ [${colName}] -> ${count} documents saved (${sizeKB} KB)`);
    }

    // Save summary metadata file
    const summaryPath = path.join(backupDir, 'metadata.json');
    fs.writeFileSync(summaryPath, JSON.stringify(backupSummary, null, 2), 'utf-8');

    console.log('\n' + '='.repeat(60));
    console.log('BACKUP COMPLETED SUCCESSFULLY!');
    console.log(`Location: ${backupDir}`);
    console.log(`Metadata saved to: ${summaryPath}`);
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n[X] Backup failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

backupDatabase();
