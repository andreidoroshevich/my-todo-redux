import { Dispatch } from 'redux'
import {SetAppActionType, SetAppErrorActionType, setAppStatusAC} from "./AppReducer";
import {authAPI, LoginParamsType} from "../api/todolist-api";
import {ResultCodeStatus} from "./TodoListsReducer";
import {handleServerAppError, handleServerNetworkError} from "../common/utils/error-utils";


const initialState = {
    isLoggedIn: false
}
export type IsAuthInitialStateType = typeof initialState

export const AuthReducer = (state: IsAuthInitialStateType = initialState, action:
    ActionsType): IsAuthInitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
export const setIsLoggedInAC = (value: boolean) =>{
    return {
        type: 'login/SET-IS-LOGGED-IN',
        value
    } as const
}


export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data)
        .then((res)=>{
            if (res.resultCode === ResultCodeStatus.success) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res)
            }
        })
        .catch((error)=>{
        handleServerNetworkError(dispatch, error.message)
    })
}

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then((res)=>{
            if (res.resultCode === ResultCodeStatus.success) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res)
            }
        })
        .catch((error)=>{
            handleServerNetworkError(dispatch, error.message)
        })
}


type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppActionType |
    SetAppErrorActionType