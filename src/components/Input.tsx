import React from 'react';
import {TextField} from "@material-ui/core";

type InputType = {
    setTitle: (title: string)=>void
    title: string
    className: string
    addTaskButtonHandler: (title:string)=>void
    setError: (error: null)=>void
}


const Input = (props: InputType) => {
    return (


        <TextField value={props.title} label="Title"
                   variant="outlined"
                   className={props.className}
                   onChange={e => props.setTitle(e.currentTarget.value)}
                   onKeyPress={(e) =>{
                       props.setError(null)
                       if (e.key === 'Enter') {
                           props.addTaskButtonHandler(props.title)
                       }
                   }}/>


    );
};

export default Input;