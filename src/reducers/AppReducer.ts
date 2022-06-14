import {setIsLoggedInAC} from "./AuthReducer";
import {Dispatch} from "redux";
import {authAPI} from "../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../common/utils/error-utils";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}
type InitialStateType = typeof initialState
export const AppReducer = (state: InitialStateType = initialState, action:
    AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP-SET-STATUS':
            return {...state, status: action.status}
        case 'APP-SET-ERROR':
            return {...state, error: action.error}
        case 'APP-SET-IS-INITIALIZED':
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => {
    return {
        type: 'APP-SET-STATUS',
        status
    } as const
}

export const setAppErrorAC = (error: string | null) => {
    return {
        type: 'APP-SET-ERROR',
        error
    } as const
}

export const setAppIsInitializedAC = (isInitialized: boolean) => {
    return {
        type: 'APP-SET-IS-INITIALIZED',
        isInitialized
    } as const
}

export const initializeAppTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.me().then(res => {
        if (res.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(dispatch, res)
        }
    })
        .catch((error) => {
        handleServerNetworkError(dispatch, error.message)
    })
        .finally(()=>{
            dispatch(setAppIsInitializedAC(true))
        })
}

export type SetAppActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type setAppIsInitializedType = ReturnType<typeof setAppIsInitializedAC>


export type AppActionsType = SetAppActionType | SetAppErrorActionType | setAppIsInitializedType