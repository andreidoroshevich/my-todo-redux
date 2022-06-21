import {setAppErrorAC, setAppStatusAC} from "../../reducers/AppReducer";
import {Dispatch} from "redux";
import {ResponseType} from "../../api/todolist-api";

export const handleServerNetworkError = (dispatch:Dispatch, message: string)=>{
    dispatch(setAppErrorAC({error:message}))
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerAppError = <T>(dispatch:Dispatch, data: ResponseType<T>)=>{
    if (data.messages.length) {
        dispatch(setAppErrorAC({error:data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status:'failed'}))
}