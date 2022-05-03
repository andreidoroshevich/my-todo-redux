import {TaskObjectType, TodoListType} from "../App";
import {addTodoListAC, TodoListsReducer} from "./TodoListsReducer";
import {TasksReducer} from "./TasksReducer";

test('new array should be added when new todolist is added', () => {
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
    const action =  addTodoListAC( "new todolist");
    const endState = TasksReducer(startState, action)
    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }
    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('ids should be equals', () => {
    const startTasksState: TaskObjectType = {};
    const startTodoListsState:  Array<TodoListType> = [];
    const action = addTodoListAC("new todolist");
    const endTasksState = TasksReducer(startTasksState, action)
    const endTodoListsState = TodoListsReducer(startTodoListsState, action)
    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;
    expect(idFromTasks).toBe(action.todoListID);
    expect(idFromTodoLists).toBe(action.todoListID);
});
