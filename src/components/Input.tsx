import React from 'react';

type InputType = {
    setTitle: (title: string)=>void
    title: string
    className: string
    addTaskButtonHandler: (title:string)=>void
    setError: (error: null)=>void
}


const Input = (props: InputType) => {
    return (
        <input value={props.title} className={props.className}
               onChange={e => props.setTitle(e.currentTarget.value)}
               onKeyPress={(e) =>{
                   props.setError(null)
                   if (e.key === 'Enter') {
                       props.addTaskButtonHandler(props.title)
                   }
               }}
        />

    );
};

export default Input;