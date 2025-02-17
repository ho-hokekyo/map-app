import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { Storage } from "@google-cloud/storage";
import  {img2img}  from "@/lib/image/img2img";
export const prerender = false;


export async function POST(request: NextRequest) {

    try{
        const formData = await request.formData();
        // const body = await request.json();
        // console.log("formData", formData);

        const imageFile = formData.get("file") as File;
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
        // const generatedUrl = await img2img(imageFile);
        
        // generate image and upload to GCS
        const generatedUrl = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-jmuLTnCHURAEXVY1VByta3oE/user-l4chAGXPSMWW0R0qnGlk3lmI/img-WxhZh8e2DVaL1luBiDJtJJpm.png?st=2025-02-17T13%3A43%3A09Z&se=2025-02-17T15%3A43%3A09Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-02-17T13%3A46%3A05Z&ske=2025-02-18T13%3A46%3A05Z&sks=b&skv=2024-08-04&sig=ktffuniza2uSJhAYlZWNkhzbyLAjZLvqP/Qzzkwdexg%3D";
        const generatedImageResponse = await fetch(generatedUrl, {method: "GET"});
        const generatedImageBlob = await generatedImageResponse.blob();
        const generatedImage = new File([generatedImageBlob], "generatedImage.png", {type: "image/png"});
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

        const latitude = 10
        const longitude = 10


        const image = await prisma.image.create({
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


