import e, { NextFunction, Request, Response } from "express"; 
import User from "../models/user";
import { ApiError } from "../error/apiError";
import { UserDTO, AuthData, TokenData, UserJWTdata } from "../types/UserType";
import VerifyUser from "../models/verifyUser";
import nodemailer, { SentMessageInfo, Transport, TransportOptions } from 'nodemailer'
import jsonwebtoken from 'jsonwebtoken'
import jwtDecode from "jwt-decode";
import bcrypt from 'bcrypt'
import Mail from "nodemailer/lib/mailer";
import { IRequest } from "../types/MainType";
import Subscriptions from "../models/subscriptions";

export class UserController{

    private static generateToken(userId:number):string {
        const symbols:Array<string> = [
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j','k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't','u', 'v', 'w', 'x', 'y', 'z',
            'A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'J','K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T','U', 'V', 'W', 'X', 'Y', 'Z'
        ]
        let token:string = ''
        const countSymbolsInToken:number = 18
        for(let i:number = 0; i != countSymbolsInToken; i++){ 
            token += symbols[parseInt(String(Math.random() * symbols.length-1))]
        }
        token += 'G' + userId + symbols[parseInt(String(Math.random() * symbols.length-1))] + 'G'
        return token;
    }


    private static async validateUserDTO(data:UserDTO): Promise<ApiError | null> {
        
        if (!data.name) {
            return ApiError.badRequest('param name required')
        }
        if (!data.email) {
            return ApiError.badRequest('param email required')
        }   
        if (!data.password) {
            return ApiError.badRequest('param password required')
        }
        
        if(data.name.length <= 3 || data.name.length >= 15) {
            return ApiError.badRequest('name must be in range 3-15')
        }
        if(data.email.length <= 10 || data.email.length >= 40){
            return ApiError.badRequest('email must be in range 10-35')
        }
        if(data.password.length <= 4 || data.password.length >= 20){
            return ApiError.badRequest('password must be in range 5-20')
        }
        const chekName:User | null = await User.findOne({where: {name:data.name}})
        if(chekName){
            console.log('name is taken');
            return ApiError.badRequest('this name is taken')
        }
        console.log(1);
        
        
        // const nameRegex:RegExp = /^[a-zA-Z]+$/;
        const nameRegex:RegExp = /^[a-zA-Z0-9]{4,20}$/;
        const validateName:boolean = nameRegex.test(data.name)
        if(!validateName){
            return ApiError.badRequest('incorrect name')
        }
        
        const emailRegex:RegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        const validateEmail:boolean = emailRegex.test(data.email)
        if(!validateEmail){
            return ApiError.badRequest('incrrect email')
        }
        
        const passwordRegex:RegExp = /^(?=.*[a-zA-Z])(?!([\w\d])\1+$).{5,}$/
        const validatepassword:boolean = passwordRegex.test(data.password)
        if(!validatepassword){
            return ApiError.badRequest('incorrect password')
        } 
        

        const searchEmail:null | User = await User.findOne({where: {email:data.email}})
        if(searchEmail != null){
            return ApiError.badRequest('email exist')
        }
        return null
    }

    private static async validateDataAuth(data:AuthData | any): Promise<ApiError | null> {
        if(!data.email){
            return ApiError.badRequest('email not found')
        }
        if(!data.password){
            return ApiError.badRequest('password not found')
        }
        if(typeof data.email != 'string'){
            return ApiError.badRequest('incorrect typeof email')
        }
        if(typeof data.password != 'string'){
            return ApiError.badRequest('incorrect typeof password')
        }
        if(data.email.length <= 10 || data.email.length >= 40){
            return ApiError.badRequest('email must be in range 10-35')
        }
        if(data.password.length < 5 || data.password.length > 20){
            return ApiError.badRequest('password must be in range 5-20')
        }
        return null 
    }

