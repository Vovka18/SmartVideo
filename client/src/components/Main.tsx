import React, {ReactElement } from 'react'

interface IPropsMain {
    children: ReactElement
}

const Main:React.FC<IPropsMain> = ({children}) => {
  return (
    <main>{children}</main>
  )
}

export default Main