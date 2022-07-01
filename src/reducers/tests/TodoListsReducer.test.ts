import {v1} from "uuid";
import {
    addTodoListTC,
    fetchTodoListsTC,
    filterAC,
    FilterType,
    removeTodoListTC,
    TodoListDomainType,
    TodoListsReducer,
    updateTodoListTitleTC
} from "../TodoListsReducer";

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

    const payload = {
        todoList: {
            title: "NewTodoList",
            id: "some new id",
            order: 0,
            addedDate: ""
        }
    }
    const action = addTodoListTC.fulfilled(payload,'',{title:payload.todoList.title})
    const endState = TodoListsReducer(startState, action)

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(payload.todoList.title)
    expect(endState[0].filter).toBe("All")
})

test("correct todolist should remove", ()=>{
    const param = {todoListID: todoListId1}
    const action = removeTodoListTC.fulfilled(param,'', param)
    const endState = TodoListsReducer(startState, action)

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todoListId2)
    expect(endState[0].filter).toBe("All")
})

test("correct todolist should change title", ()=>{

    const newTodoListTitle = "NewTodoList"
    const param={todoListID: todoListId2, newTitle: newTodoListTitle}
    const action = updateTodoListTitleTC.fulfilled(param,'',param)
    const endState = TodoListsReducer(startState, action)

    expect(endState.length).toBe(2)
    expect(endState[1].id).toBe(todoListId2)
    expect(endState[1].title).toBe(newTodoListTitle)
})

test("correct todolist should change filter", ()=>{

    const newTodoListFilter : FilterType = "Completed"
    const action = filterAC({todoListID:todoListId2, filter: newTodoListFilter})
    const endState = TodoListsReducer(startState, action)

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
    const action = fetchTodoListsTC.fulfilled({todoLists:startState}, '')
    const endState = TodoListsReducer([], action)

    expect(endState.length).toBe(2)
})


