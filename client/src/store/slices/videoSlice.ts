import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit'
import { IDecodeToken, IUserDataLogin, IUserDataReg, IUserType } from '../../types/user.type'
import axios, { AxiosResponse } from 'axios'
import jwtDecode from 'jwt-decode'
import { IGetVideo, IRecomendType, IVideo } from '../../types/video.type'

const initialState:IVideo = {
    video: {
        id:-1,
        userId:-1,
        pathVideo:'',
        pathImage:'',
        title:'',
        subTitle:'',
        createdAt:'',
        updatedAt:'',
        TagsVideo: {
            id:-1,
            videoId:-1,
            tagId:-1,
            createdAt:'',
            updatedAt:'',
        },
        likes: [],
        views: [],
        comments: [],
    },
    state: {isLoading: false, error: ''}
}


export const getVideo = createAsyncThunk('video/getVideo', async (data:IGetVideo) => {
    try{
        const resp:AxiosResponse = await axios.get(`http://127.0.0.1:4000/api/video/getVideoid/${data.idVideo}`, {
            headers:{
                Authorization: 'Bearer ' + data.token
            }
        })
        return resp.data
    }catch(e:any){
        return Promise.reject(e.response.data) 
    }    
})


export const videoSlice = createSlice({
    name: "video",
    initialState: initialState,
    reducers:{
        
    },
    extraReducers: (builder) => {
        builder
        //get video
        .addCase(getVideo.fulfilled, (state,action)=> {
            state.video=  action.payload
            state.state.isLoading = false 
        })
        .addCase(getVideo.pending, (state,action)=> {
            state.state.isLoading = true 
        })
        .addCase(getVideo.rejected, (state,action)=> {
            state.state.isLoading = false 
            state.state.error = action.error.message as string
        })
    }
})

export const reducerVideo = videoSlice.reducer 