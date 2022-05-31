import React, {useCallback} from 'react';
import {EditableSpan} from "../../common/components/EditableSpan";


type HeaderType = {
    id: string
    title: string
    changeTodoListTitle: (todoListID: string, newTitle: string) => void
}

const Header = React.memo((props: HeaderType) => {

    const changeTodoListTitle = useCallback((newTitle: string) => {
        props.changeTodoListTitle(props.id, newTitle)
    },[props.changeTodoListTitle, props.id])

    return (
        <h3><EditableSpan title={props.title} onChange={changeTodoListTitle}/></h3>
    );
});

export default Header;