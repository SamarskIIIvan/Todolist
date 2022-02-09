import React, {ChangeEvent, useCallback} from 'react';
import {EditableSpan} from "../EditableSpan";
import {Button, Checkbox, IconButton} from '@material-ui/core';
import {TaskType} from "../Todolist";
import {Delete} from "@material-ui/icons";

type  TaskPropsType = {
    todolistId: string
    task: TaskType
    removeTask: (taskId: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export  const Task = React.memo((props: TaskPropsType) => {

    console.log('Task change')

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        let newIsDoneValue = e.currentTarget.checked;
        props.changeTaskStatus(props.task.id, newIsDoneValue, props.todolistId);
    }
    
    const onTitleChangeHandler = useCallback((newValue: string) => {
        props.changeTaskTitle(props.task.id, newValue, props.todolistId);
    }, [props.changeTaskTitle, props.todolistId, props.task.id])
    
    function onClickHandler() {
        props.removeTask(props.task.id, props.todolistId)
    }
    
    return (
        <div key={props.task.id} className={props.task.isDone ? "is-done" : ""}>
            <Checkbox
                checked={props.task.isDone}
                color="primary"
                onChange={onChangeHandler}
            />

            <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} />
            <IconButton onClick={onClickHandler}>
                <Delete />
            </IconButton>
        </div>
    )
})