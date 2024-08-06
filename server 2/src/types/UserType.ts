

export type UserDTO = {name?:string, email?:string, password?:string}
export type TokenData = {token:string, userId:number}
export type AuthData = {email:string, password:string}
export type UserJWTdata = {id:number, name:string, email:string, verify:boolean, iat:number, exp:number}