    private static async sendValidatedToken(email:string, token:string): Promise<boolean> {
        const transporter: Mail<SentMessageInfo> = nodemailer.createTransport({
            host: 'smtp.meta.ua',
            port: 465,
            auth:{
                user: 'vova.artuhov@meta.ua',
                pass: 'Vovka-131'
            }
        })
        try {
            let info: {response:string} = await transporter.sendMail({
                from: 'vova.artuhov@meta.ua',
                to: email,
                subject: "Подтведрдите почту",
                text: `подтвердите почту перейдя по ссылке http: localhost:3000/verification/${token}`
            })
            if (info.response.includes('OK')) {
                return true
                
            }
            return false
        }
        catch(e) {
            return false
        }
        
    }

    private static tokenData(token:string | undefined):TokenData | ApiError{
        if(!token){
            return ApiError.badRequest('incorrect token')
        }
        let userId:string | Array<string> = token?.split('G')[1] as string
        userId = userId.split('G')
        userId = userId[0].split('')
        userId.pop()
        userId = userId.join('')
        return {token:token, userId:Number(userId)}
    }

    /*
        ПОМНИМ - ЧТО ПИШЕМ НА ТС

        1 - Проверяем корректность полученных данных   | валидация email + сложность пароля  | Проверяем, что нет аккаунтов с таким же email
        2 - Генерируем токен верификации
        3 - Создаем запись в бд пользователя (2 таблици)
        4 - Отсылаем пользователю код подтверджения на почту 
        5 - Создаем JWT TOKEN - Отправляем его клиенту
    
    */
    static async reg(req:Request, resp:Response, next: NextFunction): Promise<any>{  //Promise<void>
        const data:UserDTO = req.body
        const errorValidate: ApiError | null = await UserController.validateUserDTO(data);
        if (errorValidate) {
            return next(errorValidate)
        }

        try{
            // Создать аккаунт
            // 1 - Нет хеширования пароля 
            const hashPassword:string = bcrypt.hashSync(data.password as string, 5)
            const user:User = await User.create({...data, password: hashPassword} as User);
            // Сгенерировать токен подтверждения
            const token:string = UserController.generateToken(user.id);
            const verifyUser:VerifyUser = await VerifyUser.create({user: user, userId:user.id, isVerify:false, verifyToken:token} as VerifyUser)
            // Отправка смс с ссылкой на подтверждение почты
            const messageChek:boolean = await UserController.sendValidatedToken(data.email as string, token)
            // Проверка дошла ли смсочка
            console.log(messageChek);
            if(messageChek == false){
                return resp.status(103).json({message:`account created, failed to send email, link to verifications - http://127.0.0.1:3000/user/verification?token=${token}`})
            }
            // генерация jwt токена ( id, name, verify(true,false) ) и отправка на клиент
            const JWTtoken:string = jsonwebtoken.sign({id: user.id, name: user.name, email:user.email, verify:verifyUser.isVerify}, 'asdlfkjh4oiuq324hf87sdfvm89q3oqajsdf0', {expiresIn:'100h'})
            return resp.status(201).json({token:JWTtoken})
        }catch{
            return next(ApiError.internal("Непредвиденная ошибка"))
        }
    }

    static async verification(req:Request, resp:Response, next: NextFunction): Promise<any>{ 
        const token:string | undefined = req.query.token as string | undefined
        const tokenData:TokenData | ApiError = UserController.tokenData(token)
        if(tokenData instanceof ApiError){
            return next(tokenData)
        }
        console.log({id:tokenData.userId});
        const user:User | null = await User.findOne({where: {id:tokenData.userId}, include: [VerifyUser]})      
        console.log(5);
        if(!user){
            return next(ApiError.badRequest('invalid token'))
        }
        if(user.verifyUser?.verifyToken == token){
            user.verifyUser.update({isVerify: true})
            const JWTtoken:string = jsonwebtoken.sign({id: user?.id, name: user?.name, email:user?.email, verify: user?.verifyUser.isVerify}, 'asdlfkjh4oiuq324hf87sdfvm89q3oqajsdf0', {expiresIn:'100h'})
            return resp.status(200).json({token:JWTtoken})
        }
        return next(ApiError.internal('invalid token'))
    }

