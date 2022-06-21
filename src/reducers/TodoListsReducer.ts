import {TodoListAPI, TodoListType} from "../api/todolist-api";
import {RequestStatusType, setAppStatusAC} from "./AppReducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../common/utils/error-utils";
import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type FilterType = 'All' | 'Completed' | 'Active' //типизация для сортировки
export type TodoListDomainType = TodoListType & {
    filter: FilterType
    entityStatus: RequestStatusType
}
const initialState: Array<TodoListDomainType> = []

export enum ResultCodeStatus {
    'success' = 0,
    'error' = 1,
    'captcha' = 10
}

const slice = createSlice({
    name: "todolist",
    initialState: initialState,
    reducers: {
        removeTodoListAC: (state, action: PayloadAction<{ todoListID: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoListID)
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        addTodoListAC: (state, action: PayloadAction<{ todoList: TodoListType }>) => {
            state.unshift({...action.payload.todoList, filter: "All", entityStatus: 'idle'})
        },
        changeTodoListTitleAC: (state, action: PayloadAction<{ todoListID: string, newTitle: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoListID)
            state[index].title = action.payload.newTitle
        },
        filterAC: (state, action: PayloadAction<{ todoListID: string, filter: FilterType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoListID)
            state[index].filter = action.payload.filter
        },
        setTodoListsAC: (state, action: PayloadAction<{ todoLists: TodoListType[] }>) => {
            return action.payload.todoLists.map(tl => ({...tl, filter: "All", entityStatus: 'idle'}))
        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{ todoListID: string, entityStatus: RequestStatusType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoListID)
            state[index].entityStatus = action.payload.entityStatus
        },
    }
})

export const TodoListsReducer = slice.reducer
export const {
    removeTodoListAC,
    addTodoListAC,
    changeTodoListTitleAC,
    filterAC,
    setTodoListsAC,
    changeTodolistEntityStatusAC,
} = slice.actions

export type removeTodoListACType = ReturnType<typeof removeTodoListAC>
export type addTodoListACType = ReturnType<typeof addTodoListAC>
export type setTodoListsType = ReturnType<typeof setTodoListsAC>
export type changeTodoListTitleACType = ReturnType<typeof changeTodoListTitleAC>
export type filterACType = ReturnType<typeof filterAC>
export type changeTodolistEntityStatusType = ReturnType<typeof changeTodolistEntityStatusAC>

export const fetchTodoListsTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await TodoListAPI.getTodoLists()
        dispatch(setTodoListsAC({todoLists: res}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
    } catch (error) {
        handleServerNetworkError(dispatch, (error as AxiosError).message)
    }
}
export const removeTodoListTC = (todoListID: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({todoListID: todoListID, entityStatus: 'loading'}))
    try {
        const res = await TodoListAPI.deleteTodoList(todoListID)
        if (res.resultCode === ResultCodeStatus.success) {
            dispatch(removeTodoListAC({todoListID: todoListID}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(dispatch, res)
        }
    } catch (error) {
        handleServerNetworkError(dispatch, (error as AxiosError).message)
    }
}
export const addTodoListTC = (title: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await TodoListAPI.createTodoList(title)
        if (res.resultCode === ResultCodeStatus.success) {
            dispatch(addTodoListAC({todoList: res.data.item}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(dispatch, res)
        }
    } catch (error) {
        handleServerNetworkError(dispatch, (error as AxiosError).message)
    }
}
export const updateTodoListTitleTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        TodoListAPI.updateTodoList(todolistId, title)
            .then((res) => {
                if (res.resultCode === ResultCodeStatus.success) {
                    dispatch(changeTodoListTitleAC({todoListID: todolistId, newTitle: title}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(dispatch, res)
                }
            }).catch((error: AxiosError) => {
            handleServerNetworkError(dispatch, (error as AxiosError).message)
        })
    }
}



// export const TodoListsReducer = (state = initialState, action: TodoListsActionType): Array<TodoListDomainType> => {
//     switch (action.type) {
//         case "REMOVE-TODOLIST": {
//             return state.filter(tl => tl.id !== action.todoListID)
//         }
//         case "ADD-TODOLIST": {
//             let NewTodolist: TodoListDomainType = {...action.todoList, filter: "All", entityStatus: 'idle'}
//
//             return [
//                 NewTodolist, ...state
//             ]
//         }
//         case "CHANGE-TODOLIST-TITLE": {
//             return state.map(tl => tl.id === action.todoListID ? {...tl, title: action.newTitle} : tl)
//         }
//         case "FILTER": {
//             return state.map(tl => tl.id === action.todoListID ? {...tl, filter: action.filter} : tl)
//         }
//         case "SET-TODOLISTS": {
//             return action.todoLists.map(tl => {
//                 return {...tl, filter: "All", entityStatus: 'idle'}
//             })
//         }
//         case "CHANGE-TODOLIST-ENTITY-STATUS": {
//             return state.map(tl => tl.id === action.todoListID ? {...tl, entityStatus: action.entityStatus} : tl)
//         }
//         default:
//             return state
//     }
// }
//
// export const removeTodoListAC = (todoListID: string) => {
//     return {
//         type: 'REMOVE-TODOLIST',
//         todoListID
//
//     } as const
// }
// export const addTodoListAC = (todoList: TodoListType) => {
//     return {
//         type: 'ADD-TODOLIST',
//         todoList,
//     } as const
// }
// export const changeTodoListTitleAC = (todoListID: string, newTitle: string) => {
//     return {
//         type: 'CHANGE-TODOLIST-TITLE',
//         todoListID,
//         newTitle
//
//     } as const
// }
// export const filterAC = (todoListID: string, filter: FilterType) => {
//     return {
//         type: 'FILTER',
//         todoListID,
//         filter,
//
//     } as const
// }
// export const setTodoListsAC = (todoLists: TodoListType[]) => {
//     return {
//         type: 'SET-TODOLISTS',
//         todoLists,
//     } as const
// }
// export const changeTodolistEntityStatusAC = (todoListID: string, entityStatus: RequestStatusType) => {
//     return {
//         type: 'CHANGE-TODOLIST-ENTITY-STATUS',
//         todoListID,
//         entityStatus
//     } as const
// }




