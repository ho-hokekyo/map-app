
import { NextRequest, NextResponse } from 'next/server';
export async function POST(request: NextRequest){

    const body = await request.json();
    const { lat, lon, zoom} = body;

    try {
        const prompt = "";
        return NextResponse.json({prompt: prompt}, {status: 200});
    }catch(error){
        return NextResponse.json({error: 'An unknown error occurred'}, {status: 500});
    }

}