import { providers, userModel } from "../../DB/models/user.model.js"
import { InvalidCredentialsException, InvalidLoginMethodException, InvalidOTPException, NotConfirmedEmailException, NotFoundException, NotFoundUserException, NotValidEmailException, OTPExpiredException } from "../../utils/exceptions.js"
import { successHandler } from "../../utils/successHandler.js"
import { create, find, findById, findByIdAndDelete, findByIdAndUpdate, findOne, findOneAndDelete, findOneAndUpdate } from "../../DB/DBServices.js"
import jwt from "jsonwebtoken"
import { decodeToken, tokenTypes } from "../../middleware/auth.middleware.js"
import CryptoJS from "crypto-js"
import { decryption, encryption } from "../../utils/crypto.js"
import { compareSync, hash, hashSync } from "bcryptjs"
import { compare } from "../../utils/bycrypt.js"
import { customAlphabet, nanoid } from "nanoid"
import { createOtp, sendEmail } from "../../utils/sendEmail/sendEmail.js"
import { template } from "../../utils/sendEmail/generateHtml.js"
import {
	ReasonPhrases,
	StatusCodes,
	getReasonPhrase,
	getStatusCode,
} from 'http-status-codes';

import {OAuth2Client} from "google-auth-library"
const client=new OAuth2Client()
export const signup= async(req,res,next)=>{
    const {firstName,lastName,email,password,age,gender,role,phone}=req.body
    
    const isExist= await userModel.findOne({email})
    if(isExist){
         throw new NotValidEmailException()
    }
    const otp=createOtp()
    const subject="email confirmation"
    const html=template(otp,firstName,subject)
    const user =await userModel.create({
        firstName,
        lastName,
        email,
        password,
        age,
        gender,
        role,
        phone,
        emailOtp:{
            otp,
            expiredAt:Date.now()+1000 * 30
        }
     })
     await sendEmail({to:user.email,html,subject})
     
     return successHandler({res, data: user, status: 201})
}
export const confirmEmail=async(req,res,next)=>{
    const {otp,email}=req.body
    const user=await userModel.findOne({email})
    if(!user){
        throw new NotFoundException("email")
    }
    if(!user.emailOtp.otp){
        throw new OTPExpiredException()
    }
    if(user.emailOtp.expiredAt<= Date.now()){
        throw new InvalidOTPException()
    }
    if(!compare(otp,user.emailOtp.otp)){
        throw new InvalidOTPException()
    }
    await user.updateOne({
        confirmed:true,
        $unset:{
            otp:""
        }
    })
    return successHandler({res})
}
export const reSendEmailOtp=async(req,res,next)=>{
    const {email}=req.body
    const user=await userModel.findOne({email})
    if(!user){
        throw new NotFoundException("email")
    }
    if(user.emailOtp.expiredAt> Date.now()){
        throw new Error("use last sended otp",{cause:400})

    }
    if(user.confirmed){
        throw new Error("already confirmed",{cause:400})
    }
    const custom= customAlphabet("0123456789")
    const otp = custom(6)
    const subject="email confirmation(resend otp)"
    const html=template(otp,user.firstName,subject)
    await sendEmail({to:user.email,html,subject})
    await user.updateOne({
       emailOtp:{
        otp,
        expiredAt:Date.now()+1000*30

       }
        
    })
    return successHandler({res})

    
}

export const login=async(req,res,next)=>{
    const{email,password}=req.body
   
    const user=await userModel.findOne({email})
    console.log({postPass:password,DBPass:user.password});
    if(!user || !user.checkPassword(password)){
        throw new InvalidCredentialsException()
    }
    if(!user?.confirmed){
        throw new NotConfirmedEmailException()
    }
    if(user.provider==providers.google){
        throw new InvalidLoginMethodException()
    }
    const accessToken=jwt.sign({
        _id:user._id
    },process.env.ACCESS_SIGNATURE,{
        expiresIn:"11M"
    })
    const refreshToken=jwt.sign({
        _id:user._id
    },process.env.REFRESH_SIGNATURE,{
        expiresIn:"7D"
    })
    
    return successHandler({res, data: {
        accessToken,
        refreshToken
    }, status: 200})
}

export const refreshToken=async(req,res,next)=>{
    const {refreshToken}=req.body
    const user =await decodeToken({authorization:refreshToken,type:tokenTypes.refresh,next})

    const accessToken=jwt.sign({
        _id:user._id
    },process.env.ACCESS_SIGNATURE,{
        expiresIn:"11M"
    })

    return successHandler({
        res, data:
            accessToken
    })

}

export const getUserProfile = async(req,res,next)=>{
    const user=req.user
    successHandler({res, data: user})
}

