import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  const { body } = await request.json();

  try{
    // generate image
    const generateImageUrl = "https://images.unsplash.com/photo-1519810755548-39cd217da494?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    return NextResponse.json({ generateImageUrl: generateImageUrl }, { status: 200 });
  }catch(error: unknown){
    if (error instanceof Error){
        console.error(error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }else{
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}



}

