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

export const img2img2 = async (file: File): Promise<File> => {
    const apiKey = process.env.NEXT_STABILITY_API_KEY;
    
    if (!apiKey) {
        throw new Error("API key is missing");
    }

    // FormData を作成
    const formData = new FormData();
    formData.append("image", file);
    formData.append("prompt", "A vibrant fantasy cityscape, glowing magical lights on the streets, colorful crystal-like buildings, floating lanterns in the sky, a mystical atmosphere, lush greenery intertwined with urban architecture, a warm and dreamy sunset sky with pink, purple, and gold hues. The scene feels enchanting, with a touch of magic and wonder");
    formData.append("output_format", "webp");

    try {
        // Stability AI の API にリクエスト
        const response = await fetch(
            "https://api.stability.ai/v2beta/stable-image/control/style",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    Accept: "image/*",
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`${response.status}: ${errorText}`);
        }

        const blob = await response.blob();
        const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
            type: "image/webp", 
        });

       
        return newFile
    } catch (error) {
        console.error("Error in img2img2:", error);
        throw new Error("Failed to process image");
    }
};