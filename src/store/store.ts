import {combineReducers, legacy_createStore as createStore} from "redux";
import {TasksReducer} from "../reducers/TasksReducer";
import {TodoListsReducer} from "../reducers/TodoListsReducer";

let rootReducer = combineReducers({
    tasks: TasksReducer,
    todoList: TodoListsReducer
})

export const store = createStore(rootReducer)

export type AppRootStateType = ReturnType<typeof rootReducer>


// @ts-ignore
window.store = store