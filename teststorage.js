const { Storage } = require('@google-cloud/storage');
const serviceAccount = require('./owner-sa-key.json'); // Path to your service account JSON

const storage = new Storage({
  credentials: serviceAccount,
});

async function checkPermissions() {
  try {
    const [buckets] = await storage.getBuckets();
    console.log('Buckets:', buckets);
  } catch (error) {
    console.error('Error checking permissions:', error.message);
  }
}

checkPermissions();
