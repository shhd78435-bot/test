import Joi from "joi";
import { Gender, Roles } from "../DB/models/user.model.js";
import mongoose from "mongoose";
import { fileTypes } from "./multer/multer.js";

const checkId=(value,helpers)=>{
    if(mongoose.isValidObjectId(value)){
        return true
    }else{
        return helpers.message("in-valid object id")
    }
}

export const generalValidation={
    firstName:Joi.string().min(3).max(15).required(),
        lastName:Joi.string().min(3).max(15).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(8).max(20).required(),
        confirmpassword:Joi.valid(Joi.ref("password")).required(),
        age:Joi.number().min(18).max(50),
        gender:Joi.string().valid(Gender.male,Gender.female),
        role:Joi.string().valid(Roles.admin,Roles.user),
        phone:Joi.string().regex(/^(\+20|0020|0?)(1)([0125])\d{8}$/),
        otp:Joi.string().length(6),
        id:Joi.string().custom(checkId),
        fieldname:Joi.string().valid("profileImage"),
        originalname:Joi.string(),
        encoding:Joi.string(),
        mimetype:Joi.string().valid(...fileTypes.image),
        destination:Joi.string(),
        filename:Joi.string(),
        path:Joi.string(),
        size:Joi.number().max(10*1024*1024)
    
}
