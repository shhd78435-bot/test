export class NotFoundException extends Error {
    constructor(name="url"){
        super("not found"+name,{cause:404})
    }
}


export class NotValidEmailException extends Error {
    constructor(){
        super("not valid email",{cause:400})
    }
}

export class InvalidCredentialsException extends Error {
    constructor(){
        super("invalid credentials",{cause:401})
    }
}

export class InvalidTokenException extends Error {
    constructor(){
        super("invalid token please send it!",{cause:409})
    }
}

export class NotFoundUrlException extends Error {
    constructor(){
        super("not found url",{cause:404})
    }
}

export class InvalidOTPException extends Error {
    constructor(){
        super("in-valid OTP",{cause:409})
    }
}

export class OTPExpiredException extends Error {
    constructor(){
        super("OTP expired!",{cause:409})
    }
}
export class NotConfirmedEmailException extends Error {
    constructor(){
        super("please confirm your email",{cause:400})
    }
}
export class LoginAgainException extends Error {
    constructor(){
        super("please login again",{cause:401})
    }
}

export class InvalidLoginMethodException extends Error {
    constructor(){
        super("in-valid login method",{cause:400})
    }
}
export class NotFoundUserException extends Error {
    constructor(){
        super("not found user",{cause:400})
    }
}

