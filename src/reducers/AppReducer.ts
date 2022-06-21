import {setIsLoggedInAC} from "./AuthReducer";
import {Dispatch} from "redux";
import {authAPI} from "../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../common/utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

const slice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setAppStatusAC: (state, action: PayloadAction<{ status: RequestStatusType }>)=>{
            state.status = action.payload.status
        },
        setAppErrorAC: (state, action: PayloadAction<{ error: string | null }>)=> {
            state.error = action.payload.error
        },
        setAppIsInitializedAC: (state, action: PayloadAction<{ isInitialized: boolean }>)=> {
            state.isInitialized = action.payload.isInitialized
        },
    }
})

export const {setAppStatusAC, setAppErrorAC, setAppIsInitializedAC} = slice.actions
export const AppReducer = slice.reducer

export const initializeAppTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.me().then(res => {
        if (res.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(dispatch, res)
        }
    })
        .catch((error) => {
            handleServerNetworkError(dispatch, error.message)
        })
        .finally(() => {
            dispatch(setAppIsInitializedAC({isInitialized: true}))
        })
}

