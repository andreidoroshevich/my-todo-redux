import {TodoListAPI, TodoListType} from "../api/todolist-api";
import {AppActionsType, AppRootStateType, AppThunkType} from "../store/store";


const initialState: Array<TodoListDomainType> = []


export type TodoListsActionType = removeTodoListACType
    | addTodoListACType
    | changeTodoListTitleACType
    | filterACType
    | setTodoListsType

export const TodoListsReducer = (state = initialState, action: AppActionsType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST": {
            return state.filter(tl => tl.id !== action.todoListID)
        }
        case "ADD-TODOLIST": {
            let NewTodolist: TodoListDomainType = {...action.todoList, filter: "All"}

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
                return {...tl, filter: "All"}
            })
        }
        default:
            return state
    }
}

export type removeTodoListACType = ReturnType<typeof removeTodoListAC>
export type addTodoListACType = ReturnType<typeof addTodoListAC>
export type changeTodoListTitleACType = ReturnType<typeof changeTodoListTitleAC>
type filterACType = ReturnType<typeof filterAC>
export type setTodoListsType = ReturnType<typeof setTodoListsAC>

export type FilterType = 'All' | 'Completed' | 'Active' //типизация для сортировки
export type TodoListDomainType = TodoListType & { filter: FilterType }


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

export const fetchTodoListsTC = (): AppThunkType => {
    return (dispatch) => {
        TodoListAPI.getTodoLists()
            .then((res) => {
                dispatch(setTodoListsAC(res))
            })
    }
}

export const deleteTodoListTC = (todoListID: string): AppThunkType => {
    return (dispatch) => {
        TodoListAPI.deleteTodoList(todoListID)
            .then((res) => {
                dispatch(removeTodoListAC(todoListID))
            })
    }
}

export const addTodoListTC = (title: string): AppThunkType => {
    return (dispatch) => {
        TodoListAPI.createTodoList(title)
            .then((res) => {
                dispatch(addTodoListAC(res.data.item))
            })
    }
}

export const updateTodoListTitleTC = (todolistId: string, title: string): AppThunkType => {
    return (dispatch,
            getState: () => AppRootStateType) => {
        TodoListAPI.updateTodoList(todolistId, title)
            .then((res) => {
                dispatch(changeTodoListTitleAC(todolistId, title))
            })
    }
}




