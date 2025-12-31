import {z} from 'zod'

export const createCollectionSchema = z.object({
    title: z.string().min(1).max(300),
    description: z.string().min(1).max(300).optional(),
    isPrivate: z.boolean(),
})

export const updateCollectionSchema = z.object({
    title: z.string().min(1).max(300).optional(),
    description: z.string().min(1).max(300).optional(),
    isPrivate: z.boolean().optional(),
})

export const idCollectionSchema = z.object({
    id: z.uuid(),
})

export const titleCollectionSchema = z.object({
    title: z.string().min(1).max(300),
})