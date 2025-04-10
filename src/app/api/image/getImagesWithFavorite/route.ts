import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
export async function POST(request: NextRequest) {
    try {
        // const session = await getServerSession()
        // const userId = session?.user?.id

        const userId = 'fjeaiefjaiefje';
        console.log('userId', userId);
        if (!userId) {
            return NextResponse.json({ error: 'userId is not found' }, { status: 400 });
        }

        const images = await prisma.image.findMany({
            include: {
                _count: {
                    select: {
                        favorites: true,
                    },
                },
                favorites: {
                    where: {
                        userId: userId,
                    },
                    select: {
                        id: true,
                    },
                },
            },
        });

        const imagesWithFavorite = images.map((image) => {
            const isFavorite = image.favorites.length > 0;
            const favoriteCount = image._count.favorites;

            return {
                ...image,
                favoriteCount: favoriteCount,
                likedByUser: isFavorite,
            };
        });

        return NextResponse.json(imagesWithFavorite, { status: 200 });
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
