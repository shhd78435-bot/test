import { Router } from "express";
import { coverImages, deleteUser, getProfile, profileImage, restoreAccount, shareProfile, softDelete, updateBasicInfo } from "./user.services.js";
import { validation } from "../../middleware/validation.middleware.js";
import { getUserByIdSchema, profileImageSchema, updateBasicInfoSchema } from "./user.validation.js";
import { allowTo, auth } from "../../middleware/auth.middleware.js";
import { Roles } from "../../DB/models/user.model.js";
import { uploadFile } from "../../utils/multer/multer.js";
import { uploadToCloud } from "../../utils/multer/multer.cloud.js";

const router=Router()
router.get("/share-profile",auth(),shareProfile)
router.patch("/soft-delete/:id",auth(),allowTo(Roles.admin),softDelete)
router.patch("/restore-account/:id",auth(),deleteUser)
router.patch("/hard-delete/:id",auth(),allowTo(Roles.admin),softDelete)

router.get("/{:id}",validation(getUserByIdSchema),getProfile)
router.patch("/update-basic-info",validation(updateBasicInfoSchema),auth(),updateBasicInfo)
router.patch(
    "/profile-image",
    auth(),
    uploadToCloud().single("profileImage"),
    validation(profileImageSchema),
    profileImage
 )
router.patch(
    "/cover-images",
    auth(),
    uploadToCloud().array("coverImages",5),
    coverImages
)
    

export default router