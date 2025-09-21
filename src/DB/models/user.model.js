import { Schema,Types,get,model } from "mongoose";
import { decryption, encryption } from "../../utils/crypto.js";
import bcrypt from "bcryptjs";
import { hashSync } from "bcryptjs";
import { compare } from "../../utils/bycrypt.js";
import { profileImage } from "../../modules/userModule/user.services.js";
//import Joi from "joi";
//import { object } from "joi";


export const Gender={
    male:"male",
    female:"female"
}
Object.freeze(Gender)

export const Roles={
    admin:"admin",
    user:"user"
}
Object.freeze(Roles)

export const providers={
    google:"google",
    system:"system"
}
Object.freeze(providers)

const otpSchema=new Schema({
    otp:String,
    expiredAt:Date

},{
    _id:false

})


const userSchema= new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        //unique:true
    },
    password:{
        type:String,
        required:function(){
            if(this.provider==providers.google){
                return false
            }else if(this.provider==providers.system){
                return true
            }
        },
        set(value){
            return hashSync(value,Number(process.env.BCRYPT_SALT_ROUNDS))

        }

    },
    age:{
        type:Number,
        min:20,
        max:50
    },
    gender:{
        type:String,
        enum:Object.values(Gender),
        default:Gender.male
    },
    role:{
        type:String,
        enum:Object.values(Roles),
        default:Roles.user
    },
    phone:{
        type:String,
        required:function(){
            if(this.provider==providers.google){
                return false
            }else if(this.provider==providers.system){
                return true
            }
        },
        set(value){
            return encryption(value)
        },
        get(value){
            return decryption(value)
        }

    },
    confirmed:{
        type:Boolean,
        default:false
    },
    vertificationCode:{
        type:String,
    },
    codeExpire:{
        type:Date
    },
    failedAttempts:{
        type:Number,
        default:0
    },
    banned:{
        type:Date
    },
    emailOtp:otpSchema,
    newEmailOtp:otpSchema,
    oldEmailOtp:otpSchema,
    passwordOtp:otpSchema,
    newEmail:String,
    changedCredentialsAt:Date,
    provider:{
        type:String,
        enum:Object.values(providers),
        default:providers.system
    },
    socialId:String,
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedBy:{
        type:Types.ObjectId,
        ref:"user"
    },
    profileImage:{
        secure_url:String,
        public_id:String
    },
    coverImages:[{
        secure_url:String,
        public_id:String
    }]


},{
    timestamps:true,
    toJSON:{
        getters:true
    },
    toObject:{
        getters:true
    },
    virtuals:{
        fullName:{
            get(){
                return this.firstName + " " + this.lastName
            }
        }
    },
    methods:{
        checkPassword(password){
            return compare(password,this.password)
        }
    }
})
export const userModel=model("user",userSchema)