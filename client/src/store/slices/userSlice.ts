import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit'
import { IDecodeToken, IUserDataLogin, IUserDataReg, IUserType } from '../../types/user.type'
import axios, { AxiosResponse } from 'axios'
import jwtDecode from 'jwt-decode'

const userType:IUserType = {
    id: -1,
    name: '',
    email: '',
    verify: false,
    state: {isLoading: false, error: ''}
}

export const actionRegister = createAsyncThunk('user/register', async (dataReg:IUserDataReg) => {
    try{
        const resp:AxiosResponse = await axios.post('http://127.0.0.1:4000/api/user/registration', {
                "name": dataReg.name,
                "email": dataReg.email,
                "password" : dataReg.password,
        })
        return resp.data
    }catch(e:any){
        return Promise.reject(e.response.data) 
    }
    
})
export const actionLogin = createAsyncThunk('user/login', async (dataReg:IUserDataLogin) => {
    try{

        const resp:AxiosResponse = await axios.post('http://127.0.0.1:4000/api/user/auth', {
            "email": dataReg.email,
            "password" : dataReg.password
        })
        return resp.data
    }catch(e:any){
        return Promise.reject(e.response.data) 
    }
    
})
export const refreshToken = createAsyncThunk('user/refreshToken', async (token:string) => {
    try{
        const resp:AxiosResponse = await axios.get('http://127.0.0.1:4000/api/user/refreshToken', {
            headers:{
                Authorization: 'Bearer ' + token
            }
        })
        return resp.data
    }catch(e:any){
        return Promise.reject(e.response.data) 
    }    
})
type dataVerifyAccount = {token:string, verifyToken:string}
export const verifyAccount = createAsyncThunk('user/verifyAccount', async (dataVerify:dataVerifyAccount) => {
    try{
        const resp:AxiosResponse = await axios.post(`http://127.0.0.1:4000/api/user/verification?token=${dataVerify.verifyToken}`, {
            headers:{
                Authorization: 'Bearer ' + dataVerify.token
            }
        })
        return resp.data
    }catch(e:any){
        return Promise.reject(e.response.data) 
    }    
})


const userSlice = createSlice({
    name: "user",
    initialState: userType,
    reducers:{
        
    },
    extraReducers: (builder) => {
        builder
        //REGISTER
        .addCase(actionRegister.fulfilled, (state,action)=> {
            localStorage.removeItem('token')
            localStorage.setItem('token', action.payload.token)
            const decodeToken:IUserType = jwtDecode(action.payload.token)
            state.id = decodeToken.id
            state.name = decodeToken.name
            state.email = decodeToken.email
            state.verify = decodeToken.verify
            state.state.isLoading = false
            state.state.error = ''
        })
        .addCase(actionRegister.pending, (state,action)=> {
            state.state.isLoading = true 
        })
        .addCase(actionRegister.rejected, (state,action)=> {
            state.state.isLoading = false 
            state.state.error = action.error.message as string
        })
        //LOGIN
        .addCase(actionLogin.fulfilled, (state,action)=> {
            localStorage.removeItem('token')
            localStorage.setItem('token', action.payload.token)
            const decodeToken:IUserType = jwtDecode(action.payload.token)
            state.id = decodeToken.id
            state.name = decodeToken.name
            state.email = decodeToken.email
            state.verify = decodeToken.verify
            state.state.isLoading = false 
            state.state.error = ''
        })
        .addCase(actionLogin.pending, (state,action)=> {
            state.state.isLoading = true 
        })
        .addCase(actionLogin.rejected, (state,action)=> {
            state.state.isLoading = false 
            state.state.error = action.error.message as string
        })
        //REFRESHTOKEN
        .addCase(refreshToken.fulfilled, (state,action)=> {
            localStorage.removeItem('token')
            localStorage.setItem('token', action.payload.token)
            const decodeToken:IDecodeToken = jwtDecode(action.payload.token)
            
            state.id = decodeToken.id
            state.name = decodeToken.name
            state.email = decodeToken.email
            state.verify = decodeToken.verifyUser
            
            state.state.isLoading = false 
            state.state.error = ''
        })
        .addCase(refreshToken.pending, (state,action)=> {
            state.state.isLoading = true
        })
        .addCase(refreshToken.rejected, (state,action)=> {
            localStorage.removeItem('token')
            state.state.isLoading = false 
            state.state.error = action.error.message as string
        })
        //VERIFYACCOUNT
        .addCase(verifyAccount.fulfilled, (state,action)=> {
            localStorage.removeItem('token')
            localStorage.setItem('token', action.payload.token)
            const decodeToken:IUserType = jwtDecode(action.payload.token)
            
            state.id = decodeToken.id
            state.name = decodeToken.name
            state.email = decodeToken.email
            state.verify = decodeToken.verify
            
            state.state.isLoading = false 
            state.state.error = ''
        })
        .addCase(verifyAccount.pending, (state,action)=> {
            state.state.isLoading = true
        })
        .addCase(verifyAccount.rejected, (state,action)=> {
            // localStorage.removeItem('token')
            state.state.isLoading = false 
            state.state.error = action.error.message as string
        })
    }
})

export const reducerUser = userSlice.reducer 