import Joi from "joi";
import mongoose from "mongoose";
import { generalValidation } from "../../utils/generalValidation.js";

export const getUserByIdSchema=Joi.object({
    id:generalValidation.id.required()
   
})
export const updateBasicInfoSchema=Joi.object({
    firstName:generalValidation.firstName,
    lastName:generalValidation.lastName,
    age:generalValidation.age,
    phone:generalValidation.phone
})