import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import prisma from '@/lib/prisma';
import GCSStorage from '@/lib/storage/gcs';
import { ImageProcessorPipeline } from '@/lib/image/imageProcessorPipeline';
import { img2imgProcessor } from '@/lib/image/processor/img2img';
import {
    ConvertToPngProcessor,
    CompressImageProcessor,
    ResizeImageProcessor,
} from '@/lib/image/processor/preprocess';

import { Image } from '@/schema/modelSchema/ImageSchema';
import { getServerSession } from 'next-auth';
export async function POST(request: Request) {
    try {
        // アップロードされたデータの取得
        const formData = await request.formData();
        const latitude = Number(formData.get('latitude'));
        const longitude = Number(formData.get('longitude'));
        const title = formData.get('title') as string;
        const imageFile = formData.get('file');
        if (!imageFile || typeof imageFile === 'string') {
            throw new Error('image file not found');
        }

        // ToDo: Validation
        // const Input
        console.log('latitude', latitude);
        console.log('longitude', longitude);
        console.log('title', title);

        // generate unique filename
        const fileName = uuidv4();

        const storage = new GCSStorage();

        // 元画像の保存
        await storage.upload(imageFile, fileName, 'original');

        // 画像変換のパイプラインを作成
        const pipeline = new ImageProcessorPipeline();
        pipeline.addProcessor(new ConvertToPngProcessor());
        pipeline.addProcessor(new ResizeImageProcessor(1024));
        pipeline.addProcessor(new CompressImageProcessor(8));
        const prompt =
            'A vibrant fantasy cityscape, glowing magical lights on the streets, colorful crystal-like buildings, floating lanterns in the sky, a mystical atmosphere, lush greenery intertwined with urban architecture, a warm and dreamy sunset sky with pink, purple, and gold hues. The scene feels enchanting, with a touch of magic and wonder';
        pipeline.addProcessor(new img2imgProcessor('prompt'));

        // 変換の実行
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const generatedImage: Buffer = await pipeline.execute(buffer);
        // make file from buffer
        const generatedImageFile: File = new File([generatedImage], fileName + '.png', {
            type: 'image/png',
        });

        // 生成画像の保存
        await storage.upload(generatedImageFile, fileName, 'generated');

        const originalUrl: string = await storage.getUrl(fileName, 'original');
        const generatedUrl: string = await storage.getUrl(fileName, 'generated');

        const session = await getServerSession();
        if (!session || !session.user || !session.user.email) {
            throw new Error('User not authenticated');
        }

        // userの取得
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // DBに保存
        const image: Image = await prisma.image.create({
            data: {
                userId: user.id,
                expiration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                latitude: latitude,
                longitude: longitude,
                description: title,
                prompt: prompt,
                tag: 'sample tag',
                generatedUrl: generatedUrl,
                originalUrl: originalUrl,
                fileName: fileName,
            },
        });

        // 通知
        // 処理完了の通知
        if (!global.io) {
            throw new Error('Custom Server for notification (Socket.io) is not initialized');
        }
        global.io.to(session.user.id).emit('success notification');
        global.io.emit('new post was created', { imageId: image.id });

        return NextResponse.json(image, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
