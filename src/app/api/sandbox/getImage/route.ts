

import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { NextResponse, NextRequest } from 'next/server';



export async function POST(request: NextRequest) {
  
    if (!request.url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    const urlParam = new URL(request.url).searchParams;
    const fileName = urlParam.get('fileName');
    if (!fileName) {
      return NextResponse.json({ error: 'file name is required' }, { status: 400 });
    }
    console.log("projectId", process.env.GCS_PROJECT_ID)
    console.log("testkey", process.env.TEST_KEY);
    console.log("credential", process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    

    const storage = new Storage();

  
    const bucketName = process.env.BUCKET_NAME ?? '';
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);
    console.log("file", fileName)
  
    try{

      const options = {
        version: 'v4',
        action: "read",
        expires: Date.now() + 1 * 60 * 1000,
      }
      console.log("options", options)
      const [url] = await file.getSignedUrl(options as GetSignedUrlConfig);
      return NextResponse.json({ url }, { status: 200 });
  
    }catch(error: unknown){
      if (error instanceof Error) {
        console.error(error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      } else {
        console.error('An unknown error occurred');
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
      }
    }
  
  }