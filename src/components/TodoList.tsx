import React, {useState} from 'react';
import Header from "./Header";
import TaskList from "./TaskList";
import {FilterType, TaskType} from "../App";
import Button from "./Button";
import Input from "./Input";
import '../App.css'

type ToDoListType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (id: string, todoListID: string) => void
    changeFilter: (filter: FilterType, todoListID: string) => void
    addTask: (title: string, todoListID: string) => void
    changeTaskStatus: (todoListID: string, taskID: string, isDone: boolean) => void
    removeTodoList: (todoListID: string)=>void
    changeTaskTitle: (taskID: string, newTitle: string, todoListID: string) => void
    changeTodoListTitle: (todoListID: string, newTitle: string)=>void
    filter: string
}

const TodoList = (props: ToDoListType) => {

    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>(null)


    const addTaskButtonHandler = (title: string) => {
        if (title.trim() !== '') {
            props.addTask(title.trim(), props.id)
            setTitle('')
        } else {
            setError('Title is required')
        }
    }

    const removeTodoListHandler = ()=>{
        props.removeTodoList(props.id)
    }

    return (
        <div className="App">
            <div>
                <span className={'delTodoList'}><Button callBack={removeTodoListHandler} title={'x'}/></span>
                <Header id={props.id} title={props.title} changeTodoListTitle={props.changeTodoListTitle}/>
                <div>
                    <Input setError={setError} setTitle={setTitle} title={title} addTaskButtonHandler={addTaskButtonHandler} className={error ? 'error' : ''}/>
                    <Button className={'addbutton'} callBack={() => addTaskButtonHandler(title)} title={'+'}/>
                    {error &&<div className={'error-message'}>Field is required</div>}

                    <TaskList tasks={props.tasks} removeTask={props.removeTask}
                              changeTaskStatus={props.changeTaskStatus} todoListID={props.id}
                              changeTaskTitle={props.changeTaskTitle}
                    />
                    <div className={'filterbutton'}>

                        <Button className={props.filter === 'All' ? 'active-filter' : ''} callBack={() => props.changeFilter('All', props.id)} title={'All'}/>
                        <Button className={props.filter === 'Active' ? 'active-filter' : ''} callBack={() => props.changeFilter('Active', props.id)} title={'Active'}/>
                        <Button className={props.filter === 'Completed' ? 'active-filter' : ''} callBack={() => props.changeFilter('Completed', props.id)} title={'Completed'}/>

                    </div>


                </div>
            </div>
        </div>
    );
};

export default TodoList;