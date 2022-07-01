import {setIsLoggedInAC} from "./AuthReducer";
import {authAPI} from "../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../common/utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {ResultCodeStatus} from "./TodoListsReducer";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export const initializeAppTC = createAsyncThunk('app/initializeApp', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.me()
        if (res.resultCode === ResultCodeStatus.success) {
            thunkAPI.dispatch(setIsLoggedInAC({value: true}))
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(thunkAPI.dispatch, res)
            return thunkAPI.rejectWithValue({})
        }
    } catch (error) {
        handleServerNetworkError(thunkAPI.dispatch, (error as AxiosError).message)
        return thunkAPI.rejectWithValue({})
    }
})


const slice = createSlice({
    name: "app",
    initialState: {
        status: 'loading' as RequestStatusType,
        error: null as string | null,
        isInitialized: false
    },
    reducers: {
        setAppStatusAC: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppErrorAC: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        // setAppIsInitializedAC: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
        //     state.isInitialized = action.payload.isInitialized
        // },
    },
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state) => {
            state.isInitialized = true
        })
    }
})

export const {setAppStatusAC, setAppErrorAC} = slice.actions
export const AppReducer = slice.reducer

// export const initializeAppTC = () => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     authAPI.me().then(res => {
//         if (res.resultCode === 0) {
//             dispatch(setIsLoggedInAC({value: true}))
//             dispatch(setAppStatusAC({status: 'succeeded'}))
//         } else {
//             handleServerAppError(dispatch, res)
//         }
//     })
//         .catch((error) => {
//             handleServerNetworkError(dispatch, error.message)
//         })
//         .finally(() => {
//             dispatch(setAppIsInitializedAC({isInitialized: true}))
//         })
// }