    static async auth(req:Request, resp:Response, next: NextFunction): Promise<any>{      
        const data:AuthData = req.body
        const validateData:ApiError | null = await UserController.validateDataAuth(req.body) 
        if(validateData != null){
            return next(validateData)
        }
        const user:User | null = await User.findOne({where:{email:data.email}, include:[VerifyUser]})
        if(!user){
            return next(ApiError.badRequest('user not found'))
        }
        if(await bcrypt.compare(data.password, user.password) == false){
            return next(ApiError.badRequest('password incorrect'))
        }
        const JWTtoken:string = jsonwebtoken.sign({id: user?.id, name: user?.name, email:user?.email, verify: user?.verifyUser.isVerify}, 'asdlfkjh4oiuq324hf87sdfvm89q3oqajsdf0', {expiresIn:'100h'})
        return resp.status(200).json({token:JWTtoken})
        
    }

    static async refreshToken(req:IRequest, resp:Response, next: NextFunction): Promise<any>{
        console.log(1, req.user);
        if(!req.user){
            return next(ApiError.badRequest('user not found'))
        }
        
        try{
            const newToken:string = jsonwebtoken.sign({id: req.user.id, name: req.user.name, email: req.user.email, verifyUser: req.user.verifyUser.isVerify} ,'asdlfkjh4oiuq324hf87sdfvm89q3oqajsdf0')
            console.log({id: req.user.id, name: req.user.name, email: req.user.email, verifyUser: req.user.verifyUser});
            return resp.status(200).json({token:newToken})
        }catch{
            return next(ApiError.badRequest('token incorrect'))
        }
    }

    static async subscribe(req:IRequest, resp:Response, next: NextFunction): Promise<any>{
        if(!req.user){
            return next(ApiError.badRequest('user not found'))
        }
        if(!Number(req.params.id)){
            return next(ApiError.badRequest('id not found'))
        }
        if(Number(req.params.id) == Number(req.user.id)){
            return next(ApiError.badRequest("you can't subscribe to yourself"))
        }
        const userSubscribed:User | null = await User.findOne({where: {id: req.params.id}})
        if(!userSubscribed){
            return next(ApiError.badRequest('user not found'))
        }
        
        const chekSubscribe:Subscriptions | null = await Subscriptions.findOne({where: {userid:req.user.id, subscribedId: userSubscribed.id}})
        if(chekSubscribe !== null){
            chekSubscribe.destroy()
            return resp.status(200).json({message: 'user unsubscribed'})
        }
        try{
            const subscribe:Subscriptions | null = await Subscriptions.create({userid: req.user.id, subscribedId: userSubscribed.id} as Subscriptions)
            console.log(subscribe, 'CREATE');
            return resp.status(200).json({message: subscribe})
            
        }catch(e){
            return next(ApiError.internal('Error'))
        }
    }
    static async getSubscribersTo(req:IRequest, resp:Response, next: NextFunction): Promise<any>{ // на кого подписаны мы
        if(!req.user){
            return next(ApiError.badRequest('user not found'))
        }
        const subscribers:Array<Subscriptions> = await req.user.getSubscriptions()
        return resp.status(200).json({message: subscribers})
    }
    static async getSubscribers(req:IRequest, resp:Response, next: NextFunction): Promise<any>{ // на кого подписан юзер
        if(!req.user){
            return next(ApiError.badRequest('user not found'))
        }
        const subscribersTo:Array<Subscriptions> = await Subscriptions.findAll({where: {subscribedId: req.user.id}})
        
        return resp.status(200).json({message: subscribersTo})
    }
    static async dellAllAcc(req:Request, resp:Response, next: NextFunction): Promise<any> {

        const users:Array<User | undefined> = await User.findAll()
        const verifyUsers:Array<VerifyUser | undefined> = await VerifyUser.findAll()
        let count:number = 0
        users.forEach((user:User | undefined, idx:number)=>{
            user?.destroy()
            verifyUsers[idx]?.destroy()
            count++
        })
        return resp.status(200).json({message:'удалено ' + count + ' аккаунтов'})
    }

}