import {
    addTodoListAC,
    changeTodolistEntityStatusAC,
    removeTodoListAC,
    ResultCodeStatus,
    setTodoListsAC,
} from "./TodoListsReducer";
import {TasksAPI, TaskStatuses, TodoListType, UpdateTaskModelType} from "../api/todolist-api";
import {AppRootStateType} from "../store/store";
import {setAppErrorAC, setAppStatusAC} from "./AppReducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../common/utils/error-utils";
import {TaskObjectType} from "../components/todolist/TodoLists";
import {Dispatch} from "redux";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TaskObjectType = {}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks',
    async (todoListID: string, thunkAPI) => {
        const res = await TasksAPI.getTasks(todoListID)
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todoListID: todoListID, tasks: res.items}
    })

export const deleteTaskTC = createAsyncThunk('tasks/deleteTask', async (param: { todoListID: string, taskID: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    thunkAPI.dispatch(changeTodolistEntityStatusAC({todoListID: param.todoListID, entityStatus: 'loading'}))
    const res = await TasksAPI.deleteTask(param.todoListID, param.taskID)
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    thunkAPI.dispatch(changeTodolistEntityStatusAC({todoListID: param.todoListID, entityStatus: 'idle'}))
    return {todoListID: param.todoListID, taskID: param.taskID}
})

export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: { todoListId: string, title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await TasksAPI.createTask(param.todoListId, param.title)
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    return {task: res.data.item}

})


const slice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {
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
    },
    extraReducers: (builder) => {
        builder.addCase(addTodoListAC, (state, action) => {
            state[action.payload.todoList.id] = []
        })
        builder.addCase(removeTodoListAC, (state, action) => {
            delete state[action.payload.todoListID]
        })
        builder.addCase(setTodoListsAC, (state, action) => {
            action.payload.todoLists.forEach((tl: TodoListType) => {
                state[tl.id] = []
            })
        })
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            state[action.payload.todoListID] = action.payload.tasks
        })
        builder.addCase(deleteTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todoListID]
            const index = tasks.findIndex(t => t.id === action.payload.taskID)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        })
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        })

    }
})

export const TasksReducer = slice.reducer
export const {changeStatusTaskAC, changeTitleTaskAC} = slice.actions

export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses) => {

    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
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



