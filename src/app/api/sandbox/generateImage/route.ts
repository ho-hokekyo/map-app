import {NextResponse, NextRequest} from 'next/server';


export async function POST(req: NextRequest) {
  const { body } = req;
  const { text } = await req.json();


  
  const fileName = {fileName: "dummy"}
//   const response = await fetch("")

  return NextResponse.json({fileName});
}