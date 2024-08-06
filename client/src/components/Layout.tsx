import React from 'react'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import Main from './Main'
import Aside from './Aside'
import Header from './Header'

const Layout = () => {
    return (
        <>
        <div className="boxLayout">
            <Header/>
            {/* <Aside/> */}
            <Main>
                <Outlet/>
            </Main>
            <Footer></Footer>
        </div>
        </>
    )
}

export default Layout