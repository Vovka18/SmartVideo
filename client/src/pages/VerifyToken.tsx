import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import { AppDispatch, RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { verifyAccount } from '../store/slices/userSlice';

const VerifyToken = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate()
    const params = useParams();
    const userState = useSelector((store:RootState) => store.reducerUser)

    useEffect(()=>{
        if(!params.token){
            return ;
        }
        const token:string | null = localStorage.getItem('token')
        if(!token){
            return ;
        }
        dispatch(verifyAccount({token: token, verifyToken: params.token}))
    },[])

    useEffect(()=>{
        if(userState.verify){
            navigate('/')
        }
    },[])

    return (
        <div>VerifyToken</div>
    );
}

export default VerifyToken;
