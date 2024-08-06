import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit'
import { IDecodeToken, IUserDataLogin, IUserDataReg, IUserType } from '../../types/user.type'
import axios, { AxiosResponse } from 'axios'
import jwtDecode from 'jwt-decode'
import { IRecomendType } from '../../types/video.type'

const initialState:IRecomendType = {
    videos: [],
    state: {isLoading: false, error: ''}
}


export const getRecomendation = createAsyncThunk('recomendation/getRecomendation', async (token:string) => {
    try{
        const resp:AxiosResponse = await axios.get(`http://127.0.0.1:4000/api/video/recomendation`, {
            headers:{
                Authorization: 'Bearer ' + token
            }
        })
        return resp.data
    }catch(e:any){
        
        return Promise.reject(e.response.data) 
    }    
})


const recomendationSlice = createSlice({
    name: "recomendation",
    initialState: initialState,
    reducers:{
        
    },
    extraReducers: (builder) => {
        builder
        //get recomend
        .addCase(getRecomendation.fulfilled, (state,action)=> {
            state.videos =  action.payload
            state.state.isLoading = false 
        })
        .addCase(getRecomendation.pending, (state,action)=> {
            state.state.isLoading = true 
        })
        .addCase(getRecomendation.rejected, (state,action)=> {
            state.state.isLoading = false 
            state.state.error = action.error.message as string
        })
    }
})

export const reducerRecomendation = recomendationSlice.reducer 