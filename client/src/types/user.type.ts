export interface IUserType{
    id:number,
    name:string,
    email:string,
    verify:boolean,
    state: {isLoading:boolean, error:string}
}

export interface IDecodeToken{
    id:number,
    name:string,
    email:string,
    verifyUser:boolean,
}

export interface IUserDataReg{
    name:string,
    email:string,
    password:string
}

export interface IRegCorrectData{
    name:boolean,
    email:boolean,
    password:boolean
}

export interface ILoginCorrectData{
    email:boolean,
    password:boolean
}

export interface IUserDataLogin{
    email:string,
    password:string,
}

export interface IAuthRegExp{
    name: RegExp,
    email: RegExp,
    password: RegExp
}
