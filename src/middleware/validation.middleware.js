import { StatusCodes } from "http-status-codes";
import { loginSchema } from "../modules/authModule/auth.validation.js";



export const validation=(Schema)=>{
    return (req,res,next)=>{
            const data={
               ... req.body,
               ... req.params,
               ... req.query


            }
         
            const result=Schema.validate(data,{abortEarly:false})
            console.log({result});
            if(result.error){
                throw new Error(result.error,{cause:StatusCodes.BAD_REQUEST})
            }
            next()
    }
}