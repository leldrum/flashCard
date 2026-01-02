import z from "zod"

export const createCardSchema = z.object({
    frontText: z.string().min(1).max(300),
    backText: z.string().min(1).max(300),
    frontUrl: z.string().min(1).optional(),
    backUrl: z.string().min(1).optional(),
    idCollection: z.string().min(1).max(300),
})

export const updateCardSchema = z.object({
    frontText: z.string().min(1).max(300).optional(),
    backText: z.string().min(1).max(300).optional(),
    frontUrl: z.string().min(1).optional(),
    backUrl: z.string().min(1).optional(),
})

export const idCardSchema = z.object({
    id: z.uuid(),
})