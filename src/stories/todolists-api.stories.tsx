import React, {useEffect, useState} from 'react'
import {TasksAPI, TodoListAPI} from "../api/todolist-api";

export default {
    title: 'API'
}

export const GetTodoLists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        TodoListAPI.getTodoLists()
            .then((data) => setState(data))
    }, [])
    return <div> {JSON.stringify(state)}</div>
}

export const CreateTodoList = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const title='My new todoList'
        TodoListAPI.createTodoList(title)
            .then((data) => setState(data))
    }, [])
    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTodoList = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'e08ee27e-39de-4b41-be46-b4a942df8101'
        TodoListAPI.deleteTodoList(todolistId)
            .then((data) => setState(data))
    }, [])
    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTodoListTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todoListId = '32b32cf3-4628-4bc8-8182-e8c5a3f23f64'
        const title = "My second new todoList"
        TodoListAPI.updateTodoList(todoListId, title)
            .then((res) => res.data)
            .then((data) => setState(data))
    }, [])
    return <div> {JSON.stringify(state)}</div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '84d74c97-4333-4fd3-8ee3-04c04cb455ea'
        TasksAPI.getTasks(todolistId)
            .then((data) => setState(data))
    }, [])
    return <div> {JSON.stringify(state)}</div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '84d74c97-4333-4fd3-8ee3-04c04cb455ea'
        const title = "MY new task"
        TasksAPI.createTask(todolistId, title)
            .then((data) => setState(data))
    }, [])
    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '84d74c97-4333-4fd3-8ee3-04c04cb455ea'
        const title = "My edited task"
        const taskId = '8aec9932-406c-4899-a136-cd3e1c76aa72'
        TasksAPI.updateTask(todolistId, taskId, title)
            .then((data) => setState(data))
    }, [])
    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '84d74c97-4333-4fd3-8ee3-04c04cb455ea'
        const taskId = '0a12e309-1d25-4b00-8cb4-6e57a798f2c5'
        TasksAPI.deleteTask(todolistId, taskId)
            .then((data) => setState(data))
    }, [])
    return <div> {JSON.stringify(state)}</div>
}