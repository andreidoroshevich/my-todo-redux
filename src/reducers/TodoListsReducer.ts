import {FilterType, TodoListType} from "../App";
import {v1} from "uuid";

const initialState: Array<TodoListType> = []


export type ActionType = removeTodoListACType | addTodoListACType | changeTodoListTitleACType | filterACType

export const TodoListsReducer = (state: Array<TodoListType> = initialState, action: ActionType): Array<TodoListType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST": {
            return state.filter(tl => tl.id !== action.todoListID)
        }
        case "ADD-TODOLIST": {
            let NewTodolist = {
                id: action.todoListID,
                filter: 'All' as FilterType,
                title: action.title
            }

            return [
                NewTodolist, ...state
            ]
        }
        case "CHANGE-TODOLIST-TITLE": {
            return state.map(tl => tl.id === action.todoListID ? {...tl, title: action.newTitle} : tl)
        }
        case "FILTER": {
            return state.map(el => el.id === action.todoListID ? {...el, filter: action.value} : el)

        }
        default:
            return state
    }
}

export type removeTodoListACType = ReturnType<typeof removeTodoListAC>
export const removeTodoListAC = (todoListID: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        todoListID: todoListID

    } as const
}

export type addTodoListACType = ReturnType<typeof addTodoListAC>
export const addTodoListAC = (title: string) => {
    return {
        type: 'ADD-TODOLIST',
        title: title,
        todoListID: v1()
    } as const
}

export type changeTodoListTitleACType = ReturnType<typeof changeTodoListTitleAC>
export const changeTodoListTitleAC = (todoListID: string, newTitle: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        todoListID: todoListID,
        newTitle: newTitle

    } as const
}

type filterACType = ReturnType<typeof filterAC>
export const filterAC = (value: FilterType, todoListID: string) => {
    return {
        type: 'FILTER',
        value: value,
        todoListID: todoListID,

    } as const
}


