import React from 'react';
import '../../styles/style.css';
import {Task} from "./Task";
import {TaskStatuses, TaskType} from "../../api/todolist-api";
import {FilterType} from "../../reducers/TodoListsReducer";
import {RequestStatusType} from "../../reducers/AppReducer";


type TaskListType = {
    todoListID: string
    tasks: Array<TaskType>
    filter: FilterType
    entityStatus: RequestStatusType
    removeTask: (id: string, todoListID: string) => void
    changeTaskStatus: (todoListID: string, taskID: string, status: TaskStatuses) => void
    changeTaskTitle: (taskID: string, newTitle: string, todoListID: string) => void
}

const TaskList = React.memo((props: TaskListType) => {

    let tasksForTodolist = props.tasks
    if (props.filter === "Completed") {
        tasksForTodolist = tasksForTodolist.filter(t => t.status===TaskStatuses.Completed)
    }
    if (props.filter === "Active") {
        tasksForTodolist = tasksForTodolist.filter(t => t.status===TaskStatuses.New)
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
                        entityStatus={props.entityStatus}
                    />
                )}
                </tbody>
            </table>
        </div>
    );
});


export default TaskList;


