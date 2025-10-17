import { Router } from "express";
import authRouter from "./authModule/auth.controller"
const router=Router()

router.use("./auth",authRouter)




export default router