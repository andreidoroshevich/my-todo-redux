import {v1} from "uuid";
import {TodoListType} from "../api/todolist-api";


const initialState: Array<TodoListDomainType> = []


export type ActionType = removeTodoListACType | addTodoListACType | changeTodoListTitleACType | filterACType

export const TodoListsReducer = (state: Array<TodoListDomainType> = initialState, action: ActionType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST": {
            return state.filter(tl => tl.id !== action.todoListID)
        }
        case "ADD-TODOLIST": {
            let NewTodolist = {
                id: action.todoListID,
                filter: 'All' as FilterType,
                title: action.title,
                addedDate: '',
                order: 0
            }

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
export const filterAC = (todoListID: string, filter: FilterType) => {
    return {
        type: 'FILTER',
        todoListID: todoListID,
        filter: filter,

    } as const
}

export type FilterType = 'All' | 'Completed' | 'Active' //типизация для сортировки
export type TodoListDomainType = TodoListType & {filter: FilterType}