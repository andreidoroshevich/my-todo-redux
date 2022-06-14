import axios, {AxiosResponse} from 'axios'

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

export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}

type GetTaskResponse = {
    items: TaskType[]
    totalCount: number
    error: string | null
}

export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}

export type MeResponseType = {
    id: number,
    email: string,
    login: string
}

export type LoginParamsType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: boolean
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


export const TodoListAPI = {
    updateTodoList: (todolistId: string, title: string) => {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title})
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
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
            .then((res) => {
                return res.data
            })
    },
    createTodoList: (title: string) => {
        return instance.post<ResponseType<{ item: TodoListType }>>('todo-lists', {title})
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
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, {title})
            .then((res) => {
                return res.data
            })
    },
    updateTask: (todolistId: string, taskId: string, model: UpdateTaskModelType) => {
        return instance.put<UpdateTaskModelType, AxiosResponse<ResponseType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
            .then((res) => {
                return res.data
            })
    },
    deleteTask: (todolistId: string, taskId: string) => {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
            .then((res) => {
                return res.data
            })
    },
}

export const authAPI = {
    login: (data: LoginParamsType) => {
        return instance.post<LoginParamsType, AxiosResponse<ResponseType<{ userId: number }>>>('auth/login', data)
            .then((res) => {
                return res.data
            })
    },
    me: () => {
        return instance.get<ResponseType<MeResponseType>>('auth/me')
            .then((res) => {
                return res.data
            })
    },
    logout: () => {
        return instance.delete<ResponseType>('auth/login')
            .then((res) => {
                return res.data
            })
    },
}