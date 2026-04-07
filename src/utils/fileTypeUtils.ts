// File type categories and utilities
export type FileCategory = 'workspaces' | 'images' | 'videos' | 'other' | 'folder';

export const getFileCategory = (mimeType: string): FileCategory => {
  // Google Workspace files
  if (
    mimeType === 'application/vnd.google-apps.document' ||
    mimeType === 'application/vnd.google-apps.spreadsheet' ||
    mimeType === 'application/vnd.google-apps.presentation' ||
    mimeType === 'application/vnd.google-apps.form'
  ) {
    return 'workspaces';
  }

  // Folders
  if (mimeType === 'application/vnd.google-apps.folder') {
    return 'folder';
  }

  // Images
  if (mimeType.startsWith('image/')) {
    return 'images';
  }

  // Videos
  if (mimeType.startsWith('video/')) {
    return 'videos';
  }

  // Everything else
  return 'other';
};

export const filterFilesByCategories = <T extends { mimeType: string }>(
  files: T[],
  categories: FileCategory[]
): T[] => {
  if (categories.length === 0) return files;
  return files.filter((file) => categories.includes(getFileCategory(file.mimeType)));
};

export const getCategoryLabel = (category: FileCategory): string => {
  const labels: Record<FileCategory, string> = {
    workspaces: 'Workspaces',
    images: 'Images',
    videos: 'Videos',
    other: 'Other Files',
    folder: 'Folders',
  };
  return labels[category];
};
