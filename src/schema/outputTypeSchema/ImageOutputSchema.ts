import ImageSchema from "@/schema/modelSchema/ImageSchema";
import {z} from 'zod';

const ImageOutputSchema = ImageSchema.omit({    
}).extend({
    // favorite: z.number().int()
})

export type ImageOutput = z.infer<typeof ImageOutputSchema>
export const ImageOutputArraySchema = z.array(ImageOutputSchema)

export default ImageOutputSchema;