import ImageOutputSchema, { ImageOutput, ImageOutputArraySchema } from '@/schema/outputTypeSchema/ImageOutputSchema';

// 長方形の領域内の画像を取得する
export const fetchSquareImages = async (minLatitude: number, maxLatitude: number, minLongitude: number, maxLongitude: number, zoom: number): Promise<ImageOutput[]> => {
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/map/getSquareMapImage`,{
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            minLatitude: minLatitude,
            maxLatitude: maxLatitude,
            minLongitude: minLongitude,
            maxLongitude: maxLongitude,
            zoom: zoom
            }),
        })

        const data = await res.json();

        // Validation
        const parsedValue = ImageOutputArraySchema.parse(data);

        return data;
    }catch(error){
        console.log("Failed to fetch images", error);
        return [];
    }
}


export const fetchSelectedImage = async (id: string): Promise<ImageOutput> => {
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/image/getImageById`,{
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageId: id,
            }),
        })

        const data = await res.json();

        // Validation
        const parsedValue = ImageOutputSchema.parse(data);

        return parsedValue;
    }catch(error){
        console.log("Failed to fetch images", error);
        return {} as ImageOutput;
    }
}