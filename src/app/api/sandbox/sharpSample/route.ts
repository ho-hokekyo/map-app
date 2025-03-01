import {NextRequest, NextResponse} from 'next/server';
import sharp from "sharp";
import {img2img} from "@/lib/image/img2img";

// const fileToBuffer = async (file: File): Promise<Buffer> => {
//     const stream = file.stream();
//     const reader = stream.getReader();
//     const chunks: Uint8Array[] = [];
//     while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         chunks.push(value);
//     }
//     return Buffer.concat(chunks);
//   };


const convertImageToPng = async (file: File): Promise<File> => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let image = sharp(buffer).toFormat("png");
  
    // メタデータ取得
    const metadata = await image.metadata();
  
    // 幅が 1024px 超えたらリサイズ
    if (metadata.width && metadata.width > 1024) {
      image = image.resize({ width: 1024 });
    }
  
    // PNG 変換 & 圧縮
    let outputBuffer = await image.png({ quality: 80 }).toBuffer();
  
    // 4MB 超える場合、品質を下げて再圧縮
    let quality = 80;
    while (outputBuffer.length > 4 * 1024 * 1024 && quality > 50) {
      quality -= 10;
      outputBuffer = await sharp(outputBuffer).png({ quality }).toBuffer();
    }
  
    // `Buffer` を `File` に変換
    const newFile = new File([outputBuffer], file.name.replace(/\.[^/.]+$/, ".png"), {
      type: "image/png",
    });
  
    return newFile;
  };

export async function POST(request: NextRequest){
    try{
        const formData = await request.formData();

        const imageFile = formData.get("file") as File;

        if (!imageFile || typeof imageFile === "string") {
            throw new Error("image file not found");
        }

        const convertedImage = await convertImageToPng(imageFile);

        const generatedUrl = await img2img(convertedImage);
        console.log("generatedUrl", generatedUrl);

        return NextResponse.json({url: generatedUrl}, {status: 200});



    }catch(error: unknown){
        if (error instanceof Error){
            console.error(error.message);
            return NextResponse.json({error: error.message}, {status: 500});
        }else{
            console.error('An unknown error occurred');
            return NextResponse.json({error: 'An unknown error occurred'}, {status: 500});
        }
    }
}