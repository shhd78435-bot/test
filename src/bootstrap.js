import userRouter from "./modules/userModule/user.controller.js"
import authRouter from "./modules/authModule/auth.controller.js"
import messageRouter from "./modules/messageModule/message.controller.js"
import connectDB from "./DB/connection.js"
import { NotFoundUrlException } from "./utils/exceptions.js"
import { sendEmail } from "./utils/sendEmail/sendEmail.js"
import cors from "cors"

const bootsrap = async (app, express) => {
    app.use(express.json())
    app.use(cors())
    const port = process.env.PORT
    await connectDB()
    app.use("/users", userRouter)
    app.use("/auth", authRouter)
    app.use("/messages", messageRouter)
    
    
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
    const phoneExp=/^(\+20|0020|0?)(1)([0125])\d{8}$/
    console.log(phoneExp.test("01229789880"));
    
    
    
}
export default bootsrap