import React from 'react';
import {TaskType} from "../App";
import './Main.css';
import {EditableSpan} from "./EditableSpan";
import {IconButton} from "@material-ui/core";
import {Delete} from '@material-ui/icons';


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
            <table>
                {props.tasks.map(t =>
                    <tr className={'tdCheckbox'}>
                        <td className={'tdCheckbox'}>
                            <input type="checkbox"
                                   onChange={(e) => onChangeCheckBoxHandler(props.todoListID, t.id, e.currentTarget.checked)}
                                   checked={t.isDone}/>
                        </td>
                        <td className={'tdTask'}><EditableSpan
                            title={t.title}
                            onChange={(newValue) => onChangeTitleHandler(t.id, newValue, props.todoListID)}/>
                        </td>
                        <td className={'tdButton'}>
                            <IconButton aria-label="delete"
                                        onClick={() => onClickRemoveHandler(t.id, props.todoListID)}>
                                <Delete/>
                            </IconButton>
                        </td>
                    </tr>
                )}
            </table>
        </div>
    );
};


export default TaskList;