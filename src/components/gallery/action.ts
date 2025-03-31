import { ImageOutput } from "@/schema/outputTypeSchema/ImageOutputSchema";
import { ImageOutputArraySchema } from "@/schema/outputTypeSchema/ImageOutputSchema";

export const fetchImages = async (): Promise<ImageOutput[]> => {

    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/image/getImages`,{
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            num: 30,
            }),
        })

        const data = await res.json();

        // Validation
        const parsedValue = ImageOutputArraySchema.parse(data);

        return parsedValue;
    }catch(error){
        console.log("Failed to fetch images", error);
        return [];
    }
}

// export const fetchPopularImages = async (): Promise<ImageOutput[]> => {

//     try{
//         const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/image/getPopularImages`,{
//             method: 'POST',
//             headers: {
//             'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//             num: 30,
//             }),
//         })

//         // Validation
//         const data = await res.json();
//         const parsedValue = ImageOutputArraySchema.parse(data);
//         console.log("parse", parsedValue);

//         return data;
//     }catch(error){
//         console.log("Failed to fetch images", error);
//         return [];
//     }
// }