import { ApiError } from "../error/apiError"
import { NextFunction, Request, Response } from "express"; 
import User from "../models/user";
import { UserJWTdata } from "../types/UserType";
import jwtDecode from "jwt-decode";
import jsonwebtoken from 'jsonwebtoken'
import VerifyUser from "../models/verifyUser";
import { IRequest } from "../types/MainType";

export default async (req:IRequest, resp:Response, next:NextFunction) =>{
    if(!req.headers.authorization){
        const error: ApiError = ApiError.notAuth("param authorization not found") //401 Not Auth
        return resp.status(error.status).json({error:error.msg});
    }
    
    const dataToken:Array<string> | undefined = req.headers.authorization.split(' ')
    if(!dataToken[1]){
        const error: ApiError = ApiError.badRequest("token incorrect")
        return resp.status(error.status).json({error:error.msg});
    }

    console.log(dataToken[1]);
    try{
        const verifyToken = jsonwebtoken.verify(dataToken[1], 'asdlfkjh4oiuq324hf87sdfvm89q3oqajsdf0')
        
    }catch{
        const error: ApiError = ApiError.badRequest("token incorrect")
        return resp.status(error.status).json({error:error.msg});
    }
    
    const token:string = dataToken[1]
    const {id}:UserJWTdata = jwtDecode(token) 
    if(!id){
        const error: ApiError = ApiError.badRequest("user not found")
        return resp.status(error.status).json({error:error.msg});
    }

    const user:User | null = await User.findOne({where:{id}, include:[VerifyUser]})
    console.log(user);
    
    if(!user){
        const error: ApiError = ApiError.badRequest("user not found")
        return resp.status(error.status).json({error:error.msg});
    }
    
    req['user'] = user;
    return next()

}