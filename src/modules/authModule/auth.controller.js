import { Router } from "express";
import * as authServices from "./auth.services.js"
import { auth } from "../../middleware/auth.middleware.js";
const router=Router()
router.post("/signup",authServices.signup)
router.post("/confirm-email",authServices.confirmEmail)
router.post("/resend-email-otp",authServices.reSendEmailOtp)
router.post("/login",authServices.login)
router.get("/",auth(),authServices.getUserProfile)
router.post("/refresh-token",authServices.refreshToken)
router.post("/forget-password",authServices.forgetPass)
router.post("/change-password",authServices.changePass)


export default router