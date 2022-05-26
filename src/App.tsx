import React, {useCallback, useState} from 'react';
import './App.css';
import TodoList from "./components/TodoList";
import {Input} from "./components/Input";
import {addTaskAC, changeStatusTaskAC, changeTitleTaskAC, removeTaskAC,} from "./reducers/TasksReducer";
import {
    addTodoListAC,
    changeTodoListTitleAC,
    filterAC, FilterType,
    removeTodoListAC,
    TodoListDomainType,
} from "./reducers/TodoListsReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store/store";
import {AddBox} from "@material-ui/icons";
import {IconButton} from "@material-ui/core";
import UnchangeableHeader from "./components/UnchangeableHeader";
import {TaskStatuses, TaskType} from "./api/todolist-api";



export type TaskObjectType = {
    [key: string]: TaskType[]
}


function App() {

    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>(null)

    const dispatch = useDispatch()
    const todoLists = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todoList)
    const tasks = useSelector<AppRootStateType, TaskObjectType>(state => state.tasks)

//функция удаления таски
    const removeTask = useCallback((taskID: string, todoListId: string) => {
        dispatch(removeTaskAC(todoListId, taskID))
    },[dispatch])

// функции для сортировки
    const changeFilter = useCallback((todoListId: string, filter: FilterType) => {
        dispatch(filterAC(todoListId, filter))
    },[dispatch])

//функция добавления новых таск
    const addTask = useCallback((title: string, todoListID: string) => {
        dispatch(addTaskAC(todoListID, title))
    },[dispatch])

// функция изменения статуса таски - работа с чекбоксами
    const changeTaskStatus = useCallback((todoListID: string, taskID: string, status: TaskStatuses) => {
        dispatch(changeStatusTaskAC(todoListID, taskID, status))
    },[dispatch])

// функция изменения названия таски
    const changeTaskTitle = useCallback((taskID: string, newTitle: string, todoListID: string) => {
        dispatch(changeTitleTaskAC(todoListID, taskID, newTitle))
    },[dispatch])

//функция удаления todoList
    const removeTodoList = useCallback((todoListID: string) => {
        const action = removeTodoListAC(todoListID)
        dispatch(action)
    },[dispatch])

// функция добавления тудулиста
    const addTodolist = useCallback((title: string) => {
        const action = addTodoListAC(title);
        if (title.trim() !== '') {
            dispatch(action)
            setTitle('')
        } else {
            setError('Title is required')
        }
    },[dispatch])

// функция редактирования названия тудулиста
    const changeTodoListTitle = useCallback((todoListID: string, newTitle: string) => {
        dispatch(changeTodoListTitleAC(todoListID, newTitle))
    },[dispatch])


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
                    return (

                        <TodoList
                            key={tl.id}
                            id={tl.id}
                            title={tl.title}
                            tasks={tasks[tl.id]}
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
