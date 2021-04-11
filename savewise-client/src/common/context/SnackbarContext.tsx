import React, { createContext, useState } from 'react'
import { ISnackbarInfo } from '../objects/SnackbarHelpers';

interface ISnackbarContext {
    snackbarInfo: ISnackbarInfo,
    setSnackbarInfo: React.Dispatch<React.SetStateAction<ISnackbarInfo>>
}

export const SnackbarContext = createContext<ISnackbarContext>({} as ISnackbarContext);

export const SnackbarProvider = (props: any) => {
    const [snackbarInfo, setSnackbarInfo] = useState<ISnackbarInfo>({ severity: undefined, message: '' })
    return (
        <SnackbarContext.Provider value={{snackbarInfo, setSnackbarInfo}} >
        {props.children}
        </SnackbarContext.Provider>
    )
}