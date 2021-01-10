import React, { createContext, useState } from 'react'
import { ILogin } from '../ILoginContext';

interface ILoginContext {
    login: ILogin,
    setLogin: React.Dispatch<React.SetStateAction<ILogin>>
}

export const LoginContext = createContext<ILoginContext>({} as ILoginContext);

export const LoginProvider = (props: any) => {
    const [login, setLogin] = useState<ILogin>({ isLogged: false })
    return (
        <LoginContext.Provider value={{login, setLogin}} >
        {props.children}
        </LoginContext.Provider>
    )
}

