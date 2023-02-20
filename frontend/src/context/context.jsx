import React, { createContext, useReducer } from 'react'
import { reducer } from './reducer';


export const GlobalContext = createContext("Initial Value");


let data = {
    user: {},
    loginToken:"",
    isLogin: null,
    baseUrl: (window.location.href.indexOf("https") === -1) ? "http://localhost:8000/api/v1" : "ROute For Hosted Url",

}

export default function ContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, data)
    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    )
}