export const forgetPass = async(req,res,next)=>{
    const {email}=req.body
    const user=await userModel.findOne({email})
    if(!user){
        throw new NotFoundException("email")
    }
    if(!user.confirmed){
        throw new Error("user not confirmed",{cause:400})
    }
    const custom= customAlphabet("0123456789")
    const otp = custom(6)
    const subject="forget password"
    const html=template(otp,user.firstName,subject)
    await sendEmail({to:user.email,html,subject})
    await user.updateOne({
       passwordOtp:{
        otp,
        expiredAt:Date.now()+1000*30

       }
    })
    return successHandler({res})
}
export const changePass=async(req,res,next)=>{
    const {email,otp,password}=req.body
    const user=await userModel.findOne({email})
    if(!user){
        throw new NotFoundException("email")
    }
    if(!user.passwordOtp.otp){
        throw new Error("no otp exists",{cause:409})
    }
    if(user.passwordOtp.expiredAt<= Date.now()){
        throw new InvalidOTPException()
    }
    if(!compare(otp,user.passwordOtp.otp)){
        throw new InvalidOTPException()
    }
    const hashedpass=hash(password)
    await user.updateOne({
        password:hashedpass,
        $unset:{
            passwordOtp:""
        },
        changedCredentialsAt:Date.now()
    })
    return successHandler({res})
}

export const socialLogin=async(req,res,next)=>{
    const idToken=req.body.idToken
    const ticket=await client.verifyIdToken({
        idToken,
        audience:process.env.GOOGLE_CLIENT_ID
    })
    const {email,email_verified,given_name:firstName,family_name:lastName}=ticket.getPayload()
    let user=await userModel.findByEmail(email)
    if(user?.provider==providers.system){
        throw new InvalidLoginMethodException()
    }
    if(!user){
        if(!user.confirmed){
            throw new NotConfirmedEmailException()

        }
        user=await userModel.create({
            email,
            firstName,
            lastName,
            confirmed:email_verified,
            provider:providers.google

        })
    }
    if(!user.confirmed){
        throw new NotConfirmedEmailException()
    }

    const accessToken=jwt.sign({
        _id:user._id
    },process.env.ACCESS_SIGNATURE,{expiresIn:"1H"})
    const refreshToken=jwt.sign({
        _id:user._id
    },process.env.REFRESH_SIGNATURE,{
        expiresIn:"7D"
    })
    return successHandler({
        res,data:{
            accessToken,
            refreshToken
        }
    })
}
export const sendVertificationCode=async(req,res,next)=>{
    const {userId}=req.body
    const user=await userModel.findById(req.body.userId)
    if(!user){
        throw new NotFoundUserException()
    }
    if(user.banned&& user.banned>new Date()){
        throw new Error("You are banned")
    }
    const code =crypto.randomInt(10000,9999).toString()
    user.vertificationCode=code
    user.codeExpire=new Date(Date.now()+2*60*1000)
    user.failedAttempts=0
    user.banned=null
    await user.save()
}
export const VerifyCode=async(req,res,next)=>{
    const {userId,code}=req.body
    const user=await userModel.findById(userId)
    if(!user){
        throw new NotFoundUserException()
    }
    if(user.banned&& user.banned>new Date()){
        throw new Error("You are banned")
    }
    if(!user.vertificationCode||user.codeExpire<new Date()){
        throw new Error ("verification code is expired")
    }
    if(user.vertificationCode==inputCode){
    user.vertificationCode=null
    user.codeExpire=null
    user.failedAttempts=0
    await user.save()
    return ("email verifird")
    }else{
        user.failedAttempts+=1
        if(user.failedAttempts>=5){
            user.banned=new Date(Date.now()+5*60*1000)
            await user.save()
            throw new Error("you are banned for 5 minutes")
        }
            await user.save()
            throw new error(`attempts left :${5-user.failedAttempts}`)

        
    }
}
export const updateEmail = async(req,res,next)=>{
    const user=req.user
    const {email}=req.body
    if(user.email == email){
        throw new Error("update your email with new email",{cause:StatusCodes.BAD_REQUEST})
    }
    const isExist= await findByEmail(email)
    if(isExist){
        throw new NotValidEmailException()
    }

    const oldEmailOtp= createOtp()
    const oldEmailHTML=template(oldEmailOtp,user.firstName,"confirm update email")
    sendEmail({to:user.email,subject:"confirm update email",html:oldEmailHTML})
    user.oldEmailOtp={
        otp:hash(oldEmailOtp),
        expiredAt:Date.now()+5*60*60*1024
    }
    const newEmailOtp= createOtp()
    const newEmailHTML=template(newEmailOtp,user.name,"confirm new email")
    sendEmail({to: email,subject:"confirm new email",html:newEmailHTML})
    user.newEmailOtp={
        otp:hash(newEmailOtp),
        expiredAt:Date.now()+5*60*60*1024
    }
    user.newEmail=email
    await user.save()

    return successHandler({res})
}
export const confirmNewEmail=async(req,res,next)=>{
    const user=req.user
    const{oldEmailOtp,newEmailOtp}=req.body
     if(user.oldEmailOtp.expiredAt<= Date.now()|| user.newEmailOtp.expiredAt<=Date.now()){
        throw new InvalidOTPException()
    }
    if(!compare(oldEmailOtp,user.oldEmailOtp.otp) || !compare(newEmailOtp,user.newEmailOtp.otp) ){
        throw new InvalidOTPException()
    }
    user.email=user.newEmail
    user.newEmail=undefined
    user.oldEmailOtp=undefined
    user.newEmailOtp=undefined
    await user.save()
    return successHandler({res,data:user.newEmail})
    
}