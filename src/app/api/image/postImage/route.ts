import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import { get } from "http";
import { getSession } from "next-auth/react";


export async function POST(request: NextRequest) {

    try{
        const formData = await request.formData();
        const imageFile = formData.get("image") as File;
        const fileName = uuidv4();

        const SignedUrlForUpload = await fetch(`/api/image/postImage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({fileName})
        });

        const isUpload = await fetch(SignedUrlForUpload.url, {method: "POST", body: imageFile});

        if (!isUpload.ok) {
            console.log("upload failed");
            return NextResponse.json({error: "upload failed"}, {status: 500});
        }

        // generate image

        const generatedUrl = "https://images.unsplash.com/photo-1519810755548-39cd217da494?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        const generatedImage = await fetch('generatedUrl', {method: "GET"});
  
        const SignedUrlForUploadGeneatedImage = await fetch(`/api/image/postImage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({fileName})
        });

        const isUploadGeneratedImage = await fetch(SignedUrlForUploadGeneatedImage.url, {method: "POST", body: imageFile}); // imageFile => generatedImage: File

        if (!isUploadGeneratedImage.ok) {
            console.log("upload failed");
            return NextResponse.json({error: "upload failed"}, {status: 500});
        }

        const user = getSessionUser();

        const image = prisma.image.create({
            data:{
                generatedUrl: generatedUrl,
                originalUrl: SignedUrlForUpload.url,
                fileName: fileName,
            }
        })

        return NextResponse.json({image}, {status: 200});
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


