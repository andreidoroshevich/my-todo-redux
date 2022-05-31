import React, {ChangeEvent, useCallback} from "react";
import {EditableSpan} from "../../common/components/EditableSpan";
import {Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "../../api/todolist-api";

type TaskPropsType = {
    todoListID: string
    removeTask: (id: string, todoListID: string) => void
    changeTaskStatus: (todoListID: string, taskID: string, status: TaskStatuses) => void
    changeTaskTitle: (taskID: string, newTitle: string, todoListID: string) => void
    task: TaskType
}

export const Task = React.memo((props: TaskPropsType) => {
    const onClickRemoveHandler = useCallback(() => {
        props.removeTask(props.task.id, props.todoListID)
    }, [props.removeTask])


    const onChangeCheckBoxHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(props.todoListID, props.task.id, e.currentTarget.checked
            ? TaskStatuses.Completed
            : TaskStatuses.New)
    }, [props.changeTaskStatus])

    const onChangeTitleHandler = useCallback((newValue: string) => {
        props.changeTaskTitle(props.task.id, newValue, props.todoListID)
    }, [props.changeTaskTitle, props.todoListID, props.task.id])

        return (
        <tr className={'tdCheckbox'} key={props.task.id}>
            <td className={'tdCheckbox'}>

                <Checkbox
                    checked={props.task.status === TaskStatuses.Completed}
                    color="primary"
                    onChange={onChangeCheckBoxHandler}
                />
            </td>
            <td className={'tdTask'}><EditableSpan
                title={props.task.title}
                onChange={onChangeTitleHandler}/>
            </td>
            <td className={'tdButton'}>
                <IconButton aria-label="delete"
                            onClick={onClickRemoveHandler}>
                    <Delete/>
                </IconButton>
            </td>
        </tr>
    )
})