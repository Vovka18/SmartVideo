import React, { useEffect, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';

const Verification = () => {
    const user = useSelector((store:RootState)=> store.reducerUser) 

    useEffect(()=>{
        const timeline = gsap.timeline()
        timeline.fromTo('#span1-1', {x: -150}, {x: 0, duration: .3, ease: 'circ', delay: 0.5})
        timeline.fromTo('#span1-2', {y: -300}, {y: 0, duration: .6, ease: 'back', delay: 0.2})

        timeline.fromTo('#span2', {y: 50, opacity: 0}, {y: 0, duration: 0.5})
        timeline.fromTo('#span2', {x: -240, scale: .6}, {x: 0, scale: 1, opacity: 1, ease: 'power1'}, '-=0.3')

        timeline.fromTo('#span3-1', {x: -400, opacity: .0}, {x: 0, opacity: 1, duration: .3, ease: 'power1'})
        timeline.fromTo('#span3-2', {x: 700, opacity: .0, width: '800px'}, {x: 0, opacity: 1, duration: 1.5, ease: 'expo', width: '300px', delay: .1})

        timeline.fromTo('#span4', {y: 50, opacity: .0}, {y: 0, opacity: 1, duration: 1.1, ease: 'expo', delay: .6}, '-=1.3')

        timeline.fromTo('.email-verify', {opacity: .0}, {opacity: 1, duration: 1, ease: 'power1', delay: .1})
    })

    return (
        <div className="box-verify flex flex-col">
            <div className="span-text flex"> 
                <div id="span1-1">I</div>
                <span className='w-10'></span>
                <div id="span1-2">am</div>
            </div>

            <span id='span2' className='span-text'>waiting</span>

            <div id='span3' className='span-text flex'>
                <span id='span3-1'>for</span>
                <span className='w-10'></span>
                <div id='span3-2' className="span-text span-text-you flex justify-between">
                    <div>y</div>
                    <div>o</div>
                    <div>u</div>
                    <div>r</div>
                </div>
            </div>

            <span id='span4' className='span-text'>email confirmation</span>
            
            <span className='email-verify'>{user.email}</span>
        </div>
    )
}

export default Verification