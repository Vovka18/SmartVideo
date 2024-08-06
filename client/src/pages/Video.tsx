import React, { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppDispatch, RootState } from '../store'
import { useDispatch, useSelector } from 'react-redux'
import { getVideo } from '../store/slices/videoSlice'
import axios from 'axios'

const Video = () => {

    const navigate = useNavigate()
    const dispatch:AppDispatch = useDispatch()
    const videoState = useSelector((store:RootState) => store.reducerVideo)
    const params = useParams()
    const videoRef = useRef<HTMLVideoElement | null>(null)

    useEffect(()=>{
        
        const token:string = localStorage.getItem('token') as string
        dispatch(getVideo({token:token, idVideo: Number(params.id)}))
        fetchVideo()
    }, [])

    if(!Number(params.id)){
        return <div>Error</div>           
    }
    
    const fetchVideo = async () => {
        const resp = await axios.get('http://127.0.0.1:4000/api/video/stream/4', {
            responseType: 'arraybuffer',
            headers:{
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDgsIm5hbWUiOiJuYW1lIiwiZW1haWwiOiJ2b3ZhLmFydHVob3dAZ21haWwuY29tIiwidmVyaWZ5Ijp0cnVlLCJpYXQiOjE2OTQwOTI5NzYsImV4cCI6MTY5NDQ1Mjk3Nn0.Qp2t5vpIyIGiCEZA5YOwO09bbqFVY41Tuh3vG3JhFw4'
            }
        })
        const videoBlob = new Blob([resp.data],{type:'video/mp4'})
        const videoUrl = URL.createObjectURL(videoBlob)
        if(videoRef.current){
            videoRef.current.src = videoUrl
        }
    }

    return (
        <div>
            <video controls ref={videoRef}></video>
        </div>
    )
}

export default Video