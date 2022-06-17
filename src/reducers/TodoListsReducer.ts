import {TodoListAPI, TodoListType} from "../api/todolist-api";
import {AppThunkType} from "../store/store";
import {AppActionsType, RequestStatusType, setAppStatusAC} from "./AppReducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../common/utils/error-utils";

const initialState: Array<TodoListDomainType> = []

export type TodoListsActionType = removeTodoListACType
    | addTodoListACType
    | changeTodoListTitleACType
    | filterACType
    | setTodoListsType
    | AppActionsType
    | changeTodolistEntityStatusType

export enum ResultCodeStatus {
    'success' = 0,
    'error' = 1,
    'captcha' = 10
}

export const TodoListsReducer = (state = initialState, action: TodoListsActionType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST": {
            return state.filter(tl => tl.id !== action.todoListID)
        }
        case "ADD-TODOLIST": {
            let NewTodolist: TodoListDomainType = {...action.todoList, filter: "All", entityStatus: 'idle'}

            return [
                NewTodolist, ...state
            ]
        }
        case "CHANGE-TODOLIST-TITLE": {
            return state.map(tl => tl.id === action.todoListID ? {...tl, title: action.newTitle} : tl)
        }
        case "FILTER": {
            return state.map(tl => tl.id === action.todoListID ? {...tl, filter: action.filter} : tl)
        }
        case "SET-TODOLISTS": {
            return action.todoLists.map(tl => {
                return {...tl, filter: "All", entityStatus: 'idle'}
            })
        }
        case "CHANGE-TODOLIST-ENTITY-STATUS": {
            return state.map(tl => tl.id === action.todoListID ? {...tl, entityStatus: action.entityStatus} : tl)
        }
        default:
            return state
    }
}

export type removeTodoListACType = ReturnType<typeof removeTodoListAC>
export type addTodoListACType = ReturnType<typeof addTodoListAC>
export type changeTodoListTitleACType = ReturnType<typeof changeTodoListTitleAC>
export type filterACType = ReturnType<typeof filterAC>
export type setTodoListsType = ReturnType<typeof setTodoListsAC>
export type changeTodolistEntityStatusType = ReturnType<typeof changeTodolistEntityStatusAC>

export type FilterType = 'All' | 'Completed' | 'Active' //типизация для сортировки
export type TodoListDomainType = TodoListType & {
    filter: FilterType
    entityStatus: RequestStatusType
}

export const removeTodoListAC = (todoListID: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        todoListID

    } as const
}
export const addTodoListAC = (todoList: TodoListType) => {
    return {
        type: 'ADD-TODOLIST',
        todoList,
    } as const
}
export const changeTodoListTitleAC = (todoListID: string, newTitle: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        todoListID,
        newTitle

    } as const
}
export const filterAC = (todoListID: string, filter: FilterType) => {
    return {
        type: 'FILTER',
        todoListID,
        filter,

    } as const
}
export const setTodoListsAC = (todoLists: TodoListType[]) => {
    return {
        type: 'SET-TODOLISTS',
        todoLists,
    } as const
}
export const changeTodolistEntityStatusAC = (todoListID: string, entityStatus: RequestStatusType) => {
    return {
        type: 'CHANGE-TODOLIST-ENTITY-STATUS',
        todoListID,
        entityStatus
    } as const
}

export const fetchTodoListsTC = (): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await TodoListAPI.getTodoLists()
        dispatch(setTodoListsAC(res))
        dispatch(setAppStatusAC('succeeded'))
    } catch (error) {
        handleServerNetworkError(dispatch, (error as AxiosError).message)
    }
}
export const removeTodoListTC = (todoListID: string): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todoListID, 'loading'))
    try {
        const res = await TodoListAPI.deleteTodoList(todoListID)
        if (res.resultCode === ResultCodeStatus.success) {
            dispatch(removeTodoListAC(todoListID))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(dispatch, res)
        }
    } catch (error) {
        handleServerNetworkError(dispatch, (error as AxiosError).message)
    }
}
export const addTodoListTC = (title: string): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await TodoListAPI.createTodoList(title)
        if (res.resultCode === ResultCodeStatus.success) {
            dispatch(addTodoListAC(res.data.item))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(dispatch, res)
        }
    } catch (error) {
        handleServerNetworkError(dispatch, (error as AxiosError).message)
    }
}
export const updateTodoListTitleTC = (todolistId: string, title: string): AppThunkType => {
    return (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        TodoListAPI.updateTodoList(todolistId, title)
            .then((res) => {
                if (res.resultCode === ResultCodeStatus.success) {
                    dispatch(changeTodoListTitleAC(todolistId, title))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerAppError(dispatch, res)
                }
            }).catch((error: AxiosError) => {
            handleServerNetworkError(dispatch, (error as AxiosError).message)
        })
    }
}




