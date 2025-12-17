import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères').max(30, 'Le nom d\'utilisateur ne doit pas dépasser 30 caractères'),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères').max(255, 'Le mot de passe ne doit pas dépasser 255 caractères')
})

export const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis')
})
