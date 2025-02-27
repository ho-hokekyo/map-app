import {NextRequest, NextResponse} from 'next/server';
import { convertImageToPng } from '@/lib/image/preprocess';
import {img2img} from "@/lib/image/img2img";



// export async function POST(request: NextRequest){
//     try{
//         const formData = await request.formData();

//         const imageFile = formData.get("file") as File;

//         if (!imageFile || typeof imageFile === "string") {
//             throw new Error("image file not found");
//         }

        
//         const convertedImageFile = await convertImageToPng(imageFile);
//         const generatedUrl = await img2img2(convertedImageFile);
//         console.log("generatedUrl", generatedUrl);

//         return NextResponse.json({url: generatedUrl}, {status: 200});



//     }catch(error: unknown){
//         if (error instanceof Error){
//             console.error(error.message);
//             return NextResponse.json({error: error.message}, {status: 500});
//         }else{
//             console.error('An unknown error occurred');
//             return NextResponse.json({error: 'An unknown error occurred'}, {status: 500});
//         }
//     }
// }
