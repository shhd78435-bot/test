import z from "zod"
export const signupSchema=z.object({
    email:z.email(),
    name:z.string(),
    password:z.string(),
    confirmPassword:z.string()
})
    .superRefine((args,ctx)=>{
        if(args.confirmPassword!==args.password){
            ctx.addIssue({
                code:"custom",
                path:["password","confirmPassword"],
                message:"passsword must be equal to confirm passsword"
            })
        }
        if(!args.email.startsWith("shahd")){
            ctx.addIssue({
                code:"custom",
                path:['name'],
                message:"must start with 'shahd' "
            })
        }
    })