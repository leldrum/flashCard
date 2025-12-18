import z from "zod"

export const createCardSchema = z.object({
    frontText: z.string().min(1).max(300),
    backText: z.string().min(1).max(300),
    frontUrl: z.string().min(1).optional(),
    backUrl: z.string().min(1).optional(),
    titleCollection: z.string().min(1).max(300),
})