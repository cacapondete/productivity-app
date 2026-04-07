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

export const formatDateTime = (dateString?: string): string => {
  if (!dateString) return 'N/A';

  try {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date time', error);
    return 'N/A';
  }
};

export const formatRemainingTime = (dateString?: string): string => {
  if (!dateString) return 'N/A';

  const targetTime = new Date(dateString).getTime();
  if (Number.isNaN(targetTime)) return 'N/A';

  const diff = targetTime - Date.now();
  const isPast = diff < 0;
  const totalMinutes = Math.max(0, Math.floor(Math.abs(diff) / (1000 * 60)));

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);

  return isPast ? `Overdue ${parts.join(' ')}` : `Remaining ${parts.join(' ')}`;
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
