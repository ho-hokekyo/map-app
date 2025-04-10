import { z } from 'zod';

/////////////////////////////////////////
// IMAGE SCHEMA
/////////////////////////////////////////

export const ImageSchema = z.object({
    id: z.string().uuid(),
    userId: z.string(),
    fileName: z.string(),
    originalUrl: z.string(),
    generatedUrl: z.string(),
    expiration: z.coerce.date().nullable(),
    latitude: z.number(),
    longitude: z.number(),
    description: z.string().nullable(),
    prompt: z.string().nullable(),
    tag: z.string(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export type Image = z.infer<typeof ImageSchema>;

export default ImageSchema;
