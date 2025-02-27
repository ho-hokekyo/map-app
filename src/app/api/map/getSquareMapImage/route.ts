import {NextRequest, NextResponse} from 'next/server';
import prisma from '@/lib/prisma';

import {Image} from '@/schema/modelSchema/ImageSchema';
import {Favorite} from '@/schema/modelSchema/FavoriteSchema';
export async function POST(request: NextRequest) {
    const body = await request.json();

    const {minLatitude, maxLatitude, minLongitude, maxLongitude, zoom} = body;
    console.log(minLatitude, maxLatitude, minLongitude, maxLongitude, zoom);
    // Todo : sort, limit
    try{
        const Images =  await prisma.image.findMany({
            // 緯度経度の範囲を最小値と最大値で指定する
            where: {
                latitude: {
                    gte: minLatitude,
                    lte: maxLatitude,
                },
                longitude: {
                    gte: minLongitude,
                    lte: maxLongitude,
                },      
            
            },
            include: {
                favorites: true,
            }

        });
        
        // favoritesの数を取得、配列を消してfavoriteの数を追加
        const outputImages = Images.map((image: Image & { favorites: Favorite[]}) => {
            const { favorites, ...rest} = image;
            return {
                ...rest,
                favorite: image.favorites.length,
            };
        });
        console.log(outputImages);
        // console.log(Images);

        return NextResponse.json(outputImages, {status: 200});
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