import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Image } from '@/schema/modelSchema/ImageSchema'

export async function POST(request: NextRequest){
    try{
        // 期限切れurlのアップデート
        const images: Image[] = await prisma.image.findMany(); 
        const date = new Date();
        // expirationが現在時刻よりも前の場合、更新する
        const updatedImages = images.map(async (image:Image) => {
            if(image.expiration! > date){
                const fileName = image.fileName;

                // generatedUrlの取得
                const SignedGeneratedImageUrlResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/image/getGCS`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({fileName: "generated/" + fileName + ".png"})
                });
                const {url: ImageUrl} = await SignedGeneratedImageUrlResponse.json();

                console.log("fileName", fileName);
                return prisma.image.update({
                    where: {
                        id: image.id
                    },
                    data: {
                        expiration: new Date( Date.now() + 1000 * 60 * 60 * 24 * 7),
                        generatedUrl: ImageUrl
                    }
                });
            }
        });
        return NextResponse.json(updatedImages, {status: 200});
    }catch(error){
        if (error instanceof Error){
            console.error(error.message);
            return NextResponse.json({error: error.message}, {status: 500});
        }else{
            console.error('An unknown error occurred');
            return NextResponse.json({error: 'An unknown error occurred'}, {status: 500});
        }
    }
}