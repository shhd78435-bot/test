import userRouter from "./modules/userModule/user.controller.js"
import authRouter from "./modules/authModule/auth.controller.js"
import messageRouter from "./modules/messageModule/message.controller.js"
import connectDB from "./DB/connection.js"
import { NotFoundUrlException } from "./utils/exceptions.js"
import { sendEmail } from "./utils/sendEmail/sendEmail.js"
import cors from "cors"
import multer from "multer"
import { uploadFile } from "./utils/multer/multer.js"
import fs from "fs/promises"
import { auth } from "./middleware/auth.middleware.js"
auth
const bootsrap = async (app, express) => {
    app.use(express.json())
    app.use(cors())
    const port = process.env.PORT
    await connectDB()
    
    app.use("/users", userRouter)
    app.use("/auth", authRouter)
    app.use("/messages", messageRouter)
    
    app.use("/uploads",express.static("./uploads"))
    
    app.all("{/*urls}",(req,res,next)=>{
        return next(new NotFoundUrlException())
    })


    app.use((err, req, res, next) => {
        console.log(err.stack);
        
        res.status(err.cause || 500).json({
             errMsg: err.message || "Internal Server Error", 
             status: err.cause || 500 })
    })
    app.listen(port, () => {
        console.log("server started on port", port);

    })

     const cb=(err,name)=>{
        if(err){
            return false
        }else{
            return name
        }

    }
    
    
}
export default bootsrap