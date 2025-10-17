export interface IError extends Error{
    statusCode:number
}

export class ApplicationError extends Error{
    constructor(msg:string,public statusCode:number,options:ErrorOptions={}){
        super(msg,options)
    }
}