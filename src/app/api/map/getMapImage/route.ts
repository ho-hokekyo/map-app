import {NextRequest, NextResponse} from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    const body = await request.json();

    const {minLatitude, maxLatitude, minLongitude, maxLongitude, zoom} = body;
    console.log(minLatitude, maxLatitude, minLongitude, maxLongitude, zoom);
    try{
        const Images =  await prisma.image.findMany({
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
            select: {
                id: true,
                generatedUrl: true,
                latitude: true,
                longitude: true,
            }

        });
        console.log(Images);

        return NextResponse.json(Images, {status: 200});
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