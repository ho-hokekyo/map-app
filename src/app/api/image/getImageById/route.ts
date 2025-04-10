import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Image } from '@/schema/modelSchema/ImageSchema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { imageId } = body;

        const image = await prisma.image.findUnique({
            where: { id: imageId },
            include: {
                user: true,
                favorites: true,
            },
        });
        if (!image) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }
        const { user, favorites, ...rest } = image;
        const outputImage = {
            ...rest,
            favoriteNum: image?.favorites.length,
            userName: image?.user.name,
        };

        return NextResponse.json(outputImage, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
