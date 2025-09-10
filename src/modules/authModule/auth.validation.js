import Joi from "joi";
import { Gender, Roles } from "../../DB/models/user.model.js";
import { generalValidation } from "../../utils/generalValidation.js";

export const signupSchema=Joi.object({
    firstName:generalValidation.firstName,
    lastName:generalValidation.lastName,
    email:generalValidation.email,
    password:generalValidation.password,
    confirmpassword:generalValidation.confirmpassword,
    age:generalValidation.age,
    gender:generalValidation.gender,
    role:generalValidation.role,
    phone:generalValidation.phone
})
export const loginSchema=Joi.object({
            email:generalValidation.email.required(),
            password:generalValidation.password.required()
 }).required()

 export const confirmEmailSchema=Joi.object({
    email:generalValidation.email.required(),
    otp:generalValidation.otp.required()
 })

 export const resendEmailOtpSchema=Joi.object({
    email:generalValidation.email.required()
 })

