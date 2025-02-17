import path from "path";
import fs from "fs";
import OpenAI from "openai";

export const img2img = async (file: File): Promise<string> => {
    
    const openai = new OpenAI({apiKey: process.env.NEXT_OPENAI_API_KEY});

    const image = await openai.images.createVariation({
        image: file,
    })
    console.log("image", image);
    if (!image.data[0].url){
        throw new Error("image url not found");
    }
    return image.data[0].url;

}