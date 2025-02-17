import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { img2img } from "@/lib/image/img2img";

export const prerender = false;
export async function POST(request: NextRequest) {

    try{
        const formData = await request.formData();
        // const body = await request.json();
        console.log("formData", formData);

        const imageFile = formData.get("file") as File;
        if (!imageFile || typeof imageFile === "string") {
            throw new Error("image file not found");

        }
        const fileName = uuidv4();

        const SignedUrlForUpload = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/image/postGCS`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({fileName: "original/" + fileName})
        });
        const {url, fields} = await SignedUrlForUpload.json();
        
        const body = new FormData();
        Object.entries({ ...fields, imageFile }).forEach(([key, value]) => {
            body.append(key, value as string | Blob );
        });
        console.log("imageFile", imageFile);    
        console.log("body", body);
        console.log("url", url);
        const isUpload = await fetch(url, {method: "POST", body:body});
        

        if (!isUpload.ok) {
            console.log("upload failed");
            return NextResponse.json({error: "upload failed"}, {status: 500});
        }


        // generate image
        const generatedData = await img2img(imageFile);
        console.log("generatedData", generatedData);

        const generatedUrl = "https://images.unsplash.com/photo-1519810755548-39cd217da494?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        const generatedImage = await fetch('generatedUrl', {method: "GET"});
  
        const SignedUrlForUploadGeneatedImage = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/image/postGCS`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({fileName: "generated/" + fileName})
        });
        const {urlForGeneratedImage, _} = await SignedUrlForUploadGeneatedImage.json();

        const isUploadGeneratedImage = await fetch(urlForGeneratedImage, {method: "POST", body: imageFile}); // imageFile => generatedImage: File

        if (!isUploadGeneratedImage.ok) {
            console.log("upload failed: generated image");
            return NextResponse.json({error: "upload failed"}, {status: 500});
        }

        // get session for user data
        const session = await getServerSession();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        });

        if (!user){
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        console.log("user", user);

        const latitude = 10
        const longitude = 10


        const image = prisma.image.create({
            data:{
                userId: user.id,
                expiration: new Date( Date.now() + 1000 * 60 * 60 * 24 * 7),
                latitude: latitude,
                longitude: longitude,
                description: "sample description",
                prompt: "sample prompt",
                tag: "sample tag",
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


