import connectToDatabase from '@/lib/mongodb';
import Settings from '@/models/Settings';

async function getSMTPSettings() {
    try {
        await connectToDatabase();
        const settings = await Settings.findOne({});
        if (!settings) {
            throw new Error('SMTP settings not found in the database.');
        }
        return settings;
    } catch (error) {
        console.error('Error fetching SMTP settings:', error);
        throw new Error('Unable to fetch SMTP settings from the database.');
    }
}

export default getSMTPSettings;
