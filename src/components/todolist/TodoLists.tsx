import React, {useCallback, useEffect, useState} from 'react';
import '../../styles/App.css';
import TodoList from "../../components/todolist/TodoList";
import {
    addTodoListTC,
    fetchTodoListsTC,
    filterAC,
    FilterType,
    removeTodoListTC,
    TodoListDomainType,
    updateTodoListTitleTC,
} from "../../reducers/TodoListsReducer";
import AddBox from "@material-ui/icons/AddBox";
import IconButton from "@material-ui/core/IconButton";
import {AppRootStateType, useAppDispatch, useAppSelector} from "../../store/store";
import {RequestStatusType} from "../../reducers/AppReducer";
import {addTaskTC, deleteTaskTC, updateTaskStatusTC, updateTaskTitleTC} from "../../reducers/TasksReducer";
import {TaskStatuses, TaskType} from "../../api/todolist-api";
import {ErrorSnackbar} from "../../common/components/ErrorSnackBar";
import UnchangeableHeader from "../headers/UnchangeableHeader";
import LinearProgress from "@mui/material/LinearProgress";
import {Input} from "../../common/components/Input";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import {logoutTC} from "../../reducers/AuthReducer";

export type TaskObjectType = {
    [key: string]: TaskType[]
}

function TodoLists() {

    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>(null)

    const dispatch = useAppDispatch();
    const todoLists = useAppSelector<Array<TodoListDomainType>>(state => state.todoList)
    const tasks = useAppSelector<TaskObjectType>(state => state.tasks)
    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const navigate = useNavigate()


    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchTodoListsTC())
        } else {
            navigate('login')
        }
    }, [isLoggedIn])

//функция удаления таски
    const removeTask = useCallback((taskID: string, todoListID: string) => {
        dispatch(deleteTaskTC({todoListID, taskID}))
    }, [dispatch])

// функции для сортировки
    const changeFilter = useCallback((todoListId: string, filter: FilterType) => {
        dispatch(filterAC({todoListID: todoListId, filter:filter}))
    }, [dispatch])

//функция добавления новых таск
    const addTask = useCallback((title: string, todoListId: string) => {
        dispatch(addTaskTC({todoListId, title}))
    }, [dispatch])

// функция изменения статуса таски - работа с чекбоксами
    const changeTaskStatus = useCallback((todoListID: string, taskID: string, status: TaskStatuses) => {

        dispatch(updateTaskStatusTC(todoListID, taskID, status))
    }, [dispatch])

// функция изменения названия таски
    const changeTaskTitle = useCallback((taskID: string, newTitle: string, todoListID: string) => {

        dispatch(updateTaskTitleTC(todoListID, taskID, newTitle))

    }, [dispatch])

//функция удаления todoList
    const removeTodoList = useCallback((todoListID: string) => {
        // const action = deleteTodoListTC(todoListID)

        dispatch(removeTodoListTC(todoListID))
    }, [dispatch])

// функция добавления тудулиста
    const addTodolist = useCallback((title: string) => {
        if (title.trim() !== '') {
            dispatch(addTodoListTC(title))
            setTitle('')
        } else {
            setError('Title is required')
        }
    }, [dispatch])

// функция редактирования названия тудулиста
    const changeTodoListTitle = useCallback((todoListID: string, newTitle: string) => {
        dispatch(updateTodoListTitleTC(todoListID, newTitle))
    }, [dispatch])

    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    return (
        <>
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>

                    {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Logout</Button>}

                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>

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
                            entityStatus={tl.entityStatus}
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

export default TodoLists;
