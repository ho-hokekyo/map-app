import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { Storage } from "@google-cloud/storage";
import  {img2img2}  from "@/lib/image/img2img";
// export const prerender = false;

import {Image} from "@/schema/modelSchema/ImageSchema";
import {convertImageToPng} from "@/lib/image/preprocess";


export async function POST(request: NextRequest) {

    try{
        const formData = await request.formData();
        // const body = await request.json();
        // console.log("formData", formData);
        const latitude = Number(formData.get("latitude"));
        const longitude = Number(formData.get("longitude"));
        const title = formData.get("title") as string;
        console.log("latitude", latitude);
        console.log("longitude", longitude);
        console.log("title", title);

        const imageFile = formData.get("file");
        if (!imageFile || typeof imageFile === "string") {
            throw new Error("image file not found");
        }
       

        const storage = new Storage();
        const bucketName = process.env.BUCKET_NAME ?? '';
        const bucket = storage.bucket(bucketName);

        // generate unique filename 
        const fileName = uuidv4();

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        await new Promise((resolve, reject) => {
            const blob = bucket.file("original/" + fileName + ".png");
            const blobStream = blob.createWriteStream({
                resumable: false,
            })

            blobStream.on("error", (err) => reject(err))
            .on("finish", () => resolve(true))

            blobStream.end(buffer);
        })
        console.log("upload filename", fileName)

        // generate image
        const convertedImageFile = await convertImageToPng(imageFile);
        // const generatedUrl = await img2img(convertedImageFile);
        
       
        // const generatedImageBlob = await generatedImageResponse.blob();
        // const generatedImage = new File([generatedImageBlob], "generatedImage.png", {type: "image/png"});

        const generatedImage = await img2img2(convertedImageFile);

        console.log("generatedImage", generatedImage);
        const bufferGenerated = Buffer.from(await generatedImage.arrayBuffer());
        await new Promise((resolve, reject) => {
            const blob = bucket.file("generated/" + fileName + ".png");
            const blobStream = blob.createWriteStream({
                resumable: false,
            })

            blobStream.on("error", (err) => reject(err))
            .on("finish", () => resolve(true))

            blobStream.end(bufferGenerated);
        })
        console.log("upload filename", fileName)
    
        
        // get signed url for get image
        const SignedOriginalImageUrlResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/image/getGCS`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({fileName: "original/" + fileName + ".png"})
        });
        const {url: originalImageUrl} = await SignedOriginalImageUrlResponse.json();
        console.log("originalImageUrl", originalImageUrl);
        // console.log(await SignedOriginalImageUrlResponse.json())

        const SignedGeneratedImageUrlResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/image/getGCS`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({fileName: "generated/" + fileName + ".png"})
        });
        const {url: generatedImageUrl} = await SignedGeneratedImageUrlResponse.json();
        console.log("generatedImageUrl", generatedImageUrl);


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

        


        const image:Image = await prisma.image.create({
            data:{
                
                userId: user.id,
                expiration: new Date( Date.now() + 1000 * 60 * 60 * 24 * 7),
                latitude: latitude,
                longitude: longitude,
                description: "sample description",
                prompt: "sample prompt",
                tag: "sample tag",
                generatedUrl: generatedImageUrl,
                originalUrl: originalImageUrl,
                fileName: fileName,
            }
        })
        console.log("image(database)", image);

        // 処理完了の通知
        if(!global.io){
            throw new Error("Custom Server for notification (Socket.io) is not initialized");
        }
        global.io.to(session.user.id).emit("success notification");
        global.io.emit("new post was created", {imageId: image.id});
        // global.io.emit("new post was created", "arg1");

        return NextResponse.json(image, {status: 200});
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

