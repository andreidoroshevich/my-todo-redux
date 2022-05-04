import React, {useState} from 'react';
import './App.css';
import TodoList from "./components/TodoList";
import Input from "./components/Input";
import {addTaskAC, changeStatusTaskAC, changeTitleTaskAC, removeTaskAC,} from "./reducers/TasksReducer";
import {addTodoListAC, changeTodoListTitleAC, filterAC, removeTodoListAC,} from "./reducers/TodoListsReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store/store";
import {AddBox} from "@material-ui/icons";
import {IconButton} from "@material-ui/core";
import UnchangeableHeader from "./components/UnchangeableHeader";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type FilterType = 'All' | 'Completed' | 'Active' //типизация для сортировки
export type TodoListType = {
    id: string
    title: string
    filter: FilterType
}

export type TaskObjectType = {
    [key: string]: TaskType[]
}


function App() {

    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>(null)

    const dispatch = useDispatch()
    const todoLists = useSelector<AppRootStateType, Array<TodoListType>>(state => state.todoList)
    const tasks = useSelector<AppRootStateType, TaskObjectType>(state => state.tasks)

//функция удаления таски
    const removeTask = (taskID: string, todoListId: string) => {
        dispatch(removeTaskAC(todoListId, taskID))
    }

// функции для сортировки
    const changeFilter = (value: FilterType, todoListID: string) => {
        dispatch(filterAC(value, todoListID))
    }

//функция добавления новых таск
    const addTask = (title: string, todoListID: string) => {
        dispatch(addTaskAC(todoListID, title))
    }

// функция изменения статуса таски - работа с чекбоксами
    const changeTaskStatus = (todoListID: string, taskID: string, isDoneValue: boolean) => {
        dispatch(changeStatusTaskAC(todoListID, taskID, isDoneValue))
    }

// функция изменения названия таски
    const changeTaskTitle = (taskID: string, newTitle: string, todoListID: string) => {
        dispatch(changeTitleTaskAC(todoListID, taskID, newTitle))
    }

//функция удаления todoList
    const removeTodoList = (todoListID: string) => {
        const action = removeTodoListAC(todoListID)
        dispatch(action)
    }

// функция добавления тудулиста
    const addTodolist = (title: string) => {
        const action = addTodoListAC(title);
        if (title.trim() !== '') {
            dispatch(action)
            setTitle('')
        } else {
            setError('Title is required')
        }
    }

// функция редактирования названия тудулиста
    const changeTodoListTitle = (todoListID: string, newTitle: string) => {
        dispatch(changeTodoListTitleAC(todoListID, newTitle))
    }


    return (
        <>
            <div className={"newTodo"}>
                <UnchangeableHeader title={"Add new Todolist"}/>

                <Input setError={setError} setTitle={setTitle} title={title} addTaskButtonHandler={addTodolist}
                       className={error ? 'error' : ''}/>

                <IconButton color="primary" onClick={() => addTodolist(title)}>
                    <AddBox/>
                </IconButton>
                {error && <div className={'error-message'}>Field is required</div>}
            </div>

            <div className={'flex-row'}>

                {todoLists.map((tl) => {
                    let FilteredTasks = tasks[tl.id]
                    if (tl.filter === "Completed") {
                        FilteredTasks = tasks[tl.id].filter(t => t.isDone)
                    }
                    if (tl.filter === "Active") {
                        FilteredTasks = tasks[tl.id].filter(t => !t.isDone)
                    }


                    return (

                        <TodoList
                            key={tl.id}
                            id={tl.id}
                            title={tl.title}
                            tasks={FilteredTasks}
                            removeTask={removeTask}
                            changeFilter={changeFilter}
                            addTask={addTask}
                            changeTaskStatus={changeTaskStatus}
                            removeTodoList={removeTodoList}
                            changeTaskTitle={changeTaskTitle}
                            changeTodoListTitle={changeTodoListTitle}
                            filter={tl.filter}
                        />
                    )
                })
                }
            </div>
        </>
    );
}

export default App;
