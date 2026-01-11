import { ZodError, ZodType } from "zod"

export const validateBody = (schema) => {
    return (req, res, next) => {
        if(schema instanceof ZodType){
            try{
                schema.parse(req.body)
                next()
            }
            catch(error){
                if(error instanceof ZodError){
                    const formattedErrors = error.issues.map(issue => {
                        const fieldName = issue.path.join('.')
                        let message = issue.message
                        if(message.includes('Invalid input') && message.includes('received undefined')) {
                            message = `${fieldName} is required`
                        }
                        return {
                            field: fieldName,
                            message: message
                        }
                    })
                    return res.status(400).send({
                        error: 'Validation failed',
                        details: formattedErrors
                    })
                }
                res.status(500).send({
                    error: 'internal server error',
                    message: error.message || 'An unknown error occurred'
                })
            }
        }
    }
}

export const validateParams = (schema) => {
    return (req, res, next) => {
        if(schema instanceof ZodType){
            try{
                schema.parse(req.params)
                next()
            }
            catch(error){
                if(error instanceof ZodError){
                    return res.status(400).send({
                        error: 'Invalide params',
                        details: error.issues
                    })
                }
                res.status(500).send({
                    error: 'internal server error'
                })
            }
        }
    }
}

export const validateCollectionTitle = (schema) => {
    return (req, res, next) => {
        if(schema instanceof ZodType){
            try{
                const title = req.params?.title
                if (!title) {
                    return res.status(400).send({ error: 'title param is required' })
                }

                schema.parse({title: title.toLowerCase().trim()})
                next()
            }
            catch(error){
                if(error instanceof ZodError){
                    return res.status(400).send({
                        error: 'Invalid query',
                        details: error.issues
                    })
                }   
                res.status(500).send({
                    error: 'internal server error'
                })
            }
        }
    }
}