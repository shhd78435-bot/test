import { Router } from "express";
import { AuthServices } from "./auth.services";
import validation from "../../middleware/validation.middleware";
import { signupSchema } from "./auth.validation";
const router = Router();
const authServices = new AuthServices;
router.post("/signup", validation(signupSchema), authServices.signUp);
export default router;
