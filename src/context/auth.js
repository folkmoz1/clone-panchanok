import React, {createContext, useReducer, useContext, useEffect} from 'react'
import {gql, useQuery} from "@apollo/client";

const AuthStateContext = createContext()
const AuthDispatchContext = createContext()

const GET_TOKEN = gql`
    query GET_TOKEN {
        getToken 
        {
            message
        }
    }
`

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            localStorage.removeItem('token')
            return {
                ...state,
                user: null
            }
        default:
            throw new Error(`Unknown action type ${action.type}`)
    }
}

export const AuthProvider = ({ children, user }) => {
    const [state, dispatch] = useReducer(authReducer, { user })



    return (
        <AuthStateContext.Provider value={state}>
            <AuthDispatchContext.Provider value={dispatch}>
                { children }
            </AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
    )
}

export const useAuthState = () => useContext(AuthStateContext)
export const useAuthDispatch = () => useContext(AuthDispatchContext)
