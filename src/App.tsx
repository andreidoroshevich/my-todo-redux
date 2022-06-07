import React, {useCallback, useEffect, useState} from 'react';
import './styles/App.css';
import TodoList from "./components/todolist/TodoList";
import {Input} from "./common/components/Input";
import {addTaskTC, deleteTaskTC, updateTaskStatusTC, updateTaskTitleTC,} from "./reducers/TasksReducer";
import {
    addTodoListTC,
    fetchTodoListsTC,
    filterAC,
    FilterType, removeTodoListTC,
    TodoListDomainType,
    updateTodoListTitleTC,
} from "./reducers/TodoListsReducer";
import {useAppDispatch, useAppSelector} from "./store/store";
import AddBox from "@material-ui/icons/AddBox";
import IconButton from "@material-ui/core/IconButton";
import UnchangeableHeader from "./components/headers/UnchangeableHeader";
import {TaskStatuses, TaskType} from "./api/todolist-api";
import LinearProgress from "@mui/material/LinearProgress";
import {RequestStatusType} from "./reducers/AppReducer";
import {ErrorSnackbar} from "./common/components/ErrorSnackBar";

export type TaskObjectType = {
    [key: string]: TaskType[]
}

function App() {

    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>(null)

    const dispatch = useAppDispatch();
    const todoLists = useAppSelector<Array<TodoListDomainType>>(state => state.todoList)
    const tasks = useAppSelector<TaskObjectType>(state => state.tasks)
    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    console.log(status)

    useEffect(() => {
        dispatch(fetchTodoListsTC())
    }, [])

//функция удаления таски
    const removeTask = useCallback((taskID: string, todoListId: string) => {
        dispatch(deleteTaskTC(todoListId, taskID))
    }, [dispatch])

// функции для сортировки
    const changeFilter = useCallback((todoListId: string, filter: FilterType) => {
        dispatch(filterAC(todoListId, filter))
    }, [dispatch])

//функция добавления новых таск
    const addTask = useCallback((title: string, todoListID: string) => {
        dispatch(addTaskTC(todoListID, title))
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


    return (
        <>
            {status === 'loading' && <LinearProgress/> }
            <ErrorSnackbar/>

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

export default App;
