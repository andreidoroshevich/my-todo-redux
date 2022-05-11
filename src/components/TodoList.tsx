import React, {useCallback, useState} from 'react';
import Header from "./Header";
import TaskList from "./TaskList";
import {FilterType, TaskType} from "../App";
import {Input} from "./Input";
import '../App.css'
import {Button, IconButton} from "@material-ui/core";
import {AddBox, Delete} from "@material-ui/icons";


type ToDoListType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (id: string, todoListID: string) => void
    changeFilter: (todoListID: string, filter: FilterType) => void
    addTask: (title: string, todoListID: string) => void
    changeTaskStatus: (todoListID: string, taskID: string, isDone: boolean) => void
    removeTodoList: (todoListID: string) => void
    changeTaskTitle: (taskID: string, newTitle: string, todoListID: string) => void
    changeTodoListTitle: (todoListID: string, newTitle: string) => void
    filter: FilterType
}

const TodoList =React.memo( (props: ToDoListType) => {

    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>(null)


    const addTaskButtonHandler = useCallback((title: string) => {
            if (title.trim() !== '') {
                props.addTask(title.trim(), props.id)
                setTitle('')
            } else {
                setError('Title is required')
            }
        }, [props.addTask, props.id])

    const removeTodoListHandler = () => {
        props.removeTodoList(props.id)
    }

    const onAllClickHandler = useCallback(() => props.changeFilter(props.id,"All"),[props.changeFilter, props.id]);
    const onActiveClickHandler = useCallback(() => props.changeFilter(props.id,"Active"),[props.changeFilter, props.id]);
    const onCompletedClickHandler = useCallback(() => props.changeFilter(props.id,"Completed"),[props.changeFilter, props.id]);



    return (
        <div className="App">
            <div>
                <span className={'delTodoList'}>
                    <IconButton onClick={removeTodoListHandler}>
                            <Delete/>
                        </IconButton></span>

                {/*<Button callBack={removeTodoListHandler} title={'x'}/>*/}
                <Header id={props.id} title={props.title} changeTodoListTitle={props.changeTodoListTitle}/>
                <div>
                    <Input setError={setError} setTitle={setTitle} title={title}
                           addTaskButtonHandler={addTaskButtonHandler} className={error ? 'error' : ''}/>
                    <IconButton color="primary" onClick={() => addTaskButtonHandler(title)}>
                        <AddBox/>
                    </IconButton>
                    {error && <div className={'error-message'}>Field is required</div>}

                    <TaskList tasks={props.tasks} removeTask={props.removeTask}
                              changeTaskStatus={props.changeTaskStatus} todoListID={props.id}
                              changeTaskTitle={props.changeTaskTitle}
                              filter={props.filter}
                    />
                    <div className={'filterButton'}>

                        <Button variant={props.filter === 'All' ? 'outlined' : 'text'}
                                onClick={onAllClickHandler}
                                color={'default'}
                        >All
                        </Button>
                        <Button variant={props.filter === 'Active' ? 'outlined' : 'text'}
                                onClick={onActiveClickHandler}
                                color={'primary'}>Active
                        </Button>
                        <Button variant={props.filter === 'Completed' ? 'outlined' : 'text'}
                                onClick={onCompletedClickHandler}
                                color={'secondary'}>Completed
                        </Button>


                        {/*<Button className={props.filter === 'All' ? 'active-filter' : ''} callBack={() => props.changeFilter('All', props.id)} title={'All'}/>*/}
                        {/*<Button className={props.filter === 'Active' ? 'active-filter' : ''} callBack={() => props.changeFilter('Active', props.id)} title={'Active'}/>*/}
                        {/*<Button className={props.filter === 'Completed' ? 'active-filter' : ''} callBack={() => props.changeFilter('Completed', props.id)} title={'Completed'}/>*/}

                    </div>


                </div>
            </div>
        </div>
    );
});

export default TodoList;