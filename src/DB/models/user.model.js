import { Schema,get,model } from "mongoose";
import { decryption, encryption } from "../../utils/crypto.js";
import bcrypt from "bcryptjs";
import { hashSync } from "bcryptjs";
import { compare } from "../../utils/bycrypt.js";

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


const userSchema= new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        //unique:true
    },
    password:{
        type:String,
        required:true,
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
        required:true,
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
    emailOtp:{
        otp:String,
        expiredAt:Date

    },
    passwordOtp:{
        otp:String,
        expiredAt:Date

    }

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