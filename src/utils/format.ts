export const truncateString = (value: string, maxLength = 50): string => {
  if (!value) return '';
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';

  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date', error);
    return 'N/A';
  }
};

export const formatFileSize = (bytes?: string): string => {
  if (!bytes) return 'N/A';

  const size = Number(bytes);
  if (Number.isNaN(size)) return 'N/A';

  if (size === 0) return '0 B';

  const k = 1024;
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  const value = parseFloat((size / Math.pow(k, i)).toFixed(2));

  return `${value} ${units[i]}`;
};
