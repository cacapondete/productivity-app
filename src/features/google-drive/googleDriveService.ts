import client from '@/lib/pocketbase';

export async function fetchGoogleDriveFiles() {
  try {
    const googleToken = localStorage.getItem('google_token'); // Retrieve token from localStorage
    if (!googleToken) {
      throw new Error('Google access token not found. Please log in again.');
    }

    console.log('Using Token:', googleToken.substring(0, 10) + '...'); // Log token for debugging

    const response = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=15&orderBy=createdTime%20desc&fields=files(id,name,mimeType,createdTime,modifiedTime,size)', {
      headers: {
        Authorization: `Bearer ${googleToken}`,
      },
      mode: 'cors', // Ensure CORS mode is set
    });

    if (!response.ok) {
      const errorDetails = await response.json(); // Parse error details
      console.error('Google Drive API Error:', errorDetails); // Log detailed error

      if (response.status === 403) {
        throw new Error('Ijin Drive durung dicentang, Hos! Logout terus Login maneh lan CENTANG ijin Drive-ne!');
      }

      throw new Error('Failed to fetch Google Drive files');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Google Drive files:', error);
    throw error;
  }
}