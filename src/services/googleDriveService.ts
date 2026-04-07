import { getGoogleToken, clearGoogleToken } from '@/hooks/useLocalStorage';

export async function fetchGoogleDriveFiles() {
  try {
    const googleToken = getGoogleToken();
    if (!googleToken) {
      throw new Error('Google access token not found. Please log in again.');
    }

    const response = await fetch(
      'https://www.googleapis.com/drive/v3/files?pageSize=1000&orderBy=createdTime%20desc&fields=files(id,name,mimeType,createdTime,modifiedTime,size)',
      {
        headers: {
          Authorization: `Bearer ${googleToken}`,
        },
        mode: 'cors',
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => null);
      console.error('Google Drive API Error:', errorDetails);

      if (response.status === 403) {
        clearGoogleToken();
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
