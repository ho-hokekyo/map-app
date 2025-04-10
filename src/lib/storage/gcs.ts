import { StorageProvider, DirectoryType } from './interface';
import { Storage, Bucket, GetSignedUrlConfig } from '@google-cloud/storage';

class GCSStorage implements StorageProvider {
    private storage: Storage;
    private bucket: Bucket;

    constructor() {
        this.storage = new Storage();
        const bucketName = process.env.BUCKET_NAME ?? '';
        if (!bucketName) {
            throw new Error('BUCKET_NAME is not defined in environment variables');
        }
        this.bucket = this.storage.bucket(bucketName);
    }

    async upload(file: File, fileName: string, directoryType: DirectoryType): Promise<void> {
        const buffer = Buffer.from(await file.arrayBuffer());
        await new Promise((resolve, reject) => {
            const blob = this.bucket.file(directoryType + '/' + fileName + '.png');
            const blobStream = blob.createWriteStream({
                resumable: false,
            });

            blobStream.on('error', (err) => reject(err)).on('finish', () => resolve(true));
            blobStream.end(buffer);
        });
    }

    // 未実装
    async delete(fileName: string): Promise<void> {
        // await this.bucket.file(fileName).delete();
    }

    // GCSのURLを取得する関数: ここでは署名付きURLを発行する
    async getUrl(fileName: string, directoryType: DirectoryType): Promise<string> {
        const file = this.bucket.file(directoryType + '/' + fileName + '.png');
        const options = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // max 7 days
        };
        const [url] = await file.getSignedUrl(options as GetSignedUrlConfig);

        if (!url) {
            throw new Error('Failed to get signed URL');
        }
        return url;
    }
}

export default GCSStorage;
