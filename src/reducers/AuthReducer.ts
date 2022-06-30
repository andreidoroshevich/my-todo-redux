import {Dispatch} from 'redux'
import {setAppStatusAC} from "./AppReducer";
import {authAPI, LoginParamsType} from "../api/todolist-api";
import {ResultCodeStatus} from "./TodoListsReducer";
import {handleServerAppError, handleServerNetworkError} from "../common/utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

const initialState = {
    isLoggedIn: false
}

export const loginTC = createAsyncThunk('auth/login', async (param: LoginParamsType, thunkAPI) => {

    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await authAPI.login(param)
    try {
        if (res.resultCode === ResultCodeStatus.success) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {value: true}
        } else {
            handleServerAppError(thunkAPI.dispatch, res)
            return {value: false}
        }
    } catch(error) {
        handleServerNetworkError(thunkAPI.dispatch, (error as AxiosError).message)
        return {value: false}
    }
})


const slice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setIsLoggedInAC: (state, action: PayloadAction<{ value: boolean }>) => {
            state.isLoggedIn = action.payload.value
        }
    }
})

export const AuthReducer = slice.reducer
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC

// export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status:'loading'}))
//     authAPI.login(data)
//         .then((res) => {
//             if (res.resultCode === ResultCodeStatus.success) {
//                 dispatch(setIsLoggedInAC({value:true}))
//                 dispatch(setAppStatusAC({status:'succeeded'}))
//             } else {
//                 handleServerAppError(dispatch, res)
//             }
//         })
//         .catch((error) => {
//             handleServerNetworkError(dispatch, error.message)
//         })
// }
export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logout()
        .then((res) => {
            if (res.resultCode === ResultCodeStatus.success) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res)
            }
        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error.message)
        })
}


