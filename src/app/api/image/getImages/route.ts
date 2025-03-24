import {NextRequest, NextResponse} from 'next/server';
import prisma from '@/lib/prisma';
import { Image } from '@/schema/modelSchema/ImageSchema';
import { Favorite } from '@/schema/modelSchema/FavoriteSchema';

export async function POST(request: NextRequest) {
    
    try{
        const body = await request.json();
        const {num} = body;

        const images = await prisma.image.findMany({
            take: num,
            // include:{
            //     favorites: true,
            // }
        });
        // const outputImages = images.map((image: Image & { favorites: Favorite[]}) => {
        //     const { favorites, ...rest} = image;
        //     return {
        //         ...rest,
        //         favoriteNum: image.favorites.length,
        //     };
        // });
        
        return NextResponse.json(images, {status:200})
    }catch(error: unknown){
        if (error instanceof Error){
            console.error(error.message);
            return NextResponse.json({error: error.message}, {status: 500});
        }else{
            console.error('An unknown error occurred');
            return NextResponse.json({error: 'An unknown error occurred'}, {status: 500});
        }
    }
}