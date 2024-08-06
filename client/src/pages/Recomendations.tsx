import React, { useEffect } from 'react'
import { AppDispatch, RootState } from '../store'
import { useDispatch, useSelector } from 'react-redux'
import { getRecomendation } from '../store/slices/recomendationSlice'
import { NavLink } from 'react-router-dom'



const Recomendations = () => {

    const dispatch:AppDispatch = useDispatch()

    const recomedationState = useSelector((store:RootState) => store.reducerRecomendation)

    console.log(recomedationState.videos[0]);
    

    useEffect(()=>{
        const token:string = localStorage.getItem('token') as string
        dispatch(getRecomendation(token))
    },[])



    return (
        <div>
            {recomedationState.videos.map((video)=>{
                return <NavLink to={`/video/${video.id}`}>
                    <div className="video" key={video.id}>
                        <img src={`http://127.0.0.1:4000/${video.pathImage}`} alt="" />
                        <div> {video.title} </div>
                        <div> {video.likes.length} </div>
                        <div> {video.views.length} </div>
                    </div>
                </NavLink>
            })}
        </div>
    )
}

export default Recomendations