import axios from 'axios'

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        'API-KEY': '777d961a-f9a7-4dc0-b651-7f2e8df99fbe'
    },
})

export type TodoListType = {
    id: string
    addedDate: string
    order: number
    title: string
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3,
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4

}

export type TaskType = {
    id: string
    title: string
    status: TaskStatuses
    description: string
    todoListId: string
    order: number
    priority: TaskPriorities
    startDate: string
    deadline: string
    addedDate: string
}

type GetTaskResponse = {
    item: TaskType[]
    totalCount: number
    error: string | null
}

type CommonResponseType<T> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: T
}


export const TodoListAPI = {
    updateTodoList: (todolistId: string, title: string) => {
        return instance.put<CommonResponseType<{}>>(`todo-lists/${todolistId}`, {title: title})
            .then((res) => {
                return res.data
            })
    },
    getTodoLists: () => {
        return instance.get<TodoListType[]>(`todo-lists`)
            .then((res) => {
                return res.data
            })
    },
    deleteTodoList: (todolistId: string) => {
        return instance.delete<CommonResponseType<{}>>(`todo-lists/${todolistId}`)
            .then((res) => {
                return res.data
            })
    },
    createTodoList: (title: string) => {
        return instance.post<CommonResponseType<{ item: TodoListType }>>('todo-lists', {title})
            .then((res) => {
                return res.data
            })
    },
}

export const TasksAPI = {
    getTasks: (todolistId: string) => {
        return instance.get<GetTaskResponse>(`todo-lists/${todolistId}/tasks`)
            .then((res) => {
                return res.data
            })
    },
    createTask: (todolistId: string, title: string) => {
        return instance.post<CommonResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, {title})
            .then((res) => {
                return res.data
            })
    },
    updateTask: (todolistId: string, taskId: string, title: string) => {
        return instance.put<CommonResponseType<{}>>(`todo-lists/${todolistId}/tasks/${taskId}`, {title})
            .then((res) => {
                return res.data
            })
    },
    deleteTask: (todolistId: string, taskId: string) => {
        return instance.delete<CommonResponseType<{}>>(`todo-lists/${todolistId}/tasks/${taskId}`)
            .then((res) => {
                return res.data
            })
    },

}