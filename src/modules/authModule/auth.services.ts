import type { promises } from "dns";
import type { Request,Response,NextFunction } from "express";
import type { SignDto } from "./auth.DTO";
import z from "zod"
import { signupSchema } from "./auth.validation";
import { ApplicationError, type IError } from "../../utils/errors/types";
import type { Model } from "mongoose";
import type { IUser } from "../userModule/user.types";
import { UserModel } from "../../DB/models/user.model";




export class AuthServices{
    private readonly userModel:Model<IUser>=UserModel
    async signUp(req:Request,res:Response,next:NextFunction): Promise<Response> {
        const {
            name,
            email,
            password
        }:SignDto=req.body
        const isEmailExist=await this.userModel.findOne({email})
        if(isEmailExist){
            throw new ApplicationError("email already exist",400)
        }
        const user=await this.userModel.create({
            email,
            password,
            name
        })

      
        return res.json({
            name,
            email,
            password
        })

    }
}