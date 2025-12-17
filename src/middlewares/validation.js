import { ZodError, ZodType } from "zod"

export const validateBody = (schema) => {
  return (req, res, next) => {
    if (schema instanceof ZodType) {
      try {
        schema.parse(req.body)
        next()
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).send({
            error: 'Validation failed',
            details: error.issues
          })
        }
        res.status(500).send({
          error: 'Internal server error',
          message: error.message || 'An unknown error occurred'
        })
      }
    }
  }
}