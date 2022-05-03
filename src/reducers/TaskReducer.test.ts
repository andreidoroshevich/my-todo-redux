import {v1} from "uuid";
import {TaskObjectType} from "../App";
import {TasksReducer} from "./TasksReducer";
import {removeTodoListAC} from "./TodoListsReducer";

let todoListId1 = v1()
let todoListId2 = v1()
let taskId1 = v1()
let taskId2 = v1()
let taskId3 = v1()

test("task should add", ()=> {

    const startState: TaskObjectType = {
        [todoListId1]: [
            {id: taskId1, title: "HTML&CSS", isDone: true},
            {id: taskId2, title: "JS/ES6", isDone: true},
            {id: taskId3, title: "React", isDone: false},],
        [todoListId2]: [
            {id: taskId1, title: "Milk", isDone: true},
            {id: taskId2, title: "Sugar", isDone: true},
            {id: taskId3, title: "Book", isDone: false},],
    }
    let newTitle = "Redux"

    const endState = TasksReducer(startState, {type: "ADD-TASK", todoListID: todoListId1, title: newTitle})
    expect(endState[todoListId1][0].title).toBe(newTitle)
    expect(endState[todoListId1].length).toBe(4)
    expect(endState[todoListId2].length).toBe(3)
    expect(endState[todoListId1][0].id).toBeDefined()
    expect(endState[todoListId1][0].isDone).toBe(false)
})

test("correct task should remove", ()=>{
    const startState: TaskObjectType = {
        [todoListId1]: [
            {id: taskId1, title: "HTML&CSS", isDone: true},
            {id: taskId2, title: "JS/ES6", isDone: true},
            {id: taskId3, title: "React", isDone: false},],
        [todoListId2]: [
            {id: taskId1, title: "Milk", isDone: true},
            {id: taskId2, title: "Sugar", isDone: true},
            {id: taskId3, title: "Book", isDone: false},],
    }
    const endState = TasksReducer(startState, {type: "REMOVE-TASK", todoListID: todoListId1, taskID: taskId2})
    expect(endState).toEqual({
        [todoListId1]: [
            {id: taskId1, title: "HTML&CSS", isDone: true},
            {id: taskId3, title: "React", isDone: false},],
        [todoListId2]: [
            {id: taskId1, title: "Milk", isDone: true},
            {id: taskId2, title: "Sugar", isDone: true},
            {id: taskId3, title: "Book", isDone: false},],
    })
})

test("correct task should change status", ()=> {

    const startState: TaskObjectType = {
        [todoListId1]: [
            {id: taskId1, title: "HTML&CSS", isDone: true},
            {id: taskId2, title: "JS/ES6", isDone: true},
            {id: taskId3, title: "React", isDone: false},],
        [todoListId2]: [
            {id: taskId1, title: "Milk", isDone: true},
            {id: taskId2, title: "Sugar", isDone: true},
            {id: taskId3, title: "Book", isDone: false},],
    }
    let newIsDoneValue = false

    const endState = TasksReducer(startState, {type: "CHANGE-TASK-STATUS", todoListID: todoListId1, taskID: taskId2, isDoneValue: newIsDoneValue})
    expect(endState[todoListId1][1].isDone).toBe(newIsDoneValue)
})

test("correct task should change it's title", ()=> {

    const startState: TaskObjectType = {
        [todoListId1]: [
            {id: taskId1, title: "HTML&CSS", isDone: true},
            {id: taskId2, title: "JS/ES6", isDone: true},
            {id: taskId3, title: "React", isDone: false},],
        [todoListId2]: [
            {id: taskId1, title: "Milk", isDone: true},
            {id: taskId2, title: "Sugar", isDone: true},
            {id: taskId3, title: "Book", isDone: false},],
    }
    let newTaskTitle = "RestAPI"

    const endState = TasksReducer(startState, {type: "CHANGE-TASK-TITLE", todoListID: todoListId1, taskID: taskId2, newTitle: newTaskTitle})
    expect(endState[todoListId1][1].title).toBe(newTaskTitle)
})

test('property with todolistId should be deleted', () => {
    const startState: TaskObjectType = {
        "todolistId1": [
            { id: "1", title: "CSS", isDone: false },
            { id: "2", title: "JS", isDone: true },
            { id: "3", title: "React", isDone: false }
        ],
        "todolistId2": [
            { id: "1", title: "bread", isDone: false },
            { id: "2", title: "milk", isDone: true },
            { id: "3", title: "tea", isDone: false }
        ]
    };
    const action = removeTodoListAC("todolistId2");
    const endState = TasksReducer(startState, action)
    const keys = Object.keys(endState);
    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});