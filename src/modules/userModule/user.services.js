import { userModel } from "../../DB/models/user.model.js"
import { successHandler } from "../../utils/successHandler.js"

export const getUserProfile=async(req,res,next)=>{
    const id=req.params.id
    const user=await userModel.findById(id)
    successHandler({res,data:user})
}
export const updateBasicInfo=async(req,res,next)=>{
    const {firstName,lastName,age,phone}=req.body
    const user=req.user
    user.firstName=firstName
    user.lastName=lastName
    user.age=age
    user.phone=phone
    await user.save()
    return successHandler({res})
}