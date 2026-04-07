'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchGoogleDriveFiles } from '@/services/googleDriveService';
import { filterFilesByCategories, FileCategory } from '@/utils/fileTypeUtils';
import { truncateString, formatDate } from '@/utils/format';
import { FileTypeFilter } from '@/components/ui/FileTypeFilter';
import {
  FileIcon,
  FolderIcon,
  ImageIcon,
  VideoIcon,
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

interface GoogleDriveContextType {
  files: GoogleFile[];
  filteredFiles: GoogleFile[];
  selectedCategories: FileCategory[];
  setSelectedCategories: (categories: FileCategory[]) => void;
  loading: boolean;
  error: string | null;
  hasFiles: boolean;
}

const GoogleDriveContext = createContext<GoogleDriveContextType | null>(null);

export function useGoogleDriveContext() {
  const context = useContext(GoogleDriveContext);
  if (!context) {
    throw new Error('useGoogleDriveContext must be used within GoogleDriveProvider');
  }
  return context;
}

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
  const iconProps = { size: 16, className: 'text-gray-400' };

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

export function useGoogleDriveFiles() {
  const [files, setFiles] = useState<GoogleFile[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<FileCategory[]>(['workspaces', 'images', 'videos', 'other', 'folder']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFiles() {
      try {
        setError(null);
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
          console.error('Error loading Drive files:', err);
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

  const filteredFiles = filterFilesByCategories(files, selectedCategories).slice(0, 5);
  const hasFiles = files.length > 0;

  return {
    files,
    filteredFiles,
    selectedCategories,
    setSelectedCategories,
    loading,
    error,
    hasFiles,
  };
}

export function GoogleDriveDashboardView({ 
  filteredFiles, 
  loading, 
  error, 
  hasFiles 
}: { 
  filteredFiles: GoogleFile[]; 
  loading: boolean; 
  error: string | null; 
  hasFiles: boolean;
}) {
  return (
    <div className="w-full border-b border-white/5 pb-12 lg:pb-16">
      <div className="mb-4 text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500">
        LIBRARY
      </div>
      <h2 className="mb-6 text-2xl lg:text-3xl font-serif font-light tracking-[0.05em] text-white uppercase">Google Drive</h2>
      <p className="mb-8 max-w-lg text-[13px] leading-relaxed text-gray-400">
        Access your latest files and media assets. Filter by type to find what you need.
      </p>

      {/* Loading State */}
      {loading && (
        <div className="border border-white/5 bg-[#121212] p-6 text-[12px] text-gray-400 mb-8">
          Loading your Google Drive files...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="border border-white/5 bg-[#121212] p-6 text-[12px] text-gray-300 mb-8">
          <p className="mb-2">{error}</p>
          <p className="text-[11px] text-gray-500">Please check your Google authentication on the Google Drive page.</p>
        </div>
      )}

      {/* Files */}
      {!loading && !error && hasFiles && filteredFiles.length > 0 ? (
        <div className="space-y-3 mb-8">
          {filteredFiles.map((file) => (
            <div key={file.id} className="border border-white/5 bg-[#121212] p-4 flex items-center justify-between hover:bg-[#1A1A1A] transition-colors">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {getFileIcon(file.mimeType)}
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-white truncate" title={file.name}>
                    {truncateString(file.name, 40)}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                    {formatDate(file.modifiedTime)}
                  </p>
                </div>
              </div>
              <div className="shrink-0 ml-4">
                <a
                  href={`https://drive.google.com/open?id=${file.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-sans font-semibold text-white hover:text-gray-300 transition-colors uppercase tracking-widest"
                >
                  View →
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && !error && hasFiles ? (
        <div className="border border-white/5 bg-[#121212] p-6 text-[12px] text-gray-400 mb-8">
          No files match the selected filter.
        </div>
      ) : !loading && !error ? (
        <div className="border border-white/5 bg-[#121212] p-6 text-[12px] text-gray-400 mb-8">
          No Google Drive files available.
        </div>
      ) : null}

      <a
        href="/google-drive"
        className="group inline-flex items-center gap-3 text-[12px] font-sans font-semibold uppercase tracking-widest text-white transition-colors hover:text-gray-300"
      >
        <span>Browse All Files</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </a>
    </div>
  );
}

function GoogleDriveProvider({ children }: { children: ReactNode }) {
  const googleDriveContext = useGoogleDriveFiles();

  return (
    <GoogleDriveContext.Provider value={googleDriveContext}>
      {children}
    </GoogleDriveContext.Provider>
  );
}

export function GoogleDriveDashboardContainer() {
  return (
    <GoogleDriveContentView />
  );
}

export function GoogleDriveDashboardProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <GoogleDriveProvider>
      {children}
    </GoogleDriveProvider>
  );
}

function GoogleDriveContentView() {
  const { filteredFiles, loading, error, hasFiles } = useGoogleDriveContext();

  return (
    <div className="w-full border-b border-white/5 pb-12 lg:pb-16">
      <div className="mb-4 text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500">
        LIBRARY
      </div>
      <h2 className="mb-6 text-2xl lg:text-3xl font-serif font-light tracking-[0.05em] text-white uppercase">Google Drive</h2>
      <p className="mb-8 max-w-lg text-[13px] leading-relaxed text-gray-400">
        Access your latest files and media assets. Filter by type to find what you need.
      </p>

      {/* Loading State */}
      {loading && (
        <div className="border border-white/5 bg-[#121212] p-6 text-[12px] text-gray-400 mb-8">
          Loading your Google Drive files...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="border border-white/5 bg-[#121212] p-6 text-[12px] text-gray-300 mb-8">
          <p className="mb-2">{error}</p>
          <p className="text-[11px] text-gray-500">Please check your Google authentication on the Google Drive page.</p>
        </div>
      )}

      {/* Files */}
      {!loading && !error && hasFiles && filteredFiles.length > 0 ? (
        <div className="space-y-3 mb-8">
          {filteredFiles.map((file) => (
            <div key={file.id} className="border border-white/5 bg-[#121212] p-4 flex items-center justify-between hover:bg-[#1A1A1A] transition-colors">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {getFileIcon(file.mimeType)}
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-white truncate" title={file.name}>
                    {truncateString(file.name, 40)}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                    {formatDate(file.modifiedTime)}
                  </p>
                </div>
              </div>
              <div className="shrink-0 ml-4">
                <a
                  href={`https://drive.google.com/open?id=${file.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-sans font-semibold text-white hover:text-gray-300 transition-colors uppercase tracking-widest"
                >
                  View →
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && !error && hasFiles ? (
        <div className="border border-white/5 bg-[#121212] p-6 text-[12px] text-gray-400 mb-8">
          No files match the selected filter.
        </div>
      ) : !loading && !error ? (
        <div className="border border-white/5 bg-[#121212] p-6 text-[12px] text-gray-400 mb-8">
          No Google Drive files available.
        </div>
      ) : null}

      <a
        href="/google-drive"
        className="group inline-flex items-center gap-3 text-[12px] font-sans font-semibold uppercase tracking-widest text-white transition-colors hover:text-gray-300"
      >
        <span>Browse All Files</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </a>
    </div>
  );
}

export function GoogleDriveFilterPanel() {
  const { selectedCategories, setSelectedCategories } = useGoogleDriveContext();

  return (
    <div className="w-full border-t border-white/5 pt-12 lg:pt-16">
      <div className="mb-6 text-[10px] font-sans font-semibold uppercase tracking-[0.15em] text-gray-500">
        File Types
      </div>
      <FileTypeFilter 
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
      />
    </div>
  );
}
