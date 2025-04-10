import sharp from 'sharp';
import { ImageProcessor } from '@/lib//image/interface';

export class ResizeImageProcessor implements ImageProcessor {
    private maxWidth: number;

    constructor(maxWidth: number = 1024) {
        this.maxWidth = maxWidth;
    }

    async process(buffer: Buffer): Promise<Buffer> {
        const image = sharp(buffer);
        const metadata = await image.metadata();

        if (metadata.width && metadata.width > this.maxWidth) {
            const newImage = image.resize({ width: this.maxWidth });
            const newBuffer = await newImage.toBuffer();
            return sharp(buffer).jpeg({ quality: 80 }).toBuffer();
        } else {
            return buffer;
        }
    }
}

export class ConvertToPngProcessor implements ImageProcessor {
    async process(buffer: Buffer): Promise<Buffer> {
        return await sharp(buffer).toFormat('png').toBuffer();
    }
}

export class CompressImageProcessor implements ImageProcessor {
    private quality: number;

    constructor(quality: number = 80) {
        this.quality = quality;
    }

    async process(buffer: Buffer): Promise<Buffer> {
        if (buffer.length > 4 * 1024 * 1024) {
            let quality = this.quality;
            let newBuffer = buffer;
            while (newBuffer.length > 4 * 1024 * 1024 && quality > 50) {
                quality -= 10;
                newBuffer = await sharp(buffer).jpeg({ quality }).toBuffer();
            }
            return newBuffer;
        } else {
            return buffer;
        }
    }
}
