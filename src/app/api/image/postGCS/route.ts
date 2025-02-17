import { Storage } from "@google-cloud/storage";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

  const storage = new Storage()
  const bucketName = process.env.BUCKET_NAME ?? '';
  const bucket = storage.bucket(bucketName);  
  
  const body = await request.json()
  const fileName = body.fileName  
  console.log("upload filename", fileName)
  const file = bucket.file(fileName);
  
  try{
    const options = {
      expires: Date.now() + 1 * 60 * 1000,
      field: { "x-goog-meta-test": "data" } 
    }

    const [res] = await file.generateSignedPostPolicyV4(options);
    console.log("upload response", res);
    return NextResponse.json(res, { status: 200 });
  }catch(error: unknown){
    if (error instanceof Error){
      console.error("Failed to get signed url", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 });

    }else{
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }

}
