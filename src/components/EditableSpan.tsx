import React, {ChangeEvent, useState} from "react";

type EditableSpanType = {
    title: string
    onChange: (newValue: string)=>void
}
export const EditableSpan = (props: EditableSpanType) => {
    let [editMode, setEditMode] = useState(false)
    let [title, setTitle] = useState('')

    const activateEditMode=()=>{
        setEditMode(true)
        setTitle(props.title)
    }
    const activateViewMode=()=>{
        setEditMode(false)
        props.onChange(title)
    }

    const onChangeTitleHandler=(e: ChangeEvent<HTMLInputElement>)=>{
        setTitle(e.currentTarget.value)
    }


    return (
        editMode
            ? <input autoFocus={true} onChange={onChangeTitleHandler} onBlur={activateViewMode}  value={title}/>
            : <span onDoubleClick={activateEditMode}>{props.title}</span>
    )
}