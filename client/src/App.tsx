import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Auth from './pages/Auth'
import Layout from './components/Layout';
import Recomendations from './pages/Recomendations';
import Video from './pages/Video';
import News from './pages/News';
import Account from './pages/Account';
import Subscribdes from './pages/Subscribdes';
import Subscribers from './pages/Subscribers';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import Verification from './pages/Verification';
import VerifyToken from './pages/VerifyToken';
import { refreshToken } from './store/slices/userSlice';





//Авторизованный пользователь 
// не авторизованный



// const user:boolean = false
// const verify:boolean = false



function App() {
    
    const user = useSelector((store:RootState)=> store.reducerUser) 
    const navigate = useNavigate()
    const dispatch:AppDispatch = useDispatch()

    useEffect(()=>{
        const token:string | null = localStorage.getItem('token')
        if(token){
            dispatch(refreshToken(token))
        }
    },[])
    useEffect(()=>{
        if(user.state.error !== ''){
            navigate('/auth')
        }
    },[user.state.error])

    useEffect(()=>{
        if(user.verify){
            navigate('/')
        }
    },[])


    if(user.id === -1){
        return(
            <Routes>
                <Route path='*' element={<Auth/>}/>
            </Routes>
        )
    } else if (user.verify === false && user.id !== -1) {
        return(
            <Routes>
                <Route path='/auth' element={<Auth/>} />
                <Route path='/verification' element={<Verification/>} />
                <Route path='/verification/:token' element={<VerifyToken/>} />
                <Route path='*' element={<Verification/>}/>
            </Routes>
            )
    }else{
        return (
            <Routes>
                <Route path='/' element={<Layout/>}>
                    <Route index element={<Recomendations/>}/>
                    <Route path='recomendations' element={<Recomendations/>}/>
                    <Route path='video/:id' element={<Video/>}/>
                    <Route path='new' element={<News/>}/>
                    <Route path='profile' element={<Account/>}/>
                    <Route path='subscribed' element={<Subscribdes/>}/>
                    <Route path='subscribers' element={<Subscribers/>}/>
                    
                    <Route path='/verification/:token' element={<VerifyToken/>} />
                    <Route path='/auth' element={<Auth/>} />
                    <Route path='*' element={<Recomendations/>}/>
                </Route>
            </Routes>
        )
    }
}

export default App;
