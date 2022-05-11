import React from 'react';
import {FilterType, TaskType} from "../App";
import './Main.css';
import {Task} from "./Task";


type TaskListType = {
    todoListID: string
    tasks: Array<TaskType>
    filter: FilterType
    removeTask: (id: string, todoListID: string) => void
    changeTaskStatus: (todoListID: string, taskID: string, isDone: boolean) => void
    changeTaskTitle: (taskID: string, newTitle: string, todoListID: string) => void
}

const TaskList = React.memo((props: TaskListType) => {

    let tasksForTodolist = props.tasks
    if (props.filter === "Completed") {
        tasksForTodolist = tasksForTodolist.filter(t => t.isDone)
    }
    if (props.filter === "Active") {
        tasksForTodolist = tasksForTodolist.filter(t => !t.isDone)
    }

    return (
        <div className={'main'}>
            <table>
                <tbody>
                {tasksForTodolist.map(t => <Task
                        task={t}
                        removeTask={props.removeTask}
                        changeTaskStatus={props.changeTaskStatus}
                        changeTaskTitle={props.changeTaskTitle}
                        todoListID={props.todoListID}
                        key={t.id}
                    />
                )}
                </tbody>
            </table>
        </div>
    );
});


export default TaskList;


