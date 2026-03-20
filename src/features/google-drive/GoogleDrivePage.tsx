"use client";

import { useEffect, useState } from 'react';
import { fetchGoogleDriveFiles } from '@/services/googleDriveService';
import { truncateString, formatDate, formatFileSize } from '@/utils/format';
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
  const iconProps = { size: 18, className: 'text-black' };

  switch (category) {
    case 'folder':
      return <FolderIcon {...iconProps} />;
    case 'image':
      return <ImageIcon {...iconProps} />;
    case 'video':
      return <VideoIcon {...iconProps} />;
    default:
    return <FileIcon {...iconProps} />;
  }
};

export default function GoogleDrivePage() {
  const [files, setFiles] = useState<GoogleFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadFiles() {
      try {
        setLoading(true);
        const data = await fetchGoogleDriveFiles();
        if (isMounted) {
          setFiles(data.files || []);
        }
      } catch (err) {
        if (isMounted) {
          // Check if it's an abort/cancellation error (expected on unmount)
          if (err instanceof Error && (err.message.includes('abort') || err.message.includes('AutoCancel'))) {
            return; // Silently ignore auto-cancellation errors
          }
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadFiles();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-full lg:max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3 tracking-tight">Google Drive</h1>
          <div className="h-1 w-12 bg-black mb-4"></div>
          <p className="text-gray-600 text-sm font-sans">Your files and folders</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-white border-l-4 border-l-red-600 p-4 flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600 shrink-0" />
            <p className="text-red-600 text-sm font-sans">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-400 border-t-black"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && files.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 p-12 text-center font-sans">
            <FolderIcon size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-serif font-semibold mb-2 tracking-tight">No files found</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your Drive is empty or the access token does not have permission to view your files.
            </p>
          </div>
        )}

        {/* Files Table */}
        {!loading && !error && files.length > 0 && (
          <div className="border border-black overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-50 border-b border-black">
                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-black font-sans">Name</th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-black font-sans hidden sm:table-cell">Type</th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-black font-sans hidden md:table-cell">Modified</th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-black font-sans hidden lg:table-cell">Size</th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-black font-sans">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr
                      key={file.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      {/* Name Column */}
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm font-sans">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.mimeType)}
                          <span
                            className="text-black font-medium truncate"
                            title={file.name}
                          >
                            {truncateString(file.name, 30)}
                          </span>
                        </div>
                      </td>

                      {/* Type Column */}
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm font-sans hidden sm:table-cell">
                        <span className="px-2 md:px-3 py-1 bg-white text-black border border-black text-xs font-medium">
                          {getMimeTypeCategory(file.mimeType) === 'folder'
                            ? 'Folder'
                            : file.mimeType.split('/')[1] || 'File'}
                        </span>
                      </td>

                      {/* Modified Column */}
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-600 font-sans hidden md:table-cell">
                        {formatDate(file.modifiedTime)}
                      </td>

                      {/* Size Column */}
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-600 font-sans hidden lg:table-cell">
                        {formatFileSize(file.size)}
                      </td>

                      {/* Actions Column */}
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div className="flex items-center gap-1 md:gap-2">
                          <a
                            href={`https://drive.google.com/open?id=${file.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 md:px-3 py-2 bg-white border border-black text-black hover:bg-black hover:text-white transition-colors text-xs font-medium tracking-wide whitespace-nowrap"
                            title="Open in Google Drive"
                          >
                            <ExternalLinkIcon size={14} />
                            <span className="hidden md:inline">View</span>
                          </a>
                          {getMimeTypeCategory(file.mimeType) !== 'folder' && (
                            <a
                              href={`https://drive.google.com/u/0/uc?id=${file.id}&export=download`}
                              download
                            className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-black text-black hover:bg-black hover:text-white transition-colors text-xs font-sans font-medium whitespace-nowrap"
                            title="Download file"
                          >
                            <DownloadIcon size={14} />
                            <span className="hidden md:inline">Download</span>
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
            <div className="bg-gray-50 border-t border-black px-4 md:px-6 py-3 md:py-4 font-sans">
              <p className="text-xs text-gray-600">
                Showing {files.length} file{files.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}