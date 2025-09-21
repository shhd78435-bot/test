import { Roles, userModel } from "../../DB/models/user.model.js"
import { NotFoundException } from "../../utils/exceptions.js"
import { deleteByprefix, destroySingleFile, uploadSingleFile } from "../../utils/multer/cloud.services.js"
import cloudinary from "../../utils/multer/cloudConfig.js"
import { successHandler } from "../../utils/successHandler.js"
import fs from "fs/promises"
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
export const shareProfile =async(req,res,next)=>{
    const user=req.user
    const link=`${req.protocol}://${req.host}/users/${user._id}`
    return successHandler({res, data: link})
}

export const getProfile =async(req,res,next)=>{
    const id = req.params.id
    const user=await userModel.findById({
        _id:id,
        isDeleted:false
    }).select("firstName lastName email phone profileImage")
    if(!user){
        throw new NotFoundException("user")
    }
    user.profileImage=`${req.protocol}://${req.host}://${req.host}/${user.profileImage}`
    return successHandler({res,data: user})
}

export const softDelete=async(req,res,next)=>{
    const {id}=req.params
    const user=await userModel.findOne({
        isDeleted:false,
        _id:id
    })
    if(!user){
        throw new NotFoundException("user")
    }
    if(user.role==Roles.admin){
        throw new Error("admin can not be deleted")
    }
    user.isDeleted=true
    user.deletedBy=req.user._id
    await user.save()
    return successHandler({res})

}
export const restoreAccount = async(req,res,next)=>{
    const id =req.params.id
    const user=await userModel.findById(id)
     if(!user){
        throw new NotFoundException("user")
    }
    if(!user.isDeleted){
        throw new Error("user not deleted",{cause:400})

    }
    if(user.deletedBy.toString()!=req.user._id.toString()){
        throw new Error("you cannot restore this account",{cause:401})
    }
    user.deletedBy=undefined
    user.isDeleted=false
    await user.save()
    return successHandler({res})
}
export const deleteUser=async(req,res,next)=>{
    const user=req.user
    if(user.profileImage|| user.coverImages){
       await deleteByprefix({prefix:`users/${user._id}`})
       await deleteFolder({folder:`users/${user._id}`})
    }
    await user.deleteOne()
    return successHandler({res})
}

export const profileImage=async(req,res,next)=>{
    const user=req.user

    console.log(user.profileImage);
    
    if(user.profileImage.public_id){
        await destroySingleFile({public_id:user.profileImage.public_id})
    }
    const {secure_url,public_id}=await uploadSingleFile({path:req.file.path,dest: `users/${user._id}/profile_images`})
    user.profileImage={
        secure_url,
        public_id
    }
    await user.save()
    return successHandler({res})
}
export const coverImages=async(req,res)=>{
    const user=req.user
    const files=req.files
    const paths=[]
    req.files.map(file=>{
        paths.push(file.path)
    })
    const coverImage=await uploadMultiFiles({paths,dest:`users/${user._id}/coverImages`})
    user.coverImages.push(coverImages)
    await user.save()
    successHandler({res,data:user})
}