import {TaskObjectType} from "../App";
import {v1} from "uuid";
import {addTodoListACType, removeTodoListACType} from "./TodoListsReducer";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";

export type ActionType = removeTaskACType
    | addTaskACType
    | changeStatusTaskACType
    | changeTitleTaskACType
    | addTodoListACType
    | removeTodoListACType

const initialState: TaskObjectType = {}

export const TasksReducer = (state: TaskObjectType = initialState, action: ActionType): TaskObjectType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            return {
                ...state, [action.todoListID]: state[action.todoListID].filter(t => t.id !== action.taskID)
            }
        }
        case "ADD-TASK": {
            const newTask = {
                id: v1(),
                title: action.title,
                status: TaskStatuses.New,
                description: '',
                todoListId: action.todoListID,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            }
            return {
                ...state, [action.todoListID]: [newTask, ...state[action.todoListID]]
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
                ...state, [action.todoListID]: []
            }
        }
        case "REMOVE-TODOLIST" : {
            const stateCopy = {...state}
            delete stateCopy[action.todoListID]
            return stateCopy
        }
        default:
            return state
    }
}

type removeTaskACType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (todoListID: string, taskID: string) => {
    return {
        type: 'REMOVE-TASK',
        taskID: taskID,
        todoListID: todoListID,

    } as const
}

type addTaskACType = ReturnType<typeof addTaskAC>
export const addTaskAC = (todoListID: string, title: string) => {
    return {
        type: 'ADD-TASK',
        todoListID: todoListID,
        title: title
    } as const
}

type changeStatusTaskACType = ReturnType<typeof changeStatusTaskAC>
export const changeStatusTaskAC = (todoListID: string, taskID: string, status: TaskStatuses) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        todoListID: todoListID,
        taskID: taskID,
        status: status

    } as const
}

type changeTitleTaskACType = ReturnType<typeof changeTitleTaskAC>
export const changeTitleTaskAC = (todoListID: string, taskID: string, newTitle: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        todoListID: todoListID,
        taskID: taskID,
        newTitle: newTitle

    } as const
}