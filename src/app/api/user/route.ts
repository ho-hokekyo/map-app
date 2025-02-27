import {NextRequest, NextResponse} from 'next/server';
import prisma
 from '@/lib/prisma';
// use prisma and get, post user data


export async function POST(request: NextRequest) {
    if(!request.body){
        return NextResponse.json({ error: 'email and name are required' }, { status: 400 });
    }
    const { email, name } = await request.json();
    if (!email || !name) {
        return NextResponse.json({ error: 'email and name are required' }, { status: 400 });
    }
    const user = await prisma.user.create({
        data: {
            email,
            name,
        },
    });
    return NextResponse.json(user, { status: 201 });
  
}

// get all user data

export async function GET() {
    try{
        const users = await prisma.user.findMany();
        return NextResponse.json(users, { status: 200 });
    }catch(error: unknown){
        if (error instanceof Error){
            console.error(error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }else{
            console.error('An unknown error occurred');
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
    
}