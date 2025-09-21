import cloudinary from "./cloudConfig.js"
import { uploadFile } from "./multer.js"
export const uploadSingleFile=async({path,dest=""})=>{
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.cloudFolder}/${dest}`
    })
    return {secure_url,public_id}
}
export const destroySingleFile=async({public_id})=>{
    await cloudinary.uploader.destroy(public_id)
}
export const uploadMultiFiles=async({paths=[],dest=""})=>{
    if(paths.length==0){
        throw new Error("no files exists")
    }
    const images=[]
    for(const path of paths){
        const{public_id,secure_url}=await uploadSingleFile({path,dest:`${process.env.cloudFolder}/${dest}`})
        images.push({public_id,secure_url})
    }
   
    return images
}
export const deleteByprefix=async({prefix=""})=>{
    await cloudinary.api.delete_resources_by_prefix(`${process.env.cloudFolder}/${prefix}`)
}