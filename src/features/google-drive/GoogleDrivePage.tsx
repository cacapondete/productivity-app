"use client";

import { useEffect, useState } from 'react';
import { fetchGoogleDriveFiles } from './googleDriveService';
import {
  FileIcon,
  FolderIcon,
  ImageIcon,
  VideoIcon,
  ExternalLinkIcon,
  DownloadIcon,
  AlertCircle,
} from 'lucide-react';

interface GoogleFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
}

const getMimeTypeCategory = (mimeType: string): string => {
  if (mimeType === 'application/vnd.google-apps.folder') return 'folder';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'file';
};

const getFileIcon = (mimeType: string) => {
  const category = getMimeTypeCategory(mimeType);
  const iconProps = { size: 18, className: 'text-blue-400' };

  switch (category) {
    case 'folder':
      return <FolderIcon {...iconProps} className='text-amber-400' />;
    case 'image':
      return <ImageIcon {...iconProps} className='text-pink-400' />;
    case 'video':
      return <VideoIcon {...iconProps} className='text-red-400' />;
    default:
      return <FileIcon {...iconProps} />;
  }
};

const truncateFilename = (name: string, maxLength: number = 50): string => {
  return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatFileSize = (bytes?: string): string => {
  if (!bytes) return 'N/A';
  const size = parseInt(bytes, 10);
  if (size === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return Math.round((size / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export default function GoogleDrivePage() {
  const [files, setFiles] = useState<GoogleFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFiles() {
      try {
        setLoading(true);
        const data = await fetchGoogleDriveFiles();
        setFiles(data.files || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    loadFiles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Google Drive</h1>
          <p className="text-slate-400">Your files and folders</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle size={20} className="text-red-400" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && files.length === 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
            <FolderIcon size={64} className="mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No files found</h3>
            <p className="text-slate-400">
              Your Drive is empty or the access token doesn't have permission to view your files.
            </p>
          </div>
        )}

        {/* Files Table */}
        {!loading && !error && files.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Modified</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Size</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, index) => (
                    <tr
                      key={file.id}
                      className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors"
                    >
                      {/* Name Column */}
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.mimeType)}
                          <span
                            className="text-slate-200 font-medium truncate"
                            title={file.name}
                          >
                            {truncateFilename(file.name)}
                          </span>
                        </div>
                      </td>

                      {/* Type Column */}
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs font-medium">
                          {getMimeTypeCategory(file.mimeType) === 'folder'
                            ? 'Folder'
                            : file.mimeType.split('/')[1] || 'File'}
                        </span>
                      </td>

                      {/* Modified Column */}
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {formatDate(file.modifiedTime)}
                      </td>

                      {/* Size Column */}
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {formatFileSize(file.size)}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <a
                            href={`https://drive.google.com/open?id=${file.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-md transition-colors"
                            title="Open in Google Drive"
                          >
                            <ExternalLinkIcon size={16} />
                            <span className="hidden sm:inline text-xs font-medium">View</span>
                          </a>
                          {getMimeTypeCategory(file.mimeType) !== 'folder' && (
                            <a
                              href={`https://drive.google.com/u/0/uc?id=${file.id}&export=download`}
                              download
                              className="inline-flex items-center gap-2 px-3 py-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-md transition-colors"
                              title="Download file"
                            >
                              <DownloadIcon size={16} />
                              <span className="hidden sm:inline text-xs font-medium">Download</span>
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="bg-slate-900/50 border-t border-slate-700 px-6 py-3">
              <p className="text-sm text-slate-400">
                Showing {files.length} file{files.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}