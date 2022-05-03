import React from 'react';
import {EditableSpan} from "./EditableSpan";


type HeaderType = {
    id: string
    title: string
    changeTodoListTitle: (todoListID: string, newTitle: string)=>void
}

const Header = (props: HeaderType) => {

    const changeTodoListTitle = (newTitle: string)=>{
        props.changeTodoListTitle(props.id, newTitle)
    }

    return (
      <h3><EditableSpan title={props.title} onChange={changeTodoListTitle}/></h3>
    );
};

export default Header;