"use client";

import { useEffect, useState } from 'react';
import { fetchGoogleDriveFiles } from '@/services/googleDriveService';
import { truncateString, formatDate, formatFileSize } from '@/utils/format';
import { getFileCategory, filterFilesByCategories, FileCategory } from '@/utils/fileTypeUtils';
import { FileTypeFilter } from '@/components/ui/FileTypeFilter';
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
  const [selectedCategories, setSelectedCategories] = useState<FileCategory[]>(['workspaces']);
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
    <div className="w-full bg-[#080808]">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <div className="mb-4 text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500">LIBRARY</div>
          <h1 className="mb-8 text-5xl lg:text-6xl font-serif font-light tracking-[0.05em] text-white uppercase" style={{ fontFamily: 'var(--font-display), serif' }}>Google Drive</h1>
          <div className="h-px w-24 bg-white/20 mb-8"></div>
          <p className="text-gray-500 text-[12px] font-sans leading-relaxed tracking-widest">Your files and folders</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 bg-[#121212] border-l-4 border-l-red-500 pl-6 py-4 font-sans rounded-r">
            <p className="text-[12px] font-semibold text-red-200 mb-2">Unable to Load Files</p>
            <p className="text-[12px] text-red-300">{error}</p>
            <p className="text-[11px] text-red-400/70 mt-2">Please make sure your Google account is connected properly.</p>
          </div>
        )}

        {/* Main Grid: Content + Filter */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
          {/* Left: 2/3 - Files Section */}
          <div className="lg:col-span-2">
            {/* Loading State */}
            {loading && (
              <div className="mb-8 flex h-40 w-full items-center justify-center border border-white/5 bg-[#121212] rounded-sm">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-gray-600 border-t-white mb-4"></div>
                  <p className="text-[12px] font-sans text-gray-400 tracking-widest uppercase">Loading your files...</p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && files.length === 0 && (
              <div className="border border-white/5 bg-[#121212] p-12 md:p-16 text-center font-sans rounded-sm">
                <FolderIcon size={56} className="mx-auto mb-6 text-gray-700" />
                <h3 className="text-[14px] font-sans font-semibold mb-3 tracking-widest uppercase text-white">No Files Found</h3>
                <p className="text-gray-500 text-[12px] leading-relaxed mb-4 max-w-md mx-auto">
                  Your Google Drive is empty or you don't have permission to view these files. Try connecting your account or checking your permissions.
                </p>
                <p className="text-gray-600 text-[11px] tracking-widest uppercase">Showing workspace files only</p>
              </div>
            )}

            {/* Files Table */}
            {!loading && !error && files.length > 0 && (
              <div className="w-full border border-white/5 bg-[#121212] rounded-sm overflow-hidden">
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead>
                      <tr className="bg-[#121212] border-b border-white/5 hover:bg-[#121212]">
                        <th className="px-4 md:px-6 py-4 text-left text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500">Name</th>
                        <th className="px-4 md:px-6 py-4 text-left text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500 hidden sm:table-cell">Type</th>
                      <th className="px-4 md:px-6 py-4 text-left text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500 hidden md:table-cell">Modified</th>
                      <th className="px-4 md:px-6 py-4 text-left text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500 hidden lg:table-cell">Size</th>
                      <th className="px-4 md:px-6 py-4 text-left text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterFilesByCategories(files, selectedCategories).map((file) => (
                      <tr
                        key={file.id}
                        className="border-b border-white/3 hover:bg-[#1A1A1A] transition-colors"
                      >
                        {/* Name Column */}
                        <td className="px-4 md:px-6 py-4 text-xs md:text-[12px] font-sans">
                          <div className="flex items-center gap-3 min-w-0">
                            {getFileIcon(file.mimeType)}
                            <span
                              className="text-white font-medium truncate"
                              title={file.name}
                            >
                              {truncateString(file.name, 30)}
                            </span>
                          </div>
                        </td>

                        {/* Type Column */}
                        <td className="px-4 md:px-6 py-4 text-xs font-sans hidden sm:table-cell">
                          <span className="text-[11px] text-gray-500">
                            {getMimeTypeCategory(file.mimeType) === 'folder'
                              ? 'Folder'
                              : file.mimeType.split('/')[1] || 'File'}
                          </span>
                        </td>

                        {/* Modified Column */}
                        <td className="px-4 md:px-6 py-4 text-xs text-gray-500 font-sans hidden md:table-cell">
                          {formatDate(file.modifiedTime)}
                        </td>

                        {/* Size Column */}
                        <td className="px-4 md:px-6 py-4 text-xs text-gray-500 font-sans hidden lg:table-cell">
                          {formatFileSize(file.size)}
                        </td>

                        {/* Actions Column */}
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                            <a
                              href={`https://drive.google.com/open?id=${file.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-sans font-medium text-white hover:text-gray-300 transition-colors uppercase tracking-widest hover:bg-white/5 px-2 py-1.5 rounded"
                              title="Open in Google Drive"
                            >
                              View →
                            </a>
                            {getMimeTypeCategory(file.mimeType) !== 'folder' && (
                              <a
                                href={`https://drive.google.com/u/0/uc?id=${file.id}&export=download`}
                                className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-sans font-medium text-white hover:text-gray-300 transition-colors uppercase tracking-widest hover:bg-white/5 px-2 py-1.5 rounded"
                                title="Download file"
                              >
                                Download
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Footer */}
                <div className="bg-[#121212] border-t border-white/5 px-4 md:px-6 py-4 font-sans rounded-b-sm">
                  <p className="text-[11px] text-gray-500">
                    Showing <span className="text-white font-semibold">{filterFilesByCategories(files, selectedCategories).length}</span> of <span className="text-white font-semibold">{files.length}</span> file{files.length !== 1 ? 's' : ''}
                  </p>
                </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: 1/3 - Filter Panel */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="sticky top-4 lg:top-20">
              <FileTypeFilter
                selectedCategories={selectedCategories}
                onCategoriesChange={setSelectedCategories}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}