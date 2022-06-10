import {v1} from "uuid";
import {FilterType, setTodoListsAC, TodoListDomainType, TodoListsReducer} from "../TodoListsReducer";
import {TodoListType} from "../../api/todolist-api";


let todoListId1: string
let todoListId2: string
let startState: Array<TodoListDomainType>

beforeEach(()=>{
    todoListId1 = v1()
    todoListId2 = v1()
    startState= [
        {
            id: todoListId1,
            title: "What to learn",
            filter: "All",
            addedDate: '',
            order: 0,
            entityStatus: 'idle'
        },
        {
            id: todoListId2,
            title: "What to buy",
            filter: "All",
            addedDate: '',
            order: 0,
            entityStatus: 'idle'
        },
    ]
})


test("add new todolist", ()=>{

    const todoList: TodoListType = {
        title: "NewTodoList",
        id: "some new id",
        order: 0,
        addedDate: ""
    }
    const endState = TodoListsReducer(startState, {type: "ADD-TODOLIST", todoList})

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(todoList.title)
    expect(endState[0].filter).toBe("All")
})

test("correct todolist should remove", ()=>{

    const endState = TodoListsReducer(startState, {type: "REMOVE-TODOLIST", todoListID: todoListId1})

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todoListId2)
    expect(endState[0].filter).toBe("All")
})

test("correct todolist should change title", ()=>{

    const newTodoListTitle = "NewTodoList"
    const endState = TodoListsReducer(startState, {type: "CHANGE-TODOLIST-TITLE", todoListID: todoListId2, newTitle: newTodoListTitle})

    expect(endState.length).toBe(2)
    expect(endState[1].id).toBe(todoListId2)
    expect(endState[1].title).toBe(newTodoListTitle)
})

test("correct todolist should change filter", ()=>{

    const newTodoListFilter : FilterType = "Completed"
    const endState = TodoListsReducer(startState, {type: "FILTER", filter: newTodoListFilter, todoListID: todoListId2})

    expect(endState.length).toBe(2)
    expect(endState[1].id).toBe(todoListId2)
    expect(endState[1].filter).toBe(newTodoListFilter)

})

test("todoLists should be set to the state", ()=>{
    const startState: Array<TodoListDomainType> = [
        {
            id: todoListId1,
            title: "What to learn",
            filter: "All",
            addedDate: '',
            order: 0,
            entityStatus: 'idle'
        },
        {
            id: todoListId2,
            title: "What to buy",
            filter: "All",
            addedDate: '',
            order: 0,
            entityStatus: 'idle'
        },
    ]
    const action = setTodoListsAC(startState)
    const endState = TodoListsReducer([], action)

    expect(endState.length).toBe(2)
})


