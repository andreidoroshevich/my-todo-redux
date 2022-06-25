import {addTodoListAC, TodoListDomainType, TodoListsReducer} from "../TodoListsReducer";
import {TasksReducer} from "../TasksReducer";
import {TaskPriorities, TaskStatuses} from "../../api/todolist-api";
import {TaskObjectType} from "../../components/todolist/TodoLists";


test('new array should be added when new todolist is added', () => {
    const startState: TaskObjectType = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
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
                id: "2",
                title: "JS",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            { id: "3",
                title: "React",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todolistId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            }
        ],
        "todolistId2": [
            { id: "1",
                title: "bread",
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
                id: "2",
                title: "milk",
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
                id: "3",
                title: "tea",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todolistId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            }
        ]
    };
    const action =  addTodoListAC({todoList: {
            id:"158284255258525558",
            title: "new todoList",
            order: 0,
            addedDate: ''
        }});
    const endState = TasksReducer(startState, action)
    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== "todolistId1" && k !== "todolistId2");

    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('ids should be equals', () => {

    const startTasksState: TaskObjectType = {};
    const startTodoListsState:  Array<TodoListDomainType> = [];
    const action = addTodoListAC({todoList: {
            id:"158284255258525558",
            title: "new todoList",
            order: 0,
            addedDate: ''
        }});
    const endTasksState = TasksReducer(startTasksState, action)
    const endTodoListsState = TodoListsReducer(startTodoListsState, action)
    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;

    expect(idFromTasks).toBe(action.payload.todoList.id);
    expect(idFromTodoLists).toBe(action.payload.todoList.id);
});
