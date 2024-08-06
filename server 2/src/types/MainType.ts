import { Request } from "express"; 
import User from "../models/user";


export interface IRequest extends Request{
    user?: User
}