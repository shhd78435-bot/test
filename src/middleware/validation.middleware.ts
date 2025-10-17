import type { ZodObject } from "zod";
import type {Request,Response,NextFunction } from "express";






const validation=(schema:ZodObject)=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        const data={
            ...req.body,
            ...req.params,
            ...req.query

        }
        const validationRes=await schema.safeParseAsync(data)
        if(!validationRes.success){
            return res.status(422).json({
                validationError:JSON.parse(validationRes.error as unknown as string)
            })
        }
        next()
    }
}
export default validation