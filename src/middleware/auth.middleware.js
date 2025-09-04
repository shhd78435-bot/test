import jwt from "jsonwebtoken"
import { userModel } from "../DB/models/user.model.js"
import { InvalidTokenException, NotFoundException } from "../utils/exceptions.js"
import { model } from "mongoose"
import CryptoJS from "crypto-js"

export const tokenTypes={
    access:"access",
    refresh:"refresh"
}
Object.freeze(tokenTypes)
export const decodeToken=async({authorization="",type=tokenTypes.access,next})=>{
    if(!authorization){
       return next(new InvalidTokenException())
    }
    if(authorization.startsWith(process.env.BEARER)){
        return next (new InvalidTokenException())

    }
    const token=authorization.split(" ")[1]
    
    let signature=process.env.ACCESS_SIGNATURE
    if(type == tokenTypes.refresh){
        signature=process.env.REFRESH_SIGNATURE

    }

    const data=jwt.verify(token,signature)
    const user=await userModel.findById(data._id)
    
    if(!user){
        return next(new NotFoundException("user"))
    }
    return user

}

export const auth=()=>{
    return async(req,res,next)=>{
        const authorization=req.headers.auth
        const user= await decodeToken({authorization,next})
        req.user=user
        next()
    }
}
