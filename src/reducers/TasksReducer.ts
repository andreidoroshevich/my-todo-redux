import {
    addTodoListTC,
    changeTodolistEntityStatusAC, fetchTodoListsTC, removeTodoListTC,
    ResultCodeStatus,
} from "./TodoListsReducer";
import {TasksAPI, TaskStatuses, TodoListType, UpdateTaskModelType} from "../api/todolist-api";
import {AppRootStateType} from "../store/store";
import {setAppErrorAC, setAppStatusAC} from "./AppReducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../common/utils/error-utils";
import {TaskObjectType} from "../components/todolist/TodoLists";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState: TaskObjectType = {}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todoListID: string, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        try {
            const res = await TasksAPI.getTasks(todoListID)
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todoListID: todoListID, tasks: res.items}
        } catch (error) {
            handleServerNetworkError(thunkAPI.dispatch, (error as AxiosError).message)
            return thunkAPI.rejectWithValue({})
        }
    })

export const deleteTaskTC = createAsyncThunk('tasks/deleteTask', async (param: { todoListID: string, taskID: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        thunkAPI.dispatch(changeTodolistEntityStatusAC({todoListID: param.todoListID, entityStatus: 'loading'}))
        await TasksAPI.deleteTask(param.todoListID, param.taskID);
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        thunkAPI.dispatch(changeTodolistEntityStatusAC({todoListID: param.todoListID, entityStatus: 'idle'}))
        return {todoListID: param.todoListID, taskID: param.taskID}
    } catch (error) {
        handleServerNetworkError(thunkAPI.dispatch, (error as AxiosError).message)
        return thunkAPI.rejectWithValue({})
    } finally {
        thunkAPI.dispatch(changeTodolistEntityStatusAC({todoListID: param.todoListID, entityStatus: 'idle'}))
    }
})

export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: { todoListId: string, title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await TasksAPI.createTask(param.todoListId, param.title)
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        return {task: res.data.item}
    } catch (error) {
        handleServerNetworkError(thunkAPI.dispatch, (error as AxiosError).message)
        return thunkAPI.rejectWithValue({})
    }
})

export const updateTaskStatusTC = createAsyncThunk('tasks/updateTaskStatusTC', async (param: { todoListID: string, taskID: string, status: TaskStatuses }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

    const state=thunkAPI.getState() as AppRootStateType
    const currentTask = state.tasks[param.todoListID].find(t => t.id === param.taskID)

    if (currentTask) {
        const model: UpdateTaskModelType = {
            title: currentTask.title,
            description: currentTask.description,
            priority: currentTask.priority,
            startDate: currentTask.startDate,
            deadline: currentTask.deadline,
            status: param.status
        }
        try {
            const res = await TasksAPI.updateTask(param.todoListID, param.taskID, model)
                    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
                    if (res.resultCode === ResultCodeStatus.success) {
                        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                        return {todoListID: param.todoListID, taskID: param.taskID, status: param.status}

                    } else {
                        handleServerAppError(thunkAPI.dispatch, res)
                        return thunkAPI.rejectWithValue({})
                    }
        } catch (error) {
            handleServerNetworkError(thunkAPI.dispatch, (error as AxiosError).message)
            return thunkAPI.rejectWithValue({})
        }
    }
})

export const updateTaskTitleTC = createAsyncThunk('tasks/updateTaskTitleTC', async (param: { todoListID: string, taskID: string, newTitle: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

    const state=thunkAPI.getState() as AppRootStateType
    const currentTask = state.tasks[param.todoListID].find(t => t.id === param.taskID)

    if (currentTask) {
        const model: UpdateTaskModelType = {
            title: param.newTitle,
            description: currentTask.description,
            priority: currentTask.priority,
            startDate: currentTask.startDate,
            deadline: currentTask.deadline,
            status: currentTask.status
        }
        try {
            const res = await TasksAPI.updateTask(param.todoListID, param.taskID, model)
            thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
            if (res.resultCode === ResultCodeStatus.success) {
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                return {todoListID: param.todoListID, taskID: param.taskID, newTitle: param.newTitle}

            } else {
                handleServerAppError(thunkAPI.dispatch, res)
                return thunkAPI.rejectWithValue({})
            }
        } catch (error) {
            thunkAPI.dispatch(setAppErrorAC({error: (error as AxiosError).message}))
            thunkAPI.dispatch(setAppStatusAC({status: 'failed'}))
            return thunkAPI.rejectWithValue({})

        }
    }
})

const slice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addTodoListTC.fulfilled, (state, action) => {
            state[action.payload.todoList.id] = []
        })
        builder.addCase(removeTodoListTC.fulfilled, (state, action) => {
            if (action.payload) {
                delete state[action.payload.todoListID]
            }
        })
        builder.addCase(fetchTodoListsTC.fulfilled, (state, action) => {
            action.payload.todoLists.forEach((tl: TodoListType) => {
                state[tl.id] = []
            })
        })
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            if (action.payload.todoListID) {
                state[action.payload.todoListID] = action.payload.tasks
            }
        })
        builder.addCase(deleteTaskTC.fulfilled, (state, action) => {
            if (action.payload) {
                const tasks = state[action.payload.todoListID]
                    // @ts-ignore
                const index = tasks.findIndex(t => t.id === action.payload.taskID)
                    if (index > -1) {
                        tasks.splice(index, 1)
                    }
            }
        })
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            if (action.payload) {
                state[action.payload.task.todoListId].unshift(action.payload.task)
            }
        })
        builder.addCase(updateTaskStatusTC.fulfilled, (state, action) => {
                // @ts-ignore
            const tasks = state[action.payload.todoListID]
                // @ts-ignore
                const index = tasks.findIndex(t => t.id === action.payload.taskID)
                if (index > -1) {
                    // @ts-ignore
                    tasks[index].status = action.payload.status
                }
        })
        builder.addCase(updateTaskTitleTC.fulfilled, (state, action) => {
            // @ts-ignore
            const tasks = state[action.payload.todoListID]
            // @ts-ignore
            const index = tasks.findIndex(t => t.id === action.payload.taskID)
            if (index > -1) {
                // @ts-ignore
                tasks[index].title = action.payload.newTitle
            }
        })
    }
})


export const TasksReducer = slice.reducer
