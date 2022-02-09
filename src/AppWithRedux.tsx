import React, {useReducer, useState} from 'react';
import './App.css';
import TodoList from "./TodoList";
import {v1, validate} from "uuid";
import AddItemForm from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    AddTodolistAC,
    ChangeTodoListFilterAC,
    ChangeTodoListTitleAT,
    RemoveTodolistAC,
    todolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";

 export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type FilterValuesType = "all" | "active" | "completed"

export type TodolistType = {
     id: string
     title: string
     filter: FilterValuesType
 }

 export type TasksStateType = {
     [key: string]: Array<TaskType>
 }


function AppWithReducers() {
  //BLL

    const todoListID_1 = v1()
    const todolistID_2 = v1()
    const [todoLists, dispatchToTodoLists ] = useReducer(todolistsReducer,[
        {id: todoListID_1, title: "What to learn", filter: "all"},
        {id: todolistID_2, title: "What to buy", filter: "all"},

    ])
    const [tasks, dispatchToTasks] = useReducer(tasksReducer,{
        [todoListID_1] : [
            {id: v1(), title:"HTML", isDone: true},
            {id: v1(), title:"CSS", isDone: true},
            {id: v1(), title:"JavaScript", isDone: false},
            {id: v1(), title:"React", isDone: false},
            {id: v1(), title:"Redux", isDone: false},
        ],

        [todolistID_2] : [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "Meat", isDone: true},
            {id: v1(), title: "Water", isDone: true},
            {id: v1(), title: "Bread", isDone: true},

        ]
    })



    function changeTodoListFilter(value: FilterValuesType, todoListID: string) {
        let action = ChangeTodoListFilterAC(value, todoListID)
        dispatchToTodoLists(action)
    }
    function changeTodoListTitle(id: string, title: string) {
        let action = ChangeTodoListTitleAT(id, title )
        dispatchToTodoLists(action)

    }
    function removeTodolist(id: string) {
        let action = RemoveTodolistAC(id)
        dispatchToTasks(action)
        dispatchToTodoLists(action)

    }
    function addTodoList(title: string){
        let action = AddTodolistAC(title)
        dispatchToTasks(action)
        dispatchToTodoLists(action)
    }



    function removeTask(id: string, todoListID: string) {
        let action = removeTaskAC(id, todoListID)
       dispatchToTasks(action)
}
    function addTask(title: string, todoListID: string) {
        let action = addTaskAC(title, todoListID )
        dispatchToTasks(action)
      }

    function changeTaskStatus(taskID: string, isDone: boolean, todoListID: string) {
        let action = changeTaskStatusAC(taskID, isDone,  todoListID)
        dispatchToTasks(action)
  }
    function changeTaskTitle(taskID: string, title: string, todoListID: string) {
        let action = changeTaskTitleAC(taskID, title, todoListID)
        dispatchToTasks(action)
    }

   // UI:
   function getFilteredTasks (todoList: TodolistType) {
       switch (todoList.filter) {
           case "active":
               return tasks[todoList.id].filter(t => t.isDone === false)
           case "completed":
               return tasks[todoList.id].filter(t => t.isDone === true)
           default:
               return tasks[todoList.id]
       }

   }

   const todoListComponents = todoLists.map(tl => {
       return(
           <Grid item key={tl.id}>
           <Paper elevation={5} style={{padding: '20px'}}>
           <TodoList
               todoListID={tl.id}
               title={tl.title}
               tasks={getFilteredTasks(tl)}
               filter={tl.filter}
               changeTodoListFilter={changeTodoListFilter}
               addTask={addTask}
               removeTask={removeTask}
               changeTaskStatus={changeTaskStatus}
               changeTaskTitle={changeTaskTitle}
               removeTodolist={removeTodolist}
               changeTodoListTitle={changeTodoListTitle}
           />
           </Paper>
           </Grid>
       )
   }
   )
    return (
    <div className="App">
        <AppBar position={"static"}>
            <Toolbar style={{justifyContent: "space-between"}}>
                <IconButton color={"inherit"}>
                    <Menu/>
                </IconButton>
                <Typography variant={"h6"}>
                    TodoLists
                </Typography>
                <Button
                    color={"inherit"}
                    variant={"outlined"}
                    >Login</Button>
            </Toolbar>
        </AppBar>
        <Container fixed>
            <Grid container style={{padding: "20px 0px"}}>
        <AddItemForm addItem={addTodoList}/>
            </Grid>
            <Grid container spacing={5}>
        {todoListComponents}
            </Grid>
    </Container>
    </div>
  );
}

export default AppWithReducers;
