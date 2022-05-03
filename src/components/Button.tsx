import React from 'react';

type ButtonType = {
    title: string
    callBack: () => void
    className?: string
}

const Button = (props: ButtonType) => {
    const onClickHandler = () => {
        props.callBack()
    }

    return (

        <button className={props.className} onClick={onClickHandler}> {props.title} </button>

    );
};

export default Button;