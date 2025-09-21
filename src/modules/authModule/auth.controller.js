import { Router } from "express";
import * as authServices from "./auth.services.js"
import { auth } from "../../middleware/auth.middleware.js";
import { loginSchema, signupSchema } from "./auth.validation.js";
import { validation } from "../../middleware/validation.middleware.js";

const router=Router()
router.post("/signup",validation(signupSchema),authServices.signup)
router.post("/confirm-email",authServices.confirmEmail)
router.post("/resend-email-otp",authServices.reSendEmailOtp)
router.post("/login",validation(loginSchema),authServices.login)
router.get("/",auth(),authServices.getUserProfile)
router.post("/refresh-token",authServices.refreshToken)
router.post("/forget-password",authServices.forgetPass)
router.post("/change-password",authServices.changePass)
router.post("/social-login",authServices.socialLogin)
router.post("/send-code",authServices.sendVertificationCode)
router.post("/verify-code",authServices.VerifyCode)
router.patch("/update-email",auth(),authServices.updateEmail)
router.patch("/confirm-new-email",auth(),authServices.confirmNewEmail)

export default router