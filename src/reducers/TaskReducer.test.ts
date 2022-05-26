import {v1} from "uuid";
import {TaskObjectType} from "../App";
import {TasksReducer} from "./TasksReducer";
import {removeTodoListAC} from "./TodoListsReducer";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";

let todoListId1 = v1()
let todoListId2 = v1()
let taskId1 = v1()
let taskId2 = v1()
let taskId3 = v1()

test("task should add", () => {

    const startState: TaskObjectType = {
        [todoListId1]: [
            {
                id: taskId1,
                title: "HTML&CSS",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId2,
                title: "JS/ES6",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId3,
                title: "React",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
        ],
        [todoListId2]: [
            {
                id: taskId1,
                title: "Milk",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId2,
                title: "Sugar",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId3,
                title: "Book",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
        ],
    }
    let newTitle = "Redux"

    const endState = TasksReducer(startState, {type: "ADD-TASK", todoListID: todoListId1, title: newTitle})
    expect(endState[todoListId1][0].title).toBe(newTitle)
    expect(endState[todoListId1].length).toBe(4)
    expect(endState[todoListId2].length).toBe(3)
    expect(endState[todoListId1][0].id).toBeDefined()
    expect(endState[todoListId1][0].status).toBe(TaskStatuses.New)
})

test("correct task should remove", () => {
    const startState: TaskObjectType = {
        [todoListId1]: [
            {
                id: taskId1,
                title: "HTML&CSS",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId2,
                title: "JS/ES6",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId3,
                title: "React",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
        ],
        [todoListId2]: [
            {
                id: taskId1,
                title: "Milk",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId2,
                title: "Sugar",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId3,
                title: "Book",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
        ],
    }
    const endState = TasksReducer(startState, {type: "REMOVE-TASK", todoListID: todoListId1, taskID: taskId2})
    expect(endState).toEqual({
        [todoListId1]: [
            {
                id: taskId1,
                title: "HTML&CSS",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId3,
                title: "React",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
        ],
        [todoListId2]: [
            {
                id: taskId1,
                title: "Milk",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId2,
                title: "Sugar",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId3,
                title: "Book",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
        ],
    })
})

test("correct task should change status", () => {

    const startState: TaskObjectType = {
        [todoListId1]: [
            {
                id: taskId1,
                title: "HTML&CSS",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId2,
                title: "JS/ES6",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId3,
                title: "React",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
        ],
        [todoListId2]: [
            {
                id: taskId1,
                title: "Milk",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId2,
                title: "Sugar",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId3,
                title: "Book",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
        ],
    }
    let newStatus = TaskStatuses.New

    const endState = TasksReducer(startState, {
        type: "CHANGE-TASK-STATUS",
        todoListID: todoListId1,
        taskID: taskId2,
        status: newStatus
    })
    expect(endState[todoListId1][1].status).toBe(newStatus)
})

test("correct task should change it's title", () => {

    const startState: TaskObjectType = {
        [todoListId1]: [
            {
                id: taskId1,
                title: "HTML&CSS",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId2,
                title: "JS/ES6",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId3,
                title: "React",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
        ],
        [todoListId2]: [
            {
                id: taskId1,
                title: "Milk",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId2,
                title: "Sugar",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId3,
                title: "Book",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
        ],
    }
    let newTaskTitle = "RestAPI"

    const endState = TasksReducer(startState, {
        type: "CHANGE-TASK-TITLE",
        todoListID: todoListId1,
        taskID: taskId2,
        newTitle: newTaskTitle
    })
    expect(endState[todoListId1][1].title).toBe(newTaskTitle)
})

test('property with todolistId should be deleted', () => {
    const startState: TaskObjectType = {
        [todoListId1]: [
            {
                id: taskId1,
                title: "HTML&CSS",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId2,
                title: "JS/ES6",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId3,
                title: "React",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
        ],
        [todoListId2]: [
            {
                id: taskId1,
                title: "Milk",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId2,
                title: "Sugar",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: taskId3,
                title: "Book",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
        ],
    };
    const action = removeTodoListAC("todolistId2");
    const endState = TasksReducer(startState, action)
    expect(endState["todolistId2"]).not.toBeDefined();
});