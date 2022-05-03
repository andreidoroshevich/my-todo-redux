import {v1} from "uuid";
import {FilterType, TodoListType} from "../App";
import {TodoListsReducer} from "./TodoListsReducer";

test("add new todolist", ()=>{
    let todoListId1 = v1()
    let todoListId2 = v1()
    let todoListId3 = v1()

    let newTodoListTitle = "NewTodoList"
    const startState: Array<TodoListType> = [
        {id: todoListId1, title: "What to learn", filter: "All"},
        {id: todoListId2, title: "What to buy", filter: "All"},
    ]
    const endState = TodoListsReducer(startState, {type: "ADD-TODOLIST", title: newTodoListTitle, todoListID: todoListId3 })
    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(newTodoListTitle)
    expect(endState[0].filter).toBe("All")
})

test("correct todolist should remove", ()=>{
    let todoListId1 = v1()
    let todoListId2 = v1()

    const startState: Array<TodoListType> = [
        {id: todoListId1, title: "What to learn", filter: "All"},
        {id: todoListId2, title: "What to buy", filter: "All"},
    ]
    const endState = TodoListsReducer(startState, {type: "REMOVE-TODOLIST", todoListID: todoListId1})
    console.log(endState)
    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todoListId2)
    expect(endState[0].filter).toBe("All")
})

test("correct todolist should change title", ()=>{
    let todoListId1 = v1()
    let todoListId2 = v1()
    let newTodoListTitle = "NewTodoList"

    const startState: Array<TodoListType> = [
        {id: todoListId1, title: "What to learn", filter: "All"},
        {id: todoListId2, title: "What to buy", filter: "All"},
    ]
    const endState = TodoListsReducer(startState, {type: "CHANGE-TODOLIST-TITLE", todoListID: todoListId2, newTitle: newTodoListTitle})
    expect(endState.length).toBe(2)
    expect(endState[1].id).toBe(todoListId2)
    expect(endState[1].title).toBe(newTodoListTitle)

})

test("correct todolist should change filter", ()=>{
    let todoListId1 = v1()
    let todoListId2 = v1()
    let newTodoListFilter : FilterType = "Completed"

    const startState: Array<TodoListType> = [
        {id: todoListId1, title: "What to learn", filter: "All"},
        {id: todoListId2, title: "What to buy", filter: "All"},
    ]
    const endState = TodoListsReducer(startState, {type: "FILTER", value: newTodoListFilter, todoListID: todoListId2})
    expect(endState.length).toBe(2)
    expect(endState[1].id).toBe(todoListId2)
    expect(endState[1].filter).toBe(newTodoListFilter)

})

