export * from '@/services/googleDriveService';

// Updated fetchGoogleDriveFiles to disable auto-cancel
export async function fetchGoogleDriveFiles() {
  try {
    const records = await client.collection('googleDrive').getFullList({ requestKey: null });
    return records;
  } catch (error) {
    console.error('Error fetching Google Drive files:', error);
    throw error;
  }
}