import {AppActionsType, setAppErrorAC, setAppStatusAC} from "../../reducers/AppReducer";
import {Dispatch} from "redux";
import {ResponseType} from "../../api/todolist-api";

export const handleServerNetworkError = (dispatch:Dispatch<AppActionsType>, message: string)=>{
    dispatch(setAppErrorAC(message))
    dispatch(setAppStatusAC('failed'))
}

export const handleServerAppError = <T>(dispatch:Dispatch<AppActionsType>, data: ResponseType<T>)=>{
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}