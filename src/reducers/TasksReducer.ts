import {
    addTodoListAC,
    changeTodolistEntityStatusAC,
    removeTodoListAC,
    ResultCodeStatus,
    setTodoListsAC,
} from "./TodoListsReducer";
import {TasksAPI, TaskStatuses, TaskType, TodoListType, UpdateTaskModelType} from "../api/todolist-api";
import {AppRootStateType} from "../store/store";
import {setAppErrorAC, setAppStatusAC} from "./AppReducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../common/utils/error-utils";
import {TaskObjectType} from "../components/todolist/TodoLists";
import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TaskObjectType = {}

const slice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {
        removeTaskAC: (state, action: PayloadAction<{ todoListID: string, taskID: string }>) => {
            const tasks = state[action.payload.todoListID]
            const index = tasks.findIndex(t => t.id === action.payload.taskID)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        },
        addTaskAC: (state, action: PayloadAction<{ task: TaskType }>) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        changeStatusTaskAC: (state, action: PayloadAction<{ todoListID: string, taskID: string, status: TaskStatuses }>) => {
            const tasks = state[action.payload.todoListID]
            const index = tasks.findIndex(t => t.id === action.payload.taskID)
            if (index > -1) {
                tasks[index].status = action.payload.status
            }

        },
        changeTitleTaskAC: (state, action: PayloadAction<{ todoListID: string, taskID: string, newTitle: string }>) => {
            const tasks = state[action.payload.todoListID]
            const index = tasks.findIndex(t => t.id === action.payload.taskID)
            if (index > -1) {
                tasks[index].title = action.payload.newTitle
            }

        },
        setTasksAC: (state, action: PayloadAction<{ todoListID: string, tasks: TaskType[] }>) => {
            state[action.payload.todoListID] = action.payload.tasks
        },
    },
    extraReducers: (builder)=>{
        builder.addCase(addTodoListAC, (state, action)=>{
            state[action.payload.todoList.id] = []
        })
        builder.addCase(removeTodoListAC, (state, action)=>{
            delete state[action.payload.todoListID]
        })
        builder.addCase(setTodoListsAC, (state, action)=>{

            action.payload.todoLists.forEach((tl: TodoListType) => {
                state[tl.id] = []
            })
        })
    }
})

export const TasksReducer = slice.reducer
export const {removeTaskAC, addTaskAC, changeStatusTaskAC, changeTitleTaskAC, setTasksAC} = slice.actions

export const fetchTasksTC = (todoListID: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await TasksAPI.getTasks(todoListID)
        dispatch(setTasksAC({todoListID: todoListID, tasks: res.items}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
    } catch (error) {
        handleServerNetworkError(dispatch, (error as AxiosError).message)
    }
}
export const deleteTaskTC = (todoListID: string, taskID: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({todoListID: todoListID, entityStatus: 'loading'}))
    try {
        const res = await TasksAPI.deleteTask(todoListID, taskID)
        if (res.resultCode === ResultCodeStatus.success) {
            dispatch(removeTaskAC({todoListID: todoListID, taskID: taskID}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(dispatch, res)
        }
    } catch (error) {
        handleServerNetworkError(dispatch, (error as AxiosError).message)
    } finally {
        dispatch(changeTodolistEntityStatusAC({todoListID: todoListID, entityStatus: 'idle'}))
    }
}
export const addTaskTC = (todoListId: string, title: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await TasksAPI.createTask(todoListId, title)
        if (res.resultCode === ResultCodeStatus.success) {
            dispatch(addTaskAC({task: res.data.item}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(dispatch, res)
        }
    } catch (error) {
        handleServerNetworkError(dispatch, (error as AxiosError).message)
    }
}
export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses) => {

    return (dispatch: Dispatch,
            getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC({status: 'loading'}))

        const currentTask = getState().tasks[todolistId].find(t => t.id === taskId)

        if (currentTask) {
            const model: UpdateTaskModelType = {
                title: currentTask.title,
                description: currentTask.description,
                priority: currentTask.priority,
                startDate: currentTask.startDate,
                deadline: currentTask.deadline,
                status,
            }
            try {
                TasksAPI.updateTask(todolistId, taskId, model)
                    .then((res) => {
                        dispatch(setAppStatusAC({status: 'loading'}))
                        if (res.resultCode === ResultCodeStatus.success) {
                            dispatch(changeStatusTaskAC({todoListID: todolistId, taskID: taskId, status: status}))
                            dispatch(setAppStatusAC({status: 'succeeded'}))
                        } else {
                            handleServerAppError(dispatch, res)
                        }
                    })
            } catch (error) {
                handleServerNetworkError(dispatch, (error as AxiosError).message)
            }
        }
    }
}
export const updateTaskTitleTC = (todolistId: string, taskId: string, title: string) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC({status: 'loading'}))

        const currentTask = getState().tasks[todolistId].find(t => t.id === taskId)

        if (currentTask) {
            const model: UpdateTaskModelType = {
                title,
                description: currentTask.description,
                priority: currentTask.priority,
                startDate: currentTask.startDate,
                deadline: currentTask.deadline,
                status: currentTask.status,
            }

            try {
                TasksAPI.updateTask(todolistId, taskId, model)
                    .then((res) => {
                        if (res.resultCode === ResultCodeStatus.success) {
                            dispatch(changeTitleTaskAC({todoListID: todolistId, taskID: taskId, newTitle: title}))
                            dispatch(setAppStatusAC({status: 'succeeded'}))
                        } else {
                            handleServerAppError(dispatch, res)
                        }
                    }).catch((error: AxiosError) => {
                    dispatch(setAppErrorAC({error: error.message}))
                    dispatch(setAppStatusAC({status: 'failed'}))
                })
            } catch (error) {
                handleServerNetworkError(dispatch, (error as AxiosError).message)
            }
        }
    }
}



