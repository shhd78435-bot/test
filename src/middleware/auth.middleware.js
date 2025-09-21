import jwt from "jsonwebtoken"
import { userModel } from "../DB/models/user.model.js"
import { InvalidTokenException, LoginAgainException, NotConfirmedEmailException, NotFoundException, UnAuthorizedException } from "../utils/exceptions.js"
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
    const user=await userModel.findOne({
        model:userModel,
        filter:{
            _id:data._id,
            isDeleted:false
        }
    })

    if(!user){
        return next(new NotFoundException("user"))
    }
    if(!user.confirmed){
        return next (new NotConfirmedEmailException())
    }
    if(user.changedCredentialsAt?.getTime()>data.iat*1000){
        throw new LoginAgainException()
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
export const allowTo=(...roles)=>{
    return async(req,res,next)=>{
        const user=req.user
        if(roles.includes(user.role)){
            throw new UnAuthorizedException()
        }

        next()
    }


}
