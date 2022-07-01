import {setAppStatusAC} from "./AppReducer";
import {authAPI, LoginParamsType} from "../api/todolist-api";
import {ResultCodeStatus} from "./TodoListsReducer";
import {handleServerAppError, handleServerNetworkError} from "../common/utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";


export const loginTC = createAsyncThunk('auth/login', async (param: LoginParamsType, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.login(param)
        if (res.resultCode === ResultCodeStatus.success) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return;
        } else {
            handleServerAppError(thunkAPI.dispatch, res)
            return thunkAPI.rejectWithValue({})
        }
    } catch(error) {
        handleServerNetworkError(thunkAPI.dispatch, (error as AxiosError).message)
        return thunkAPI.rejectWithValue({})
    }
})

export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        if (res.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return
        } else {
            handleServerAppError(thunkAPI.dispatch, res)
            return thunkAPI.rejectWithValue({})

        }
    } catch(error) {
        handleServerNetworkError(thunkAPI.dispatch, (error as AxiosError).message)
        return thunkAPI.rejectWithValue({})
    }
})

const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC: (state, action: PayloadAction<{ value: boolean }>) => {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled,(state)=>{
            state.isLoggedIn = true
        })
        builder.addCase(logoutTC.fulfilled,(state)=>{
            state.isLoggedIn = false
        })
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
//
// export const logoutTC = () => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     authAPI.logout()
//         .then((res) => {
//             if (res.resultCode === ResultCodeStatus.success) {
//                 dispatch(setIsLoggedInAC({value: false}))
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             } else {
//                 handleServerAppError(dispatch, res)
//             }
//         })
//         .catch((error) => {
//             handleServerNetworkError(dispatch, error.message)
//         })
// }


