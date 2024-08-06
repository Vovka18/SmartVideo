import React, { Dispatch, SetStateAction, useEffect, useLayoutEffect, useState } from 'react'
import { IUserDataReg, IUserDataLogin, IRegCorrectData, ILoginCorrectData, IAuthRegExp } from '../types/user.type'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { actionLogin, actionRegister } from '../store/slices/userSlice'
import { AppDispatch, RootState } from '../store'
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    type setDataAuth = Dispatch<SetStateAction<IUserDataReg>>
    type setDataLogin = Dispatch<SetStateAction<IUserDataLogin>>
    type setBooleanType = Dispatch<SetStateAction<boolean>>
    type setErrorMesage = Dispatch<SetStateAction<string>>
    const [dataAuth, setDataAuth]: [IUserDataReg, setDataAuth] = useState({name: '', email: '', password : ''})
    const [dataLogin, setDataLogin]: [IUserDataLogin, setDataLogin] = useState({email: '', password : ''})
    const [statusAuth, setStatusAuth] = useState(false)
    const [firstBoot, setFirstBoot]: [boolean, setBooleanType] = useState(true)
    const [errorMesage, setErrorMesage]: [string, setErrorMesage] = useState('')


    const [correctName, setCorrectName] = useState(false)
    const [correctEmail, setCorrectEmail] = useState(false)
    const [correctPassword, setCorrectPassword] = useState(false)


    const navigate = useNavigate()
    const dispatch:AppDispatch = useDispatch()
    const userState = useSelector((store:RootState) => store.reducerUser)

    useEffect(()=>{ //ошибки
        setErrorMesage(userState.state.error)
        if(firstBoot !== true && userState.state.error !== '' && userState.state.error){
            gsap.to('.errorMessageBlock', {top: '30px'})
            gsap.to('.errorMessageBlock', {top: '-50px'}).delay(3.5)
        }

        if(userState.state.error === 'this name is taken'){
            setCorrectName(false)
        }else if(userState.state.error === 'email exist'){
            setCorrectEmail(false)
        }

    },[userState])

    useEffect(()=>{ //после авторизации переводит ...
        if(userState.id !== -1 && userState.verify === false){
            navigate('/verification')
        }else if(userState.verify == true){
            navigate('/')
        }
    },[userState])

    useLayoutEffect(()=>{   //Анимация появления
        if(firstBoot == true){
            gsap.to('.loadSvg', {rotate: 360, duration: 0.8, repeat: -1, ease: 'linear'})
            
            gsap.fromTo('.h1-register', {duration: 1.4, transform: 'scale(0.1)', ease: 'expo'}, {transform: 'scale(1)'})
            gsap.fromTo('#input-1', {duration: .8, transform: "scale(0.3)"}, {transform: 'scale(1)'})
            gsap.fromTo('#input-2', {duration: 1, transform: "scale(0.3)"}, {transform: 'scale(1)'})
            gsap.fromTo('#input-3', {duration: 1.2, transform: "scale(0.3)"}, {transform: 'scale(1)'})
            gsap.fromTo('#span-button-sing-register', {duration: .8, transform: "scale(0.1)"}, {transform: "scale(1)"});
            setFirstBoot(false)
        }
    })

    useEffect(()=>{   //изменение значения checkCorrectData
        const authRegExp:IAuthRegExp = {
            name: /^[a-zA-Z0-9]{4,20}$/, 
            email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 
            password: /^(?=.*[a-zA-Z])(?!([\w\d])\1+$).{5,}$/
        }
        setCorrectName(authRegExp.name.test(dataAuth.name) || dataAuth.name === '' ? true : false)
        setCorrectEmail(authRegExp.email.test(dataAuth.email) || dataAuth.email === '' ? true : false)
        setCorrectPassword(authRegExp.password.test(dataAuth.password) || dataAuth.password === '' ? true : false)
    },[dataAuth])


    useEffect(()=>{   //обводка вокруг инпута
        const addRedBorder = (pathElement:string) => gsap.to(pathElement, {duration: .1, boxShadow: '0px 0px 0px 3px #F00 inset'});
        const removeRedBorder = (pathElement:string) => gsap.to(pathElement, {duration: .1, boxShadow: '0px 0px 1px 3px rgba(0, 255, 26, 0) inset'});

        correctName === false ? gsap.to('#input-1 > input', {duration: .1, boxShadow: '0px 0px 0px 3px #F00 inset'}) : removeRedBorder('#input-1 > input')
        correctEmail === false ? addRedBorder('#input-2 > input') : removeRedBorder('#input-2 > input')
        correctPassword === false ? addRedBorder('#input-3 > input') : removeRedBorder('#input-3 > input')
    },[correctName, correctEmail, correctPassword])

    useLayoutEffect(()=>{   //анимация при переходе login -> regiser register -> login
        if (statusAuth === false) {
            gsap.to('.wrapper-auth', {duration: 1.5, transform: "translate(114%)", ease: 'power4'})
            gsap.to('.h1-register', {duration: 1, transform: 'translateY(0px)', ease: 'expo'})
            gsap.to('.h1-login', {duration: 1, transform: 'translateY(-200px)'})
            
            gsap.to('#input-1', {duration: .6, transform: "translateX(0px)"});
            gsap.to('#input-2', {duration: .8, transform: "translateX(0px)"});
            gsap.to('#input-3', {duration: 1, transform: "translateX(0px)"});

            gsap.to('#input-4', {duration: .8, transform: "translateX(400px)", ease: 'power1'});
            gsap.to('#input-5', {duration: 1, transform: "translateX(400px)", ease: 'power1'});

            gsap.to('#span-button-sing-login', {duration: .6, transform: "translateY(300px)"});
            gsap.to('#span-button-sing-register', {duration: .8, transform: "translateY(0px)"});
            gsap.to('#span-p-move-login', {duration: .6, transform: "translateY(0px)"});
            gsap.to('#span-p-move-register', {duration: .8, transform: "translateY(200px)"});
        } else {
            gsap.to('.wrapper-auth', {duration: 1.5, transform: "translate(0%)", ease: 'power4'})
            gsap.to('.h1-register', {duration: 1, transform: 'translateY(-200px)'})
            gsap.to('.h1-login', {duration: 1, transform: 'translateY(0px)', ease: 'expo'})

            gsap.to('#input-1', {duration: .6, transform: "translateX(-400px)", ease: 'power1'});
            gsap.to('#input-2', {duration: .8, transform: "translateX(-400px)", ease: 'power1'});
            gsap.to('#input-3', {duration: 1, transform: "translateX(-400px)", ease: 'power1'});

            gsap.to('#input-4', {duration: .8, transform: "translateX(0px)"});
            gsap.to('#input-5', {duration: 1, transform: "translateX(0px)"});

            gsap.to('#span-button-sing-login', {duration: .6, transform: "translateY(0px)"});
            gsap.to('#span-button-sing-register', {duration: .8, transform: "translateY(300px)"});
            gsap.to('#span-p-move-login', {duration: .6, transform: "translateY(200px)"});
            gsap.to('#span-p-move-register', {duration: .6, transform: "translateY(0px)"});
        }
    }, [statusAuth]);

    useLayoutEffect(()=>{   //высовывание загрузки слева
        if(userState.state.isLoading == true){
            gsap.to('.loading', {duration: 0.2, x: 50})
        }else{
            gsap.to('.loading', {duration: 0.3, x: 0}).delay(1)
        }
    },[userState.state.isLoading])

    const shakingInputs = (pathInput:string):void =>{ //тряска инпута
        gsap.timeline({repeat: 1})
        .to(pathInput, {duration: .1, x: -7, ease: 'power1'})
        .to(pathInput, {duration: .1, x: 7, ease: 'power1'})
        .to(pathInput, {duration: .1, x: 0, ease: 'power1'})
    }

    const submitReg = (e:any):void =>{
        e.preventDefault()
        if(correctName === true && correctEmail === true && correctPassword === true && dataAuth.name !== '' && dataAuth.email !== '' && dataAuth.password !== ''){
            dispatch(actionRegister(dataAuth))
        }else{
            if(!correctName || dataAuth.name === '') shakingInputs('#input-1')
            if(!correctEmail || dataAuth.email === '') shakingInputs('#input-2')
            if(!correctPassword || dataAuth.password === '') shakingInputs('#input-3')
        }
    }

    const submitLogin = (e:any):void =>{
        e.preventDefault() 
        if(dataLogin.email !== '' && dataLogin.password !== ''){
            dispatch(actionLogin(dataLogin))
        }else{
            if(dataLogin.email === '') shakingInputs('#input-4')
            if(dataLogin.password === '') shakingInputs('#input-5')
        }
    }
    


    return (
        <div className="box-auth flex items-center justify-center px-10">

            <div className="loading flex justify-end items-center px-1">
                <div className='loadSvg'>
                    <svg width="25" height="23" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.25793 16.1926L2.30987 5.51466C0.801463 7.57623 -0.00326984 10.0099 9.98582e-06 12.5C9.98582e-06 13.7849 0.210986 15.0255 0.601943 16.1926H9.25793ZM12.1773 7.19982H25.7211C23.9816 3.77462 20.612 1.19577 16.542 0.324747L12.1773 7.19982ZM7.82949 11.0696L14.8172 0.0609216C14.3792 0.0205244 13.9394 0.000192438 13.4992 0C9.47434 0 5.85785 1.64136 3.38269 4.23732L7.82949 11.0696ZM10.6445 24.6063L14.9184 17.703H1.22998C3.02544 21.319 6.62889 24.0076 10.9631 24.7754L10.6445 24.6063ZM17.7198 8.71027L24.5433 19.6741C26.144 17.5755 27.0023 15.0688 27 12.4995C27.0007 11.2136 26.7861 9.93531 26.3638 8.71027H17.7198ZM19.1107 13.9717L12.3133 24.9481C12.7042 24.9799 13.0995 25 13.4992 25C17.4321 25 20.9774 23.4337 23.4471 20.9399L19.1107 13.9717Z" fill="#0D0D0D"/>
                    </svg>
                </div>
            </div>
            <div className="errorMessageBlock">
                <p className='error-text-message flex items-center py-1.5 px-2'>Error: {errorMesage}</p>
            </div>

            <div className="auth flex truncate">
                <form className='register flex flex-col justify-between' onSubmit={(e)=>submitReg(e)}>
                    <h1 className='h1-register'>Register</h1>
                    <div id='input-1'> <input className='auth-inputs' type="text" placeholder='name' value={dataAuth.name} onChange={(e)=>setDataAuth({...dataAuth, name: e.target.value})} /> </div>
                    <div id='input-2'> <input className='auth-inputs' type="email" placeholder='email' value={dataAuth.email} onChange={(e)=>setDataAuth({...dataAuth, email: e.target.value})} /> </div>
                    <div id='input-3'> <input className='auth-inputs' type="password" placeholder='password' value={dataAuth.password} onChange={(e)=>setDataAuth({...dataAuth, password: e.target.value })} /> </div>
                    <div id='span-button-sing-register'>
                        <button className='button-sing'>sign in</button>
                    </div>
                    <div id='span-p-move-login'>
                        <p className='move-to-login flex items-center justify-between w-[50px]' onClick={()=> {setStatusAuth(true)}}>login<svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.86754 10.1971L5.90874 9.24893L9.23793 5.91974H0.875V4.5348H9.23793L5.90874 1.21094L6.86754 0.257457L11.8374 5.22727L6.86754 10.1971Z" fill="#F0EEE7"/></svg></p>
                    </div>
                </form>
                <form className='login flex flex-col justify-between items-end' onSubmit={(e)=>submitLogin(e)}>
                    <h1 className='h1-login'>Login</h1>
                    <div id='input-4'> <input className='auth-inputs auth-inputs-login'  type="email" placeholder='email' value={dataLogin.email} onChange={(e)=>setDataLogin({...dataLogin, email: e.target.value})} /> </div>
                    <div id='input-5'> <input className='auth-inputs auth-inputs-login' type="password" placeholder='password' value={dataLogin.password} onChange={(e)=>setDataLogin({...dataLogin, password: e.target.value })} /> </div>
                    <div id='span-button-sing-login'>
                        <button className='button-sing'>sign in</button>
                    </div>
                    <div id='span-p-move-register'>
                        <p className='move-to-register flex items-center justify-between w-[75px]' onClick={()=> {setStatusAuth(false)}}>register<svg className='rotate-180' width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.86754 10.1971L5.90874 9.24893L9.23793 5.91974H0.875V4.5348H9.23793L5.90874 1.21094L6.86754 0.257457L11.8374 5.22727L6.86754 10.1971Z" fill="#F0EEE7"/></svg></p>
                    </div>
                </form>
                <div className="wrapper-auth"></div>
            </div>
        </div>
    )
}

export default Auth