import {
    addTodoListACType, changeTodolistEntityStatusAC,
    removeTodoListACType,
    ResultCodeStatus,
    setTodoListsType
} from "./TodoListsReducer";
import {TasksAPI, TaskStatuses, TaskType, UpdateTaskModelType} from "../api/todolist-api";
import {AppRootStateType, AppThunkType} from "../store/store";
import {AppActionsType, RequestStatusType, setAppErrorAC, setAppStatusAC} from "./AppReducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../common/utils/error-utils";
import {TaskObjectType} from "../components/todolist/TodoLists";

export type TasksActionType = removeTaskACType
    | addTaskACType
    | changeStatusTaskACType
    | changeTitleTaskACType
    | addTodoListACType
    | removeTodoListACType
    | setTodoListsType
    | setTasksACType
    | AppActionsType


const initialState: TaskObjectType = {}

export const TasksReducer = (state = initialState, action: TasksActionType): TaskObjectType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            return {
                ...state, [action.todoListID]: state[action.todoListID].filter(t => t.id !== action.taskID)
            }
        }
        case "ADD-TASK": {
            const newTask = action.task
            return {
                ...state, [newTask.todoListId]: [newTask, ...state[newTask.todoListId]]
            }
        }
        case "CHANGE-TASK-STATUS" : {
            return {
                ...state,
                [action.todoListID]: state[action.todoListID].map(el => el.id === action.taskID ? {
                    ...el,
                    status: action.status
                } : el)
            }
        }
        case "CHANGE-TASK-TITLE" : {
            return {
                ...state,
                [action.todoListID]: state[action.todoListID].map(el => el.id === action.taskID ? {
                    ...el,
                    title: action.newTitle
                } : el)
            }
        }
        case "ADD-TODOLIST" : {
            return {
                ...state, [action.todoList.id]: []
            }
        }
        case "REMOVE-TODOLIST" : {
            const stateCopy = {...state}
            delete stateCopy[action.todoListID]
            return stateCopy
        }
        case "SET-TODOLISTS" : {
            const copyState = {...state}
            action.todoLists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case "SET-TASKS" : {
            const copyState = {...state}
            copyState[action.todoListID] = action.tasks
            return copyState
        }

        default:
            return state
    }
}

type removeTaskACType = ReturnType<typeof removeTaskAC>
type addTaskACType = ReturnType<typeof addTaskAC>
type changeStatusTaskACType = ReturnType<typeof changeStatusTaskAC>
type changeTitleTaskACType = ReturnType<typeof changeTitleTaskAC>
type setTasksACType = ReturnType<typeof setTasksAC>

export const removeTaskAC = (todoListID: string, taskID: string) => {
    return {
        type: 'REMOVE-TASK',
        taskID,
        todoListID,
    } as const
}
export const addTaskAC = (task: TaskType) => {
    return {
        type: 'ADD-TASK',
        task
    } as const
}
export const changeStatusTaskAC = (todoListID: string, taskID: string, status: TaskStatuses) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        todoListID,
        taskID,
        status
    } as const
}
export const changeTitleTaskAC = (todoListID: string, taskID: string, newTitle: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        todoListID,
        taskID,
        newTitle
    } as const
}
export const setTasksAC = (todoListID: string, tasks: TaskType[]) => {
    return {
        type: 'SET-TASKS',
        todoListID,
        tasks
    } as const
}
export const changeTaskEntityStatusAC = (todoListID: string, taskID: string, entityTaskStatus: RequestStatusType) => {
    return {
        type: 'CHANGE-TASK-ENTITY-STATUS',
        todoListID,
        taskID,
        entityTaskStatus
    } as const
}


export const fetchTasksTC = (todoListID: string): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await TasksAPI.getTasks(todoListID)
        dispatch(setTasksAC(todoListID, res.items))
        dispatch(setAppStatusAC('succeeded'))
    } catch (error) {
        handleServerNetworkError(dispatch, (error as AxiosError).message)
    }
}
export const deleteTaskTC = (todoListID: string, taskID: string): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todoListID, 'loading'))
    try {
        const res = await TasksAPI.deleteTask(todoListID, taskID)
        if (res.resultCode === ResultCodeStatus.success) {
            dispatch(removeTaskAC(todoListID, taskID))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(dispatch, res)
        }
    } catch (error) {
        handleServerNetworkError(dispatch, (error as AxiosError).message)
    }
    finally
    {
        dispatch(changeTodolistEntityStatusAC(todoListID, 'idle'))
    }
}
export const addTaskTC = (todoListId: string, title: string): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await TasksAPI.createTask(todoListId, title)
        if (res.resultCode === ResultCodeStatus.success) {
            dispatch(addTaskAC(res.data.item))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(dispatch, res)
        }
    } catch (error) {
        handleServerNetworkError(dispatch, (error as AxiosError).message)
    }
}
export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses): AppThunkType => {

    return (dispatch,
            getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC('loading'))

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
                        dispatch(setAppStatusAC('loading'))
                        if (res.resultCode === ResultCodeStatus.success) {
                            dispatch(changeStatusTaskAC(todolistId, taskId, status))
                            dispatch(setAppStatusAC('succeeded'))
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
export const updateTaskTitleTC = (todolistId: string, taskId: string, title: string): AppThunkType => {
    return (dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC('loading'))

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
                            dispatch(changeTitleTaskAC(todolistId, taskId, title))
                            dispatch(setAppStatusAC('succeeded'))
                        } else {
                            handleServerAppError(dispatch, res)
                        }
                    }).catch((error: AxiosError) => {
                    dispatch(setAppErrorAC(error.message))
                    dispatch(setAppStatusAC('failed'))
                })
            } catch (error) {
                handleServerNetworkError(dispatch, (error as AxiosError).message)
            }
        }
    }
}



