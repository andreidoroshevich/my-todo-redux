import React, {useState} from 'react';
import {Task} from "../components/Task";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";

export default {
    title: 'Task',
    component: Task,
    argsTypes: {
        task: {
            description: "task object {id:'', isDone: true/false, title: ''}"
        },
        todoListID: {
            description: "todoListID"
        },
        removeTask: {
            description: "callback removeTask"
        },
        changeTaskStatus: {
            description: 'callback changeTaskStatus'
        },
        changeTaskTitle: {
            description: 'callback changeTaskTitle'
        }
    },
    args: {
        removeTask: action('removeTask'),
        changeTaskStatus: action('changeTaskStatus'),
        changeTaskTitle: action('changeTaskTitle'),
    }
} as ComponentMeta<typeof Task>

const Template: ComponentStory<typeof Task> = () => {
    const [task, setTask] = useState(
        {
        id: '1111',
        status: TaskStatuses.Completed,
        title: 'React TS',
        todoListId: "1111",
        order: 0,
        description: '',
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        addedDate: ''
        }
    )
    const changeTaskStatus = ()=>setTask(
        {
            id: '1111',
            status: TaskStatuses.New,
            title: 'React TS',
            todoListId: "1111",
            order: 0,
            description: '',
            priority: TaskPriorities.Low,
            startDate: '',
            deadline: '',
            addedDate: ''
        }
    )
    return <Task todoListID={'1'}
                 removeTask={action('removeTask')}
                 changeTaskStatus={changeTaskStatus}
                 changeTaskTitle={action('changeTaskTitle')}
                 task={task}
    />
}

// export const TaskIsDoneStory = Template.bind({})
// TaskIsDoneStory.args = {
//     task: {id: '1111', isDone: true, title: 'React TS'},
//     todoListID: 'qee-1',
// }
//
// export const TaskIsNotDoneStory = Template.bind({})
// TaskIsNotDoneStory.args = {
//     task: {id: '2222', isDone: false, title: 'React TS'},
//     todoListID: 'qqq-1',
// }

export const TaskChangeIsDoneStory = Template.bind({})
TaskChangeIsDoneStory.args = {}

