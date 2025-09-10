import { Router } from "express";
import { getUserProfile, updateBasicInfo } from "./user.services.js";
import { validation } from "../../middleware/validation.middleware.js";
import { getUserByIdSchema, updateBasicInfoSchema } from "./user.validation.js";
import { auth } from "../../middleware/auth.middleware.js";
const router=Router()
router.get("/{:id}",validation(getUserByIdSchema),getUserProfile)
router.patch("/update-basic-info",validation(updateBasicInfoSchema),auth(),updateBasicInfo)
    

export default router