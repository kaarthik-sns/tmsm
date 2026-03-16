require('dotenv').config(); // 👈 load env vars at the top
const cron = require('node-cron');
const axios = require('axios');

cron.schedule('* * * * *', async () => {
  console.log('🔁 Triggering cleanup task...');

  try {
    console.log(`${process.env.BASE_URL}/api/test-email`);
    const res = await axios.get(`${process.env.BASE_URL}/api/test-email`);
    console.log('✅ Cleanup response:', res.data);
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
});