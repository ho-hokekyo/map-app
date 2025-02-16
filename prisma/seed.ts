import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. ユーザー作成
  const user = await prisma.user.findUnique({
    where: {email: "a@gmail.com"},
  })
  if (!user){
    return console.error("User not found");
  }

  console.log(`Created user: ${user.email}`);

  // 2. 画像データを5つ作成
  const images = await prisma.image.createMany({
    data: [
      {
        id: "1",
        userId: user.id,
        fileName: "image1.jpg",
        originalUrl: "https://images.unsplash.com/photo-1470955233021-2c79a52e5034?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        generatedUrl: "https://images.unsplash.com/photo-1470955233021-2c79a52e5034?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7日後に有効期限
        latitude: 35.6895,
        longitude: 139.6917,
        description: "Tokyo Tower at night",
        prompt: "A beautiful night view of Tokyo Tower",
        tag: "landscape",
      },
      {
        id: "2",
        userId: user.id,
        fileName: "image2.png",
        originalUrl: "https://images.unsplash.com/photo-1470955233021-2c79a52e5034?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        generatedUrl: "https://images.unsplash.com/photo-1470955233021-2c79a52e5034?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        latitude: 35.7101,
        longitude: 139.8107,
        description: "Los Angeles skyline",
        prompt: "A modern cityscape of LA",
        tag: "city",
      },
      {
        id: "3",
        userId: user.id,
        fileName: "image3.png",
        originalUrl: "https://images.unsplash.com/photo-1470955233021-2c79a52e5034?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        generatedUrl: "https://images.unsplash.com/photo-1470955233021-2c79a52e5034?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        latitude: 35.6586,
        longitude: 139.7454,
        description: "Big Ben in London",
        prompt: "A historical view of Big Ben",
        tag: "monument",
      },
      {
        id: "4",
        userId: user.id,
        fileName: "image4.jpg",
        originalUrl: "https://images.unsplash.com/photo-1470955233021-2c79a52e5034?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        generatedUrl: "https://images.unsplash.com/photo-1470955233021-2c79a52e5034?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        latitude: 35.7295,
        longitude: 139.7111,
        description: "Eiffel Tower at sunset",
        prompt: "A romantic view of the Eiffel Tower",
        tag: "landmark",
      },
      {
        id: "5",
        userId: user.id,
        fileName: "image5.jpg",
        originalUrl: "https://images.unsplash.com/photo-1470955233021-2c79a52e5034?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        generatedUrl: "https://images.unsplash.com/photo-1470955233021-2c79a52e5034?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        latitude: 35.6764,
        longitude: 139.6993,
        description: "New York skyline",
        prompt: "A breathtaking view of New York City",
        tag: "skyline",
      },
    ],
  });

  console.log(`Inserted ${images.count} images.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
