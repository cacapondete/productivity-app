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

type PocketBaseAbortError = Error & {
  isAbort?: boolean;
};

function isPocketBaseAbortError(error: unknown): error is PocketBaseAbortError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAbort' in error &&
    Boolean((error as PocketBaseAbortError).isAbort)
  );
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
        const data = await fetchGoogleDriveFiles();
        if (isMounted) {
          setFiles(data.files || []);
        }
      } catch (err) {
        if (isMounted) {
          if (isPocketBaseAbortError(err)) {
            return;
          }
          const message = err instanceof Error ? err.message : 'Failed to load files';
          setError(message);
          console.error('Error loading files:', err);
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
    <div className="w-full bg-[#FFFFFF]">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8 lg:px-20 py-6 md:py-10 lg:py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-serif font-bold tracking-tight lg:text-5xl" style={{ fontFamily: 'var(--font-display), serif' }}>Google Drive</h1>
          <div className="h-px w-16 bg-black mb-6"></div>
          <p className="text-gray-600 text-[11px] font-sans leading-relaxed">Your files and folders</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-white border-l-2 border-l-black pl-4 py-3 font-sans">
            <p className="text-[11px] text-gray-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
            <div className="mb-6 flex h-32 w-full items-center justify-center border border-black/8 bg-white">
              <p className="text-[11px] font-serif font-semibold uppercase tracking-[0.22em] text-black">
                Loading...
              </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && files.length === 0 && (
          <div className="border border-black/8 bg-white p-12 text-center font-sans">
            <FolderIcon size={48} className="mx-auto mb-6 text-gray-400" />
            <h3 className="text-[13px] font-sans font-medium mb-3 tracking-wide uppercase">No files found</h3>
            <p className="text-gray-600 text-[11px] leading-relaxed">
              Your Drive is empty or the access token does not have permission to view your files.
            </p>
          </div>
        )}

        {/* Files Table */}
        {!loading && !error && files.length > 0 && (
          <div className="w-full overflow-hidden border border-black/8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white border-b border-black/8">
                    <th className="px-4 md:px-6 py-3 text-left text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-black">Name</th>
                    <th className="px-4 md:px-6 py-3 text-left text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-black hidden sm:table-cell">Type</th>
                    <th className="px-4 md:px-6 py-3 text-left text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-black hidden md:table-cell">Modified</th>
                    <th className="px-4 md:px-6 py-3 text-left text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-black hidden lg:table-cell">Size</th>
                    <th className="px-4 md:px-6 py-3 text-left text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr
                      key={file.id}
                      className="border-b border-black/8 hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Name Column */}
                      <td className="px-4 md:px-6 py-4 text-xs md:text-[11px] font-sans">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.mimeType)}
                          <span
                            className="text-black font-medium truncate text-[12px]"
                            title={file.name}
                          >
                            {truncateString(file.name, 30)}
                          </span>
                        </div>
                      </td>

                      {/* Type Column */}
                      <td className="px-4 md:px-6 py-4 text-xs font-sans hidden sm:table-cell">
                        <span className="text-[11px] text-gray-600">
                          {getMimeTypeCategory(file.mimeType) === 'folder'
                            ? 'Folder'
                            : file.mimeType.split('/')[1] || 'File'}
                        </span>
                      </td>

                      {/* Modified Column */}
                      <td className="px-4 md:px-6 py-4 text-xs text-gray-600 font-sans hidden md:table-cell">
                        {formatDate(file.modifiedTime)}
                      </td>

                      {/* Size Column */}
                      <td className="px-4 md:px-6 py-4 text-xs text-gray-600 font-sans hidden lg:table-cell">
                        {formatFileSize(file.size)}
                      </td>

                      {/* Actions Column */}
                      <td className="px-3 md:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://drive.google.com/open?id=${file.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-sans font-medium text-black hover:text-gray-700 transition-colors tracking-wide"
                            title="Open in Google Drive"
                          >
                            View →
                          </a>
                          {getMimeTypeCategory(file.mimeType) !== 'folder' && (
                            <a
                              href={`https://drive.google.com/u/0/uc?id=${file.id}&export=download`}
                              className="inline-flex items-center gap-1 text-[11px] font-sans font-medium text-black hover:text-gray-700 transition-colors tracking-wide"
                              title="Download file"
                            >
                              Download ↓
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
            <div className="bg-white border-t border-black/8 px-4 md:px-6 py-3 md:py-4 font-sans">
              <p className="text-[11px] text-gray-600">
                Showing {files.length} file{files.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}