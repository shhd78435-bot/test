import { hashSync } from "bcryptjs"
import { compareSync } from "bcryptjs"
export const hash=(password)=>{
    return hashSync(password,Number(process.env.BCRYPT_SALT_ROUNDS))
}

export const compare= (text,hasedText)=>{
    return compareSync(text,hasedText)
}