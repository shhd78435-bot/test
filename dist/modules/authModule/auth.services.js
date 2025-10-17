import z from "zod";
import { signupSchema } from "./auth.validation";
import { ApplicationError } from "../../utils/errors/types";
import { UserModel } from "../../DB/models/user.model";
export class AuthServices {
    userModel = UserModel;
    async signUp(req, res, next) {
        const { name, email, password } = req.body;
        const isEmailExist = await this.userModel.findOne({ email });
        if (isEmailExist) {
            throw new ApplicationError("email already exist", 400);
        }
        const user = await this.userModel.create({
            email,
            password,
            name
        });
        return res.json({
            name,
            email,
            password
        });
    }
}
