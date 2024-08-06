import { ApiError } from "../error/apiError";
import { NextFunction, Request, Response } from "express"; 

export default (error:undefined | ApiError, req:Request, resp:Response, next:NextFunction) => {
    if (error instanceof ApiError) {
        console.log(error.msg);
        
        return resp.status(error.status).json({message: error.msg})
    }
    const err:ApiError = ApiError.internal("Непридвиденная ошибка")
    return resp.status(err.status).json({message: err.msg})
}