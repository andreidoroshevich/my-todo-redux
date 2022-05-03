import React from 'react';
import {TaskType} from "../App";
import Button from "./Button";
import './Main.css';
import {EditableSpan} from "./EditableSpan";

type TaskListType = {
    todoListID: string
    tasks: Array<TaskType>
    removeTask: (id: string, todoListID: string) => void
    changeTaskStatus: (todoListID: string, taskID: string, isDone: boolean) => void
    changeTaskTitle: (taskID: string, newTitle: string, todoListID: string) => void
}

const TaskList = (props: TaskListType) => {

    const onClickRemoveHandler = (id: string, todoListId: string) => {
        props.removeTask(id, todoListId)
    }

    const onChangeCheckBoxHandler = (todoListId: string, id: string, isDone: boolean) => {
        props.changeTaskStatus(todoListId, id, isDone)
    }

    const onChangeTitleHandler = (id: string, newValue: string, todoListId: string) => {
        props.changeTaskTitle(id, newValue, todoListId)
    }


    return (
        <div className={'main'}>
            <div className={'tasklist'}>
                <ul>
                    {props.tasks.map(t =>
                        <div className={'flex'} key={t.id}>
                            <div className={'task'}>
                                <li className={t.isDone ? 'is-done' : ''}>
                                    <input type="checkbox"
                                           onChange={(e) => onChangeCheckBoxHandler(props.todoListID, t.id, e.currentTarget.checked)}
                                           checked={t.isDone}/>
                                    <EditableSpan
                                        title={t.title}
                                        onChange={(newValue) => onChangeTitleHandler(t.id, newValue, props.todoListID)}/>
                                </li>

                            </div>
                            <div className={'del_button'}>
                                <Button
                                callBack={() => onClickRemoveHandler(t.id, props.todoListID)}
                                title={'x'}/></div>
                        </div>
                    )}
                </ul>
            </div>

        </div>
    );
};


export default TaskList;