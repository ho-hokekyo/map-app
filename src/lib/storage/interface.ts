export type DirectoryType = 'original' | 'generated';

export interface StorageProvider {
    upload: (file: File, fileName: string, directoryType:DirectoryType) => Promise<void>;
    delete: (fileName: string, directoryType: DirectoryType) => Promise<void>;
    getUrl: (fileName: string, directoryType: DirectoryType) => Promise<string>;
}