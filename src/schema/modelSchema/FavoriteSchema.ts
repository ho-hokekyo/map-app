import { z } from 'zod';

/////////////////////////////////////////
// FAVORITE SCHEMA
/////////////////////////////////////////

export const FavoriteSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  imageId: z.string(),
  createdAt: z.coerce.date(),
})

export type Favorite = z.infer<typeof FavoriteSchema>

export default FavoriteSchema;
