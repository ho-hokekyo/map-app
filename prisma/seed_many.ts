import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import prisma from '@/lib/prisma';

async function main() {
    console.log('Seeding database...');

    // 5 Users with 2 images each
    const users = await Promise.all(
        Array.from({ length: 5 }).map(() =>
            prisma.user.create({
                data: {
                    id: uuidv4(),
                    name: `User_${uuidv4().slice(0, 8)}`,
                    email: `user_${uuidv4().slice(0, 8)}@example.com`,
                    hashedpassword: `password_${uuidv4().slice(0, 8)}`,
                    images: {
                        create: Array.from({ length: 2 }).map(() => ({
                            id: uuidv4(),
                            fileName: `image_${uuidv4().slice(0, 8)}.jpg`,
                            originalUrl: `https://example.com/original/${uuidv4()}`,
                            generatedUrl: `https://example.com/generated/${uuidv4()}`,
                            expiration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days later
                            latitude: Math.random() * 180 - 90,
                            longitude: Math.random() * 360 - 180,
                            description: `Description for ${uuidv4().slice(0, 8)}`,
                            prompt: `Prompt for ${uuidv4().slice(0, 8)}`,
                            tag: `Tag_${uuidv4().slice(0, 8)}`,
                        })),
                    },
                },
            }),
        ),
    );

    // Collect all images created
    const allImages = await prisma.image.findMany();

    // 1000 Users randomly liking existing images
    await Promise.all(
        Array.from({ length: 1000 }).map(async () => {
            const user = await prisma.user.create({
                data: {
                    id: uuidv4(),
                    name: `User_${uuidv4().slice(0, 8)}`,
                    email: `user_${uuidv4().slice(0, 8)}@example.com`,
                    hashedpassword: `password_${uuidv4().slice(0, 8)}`,
                },
            });

            const likedImages = allImages
                .sort(() => Math.random() - 0.5)
                .slice(0, Math.floor(Math.random() * 5) + 1);

            await prisma.favorite.createMany({
                data: likedImages.map((image) => ({
                    id: uuidv4(),
                    userId: user.id,
                    imageId: image.id,
                })),
            });
        }),
    );

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
