import {TodoListAPI, TodoListType} from "../api/todolist-api";
import {RequestStatusType, setAppStatusAC} from "./AppReducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../common/utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

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


export const fetchTodoListsTC = createAsyncThunk('todoLists/fetchTodoLists', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await TodoListAPI.getTodoLists()
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todoLists: res}
    } catch (error) {
        handleServerNetworkError(thunkAPI.dispatch, (error as AxiosError).message)
        return thunkAPI.rejectWithValue({})
    }
})

export const removeTodoListTC = createAsyncThunk('todoLists/removeTodoList', async (param: { todoListID: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    thunkAPI.dispatch(changeTodolistEntityStatusAC({todoListID: param.todoListID, entityStatus: 'loading'}))
    try {
        const res = await TodoListAPI.deleteTodoList(param.todoListID)
        if (res.resultCode === ResultCodeStatus.success) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todoListID: param.todoListID}
        } else {
            handleServerAppError(thunkAPI.dispatch, res)
        }
    } catch (error) {
        handleServerNetworkError(thunkAPI.dispatch, (error as AxiosError).message)
        return thunkAPI.rejectWithValue({})
    }
})

export const addTodoListTC = createAsyncThunk('todoLists/addTodoList', async (param: { title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await TodoListAPI.createTodoList(param.title)
        if (res.resultCode === ResultCodeStatus.success) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todoList: res.data.item}
        } else {
            handleServerAppError(thunkAPI.dispatch, res)
            return thunkAPI.rejectWithValue({})
        }
    } catch (error) {
        handleServerNetworkError(thunkAPI.dispatch, (error as AxiosError).message)
        return thunkAPI.rejectWithValue({})
    }
})

export const updateTodoListTitleTC = createAsyncThunk('todoLists/changeTodoListTitle', async (param: { todoListID: string, newTitle: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await TodoListAPI.updateTodoList(param.todoListID, param.newTitle)
        if (res.resultCode === ResultCodeStatus.success) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todoListID: param.todoListID, newTitle: param.newTitle}
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
    name: "todolist",
    initialState: initialState,
    reducers: {
        filterAC: (state, action: PayloadAction<{ todoListID: string, filter: FilterType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoListID)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{ todoListID: string, entityStatus: RequestStatusType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoListID)
            state[index].entityStatus = action.payload.entityStatus
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchTodoListsTC.fulfilled, (state, action) => {
            return action.payload.todoLists.map(tl => ({...tl, filter: "All", entityStatus: 'idle'}))
        })
        builder.addCase(removeTodoListTC.fulfilled, (state, action) => {
            // @ts-ignore
            const index = state.findIndex(tl => tl.id === action.payload.todoListID)
            if (index > -1) {
                state.splice(index, 1)
            }
        })
            builder.addCase(addTodoListTC.fulfilled, (state, action) => {
                state.unshift({...action.payload.todoList, filter: "All", entityStatus: 'idle'})
            })
            builder.addCase(updateTodoListTitleTC.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.todoListID)
                state[index].title = action.payload.newTitle
            })
    }
})

export const TodoListsReducer = slice.reducer
export const {
    filterAC,
    changeTodolistEntityStatusAC,
} = slice.actions

export type changeTodolistEntityStatusType = ReturnType<typeof changeTodolistEntityStatusAC>

