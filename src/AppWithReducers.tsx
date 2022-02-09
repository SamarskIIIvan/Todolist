import React, {useState} from 'react';
import './App.css';
import TodoList from "./TodoList";
import {v1, validate} from "uuid";
import AddItemForm from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";

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


function App() {
  //BLL

    const todoListID_1 = v1()
    const todolistID_2 = v1()
    const [todoLists, setTodoLists ] = useState<Array<TodolistType>>([
        {id: todoListID_1, title: "What to learn", filter: "all"},
        {id: todolistID_2, title: "What to buy", filter: "all"},

    ])
    const [tasks, setTasks] = useState<TasksStateType>({
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



    function changeTodoListFilter(filter: FilterValuesType, todoListID: string) {
        setTodoLists(todoLists.map(tl => tl.id === todoListID ? {...tl, filter: filter} : tl))
    }
    function changeTodoListTitle(title: string, todoListID: string) {
        setTodoLists(todoLists.map(tl => tl.id === todoListID ? {...tl, title: title} : tl))
    }
    function removeTodolist(todoListID: string) {
        setTodoLists(todoLists.filter(tl => tl.id !== todoListID))
        const copyTasks = {...tasks}
        delete copyTasks[todoListID]

    }
    function addTodoList(title: string){
        const newTodolistID = v1()
        const newTodolist: TodolistType = {
            id: newTodolistID,
            title,
            filter: "all"
        }
        setTodoLists([...todoLists, newTodolist])
        setTasks({...tasks, [newTodolistID]: []})
    }



    function removeTask(taskId: string, todoListID: string) {
        let todoListTasks = tasks[todoListID]
    tasks[todoListID] = tasks[todoListID].filter(t => t.id !== taskId)
    setTasks({...tasks})
}
    function addTask(title: string, todoListID: string) {
      const newTask: TaskType ={
          id: v1(),
          title,
          isDone: false
      }

      setTasks({...tasks, [todoListID]: [newTask, ...tasks[todoListID]]})
  }
    function changeTaskStatus(taskID: string, isDone: boolean, todoListID: string) {
       const copyTasks = {...tasks}
        copyTasks[todoListID] = copyTasks[todoListID].map(t => t.id === taskID ? {...t, isDone} :t)
        setTasks(copyTasks)
  }
    function changeTaskTitle(taskID: string, title: string, todoListID: string) {
        const copyTasks = {...tasks}
        copyTasks[todoListID] = tasks[todoListID].map(t => t.id === taskID ? {...t, title} :t)
        setTasks(copyTasks)
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

export default App;
