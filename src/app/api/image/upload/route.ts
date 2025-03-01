import { Storage } from "@google-cloud/storage";
import { NextRequest, NextResponse } from "next/server";
 
// Upload image : image -> SignedUrl
export async function POST(request: NextRequest) {

    const storage = new Storage({
      projectId: process.env.PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
    })
    const bucketName = process.env.BUCKET_NAME ?? '';
    const bucket = storage.bucket(bucketName);  
    
    const body = await request.json()
    const fileName = body.fileName  
    const file = bucket.file(fileName);
    
    try{
      const options = {
        expires: Date.now() + 1 * 60 * 1000,
        field: { "x-goog-meta-test": "data" } 
      }
  
      const [res] = await file.generateSignedPostPolicyV4(options); // res.field, res.url
      console.log("upload response", res);
      return NextResponse.json(res, { status: 200 });
    }catch(error: unknown){
      if (error instanceof Error){
        console.error(error.message)
        return NextResponse.json({ error: error.message }, { status: 500 });
  
      }else{
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
      }
    }
  
  }