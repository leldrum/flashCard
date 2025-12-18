import {z} from 'zod'

export const createCollectionSchema = z.object({
    title: z.string().min(1).max(300),
    description: z.string().min(1).max(300).optional(),
    isPrivate: z.boolean(),
})