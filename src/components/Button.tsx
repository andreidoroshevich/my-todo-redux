import React, {useCallback} from 'react';

type ButtonType = {
    title: string
    callBack: () => void
    className?: string
}

const Button = React.memo((props: ButtonType) => {
    const onClickHandler = useCallback(() => {
        props.callBack()
    },[props.callBack])

    return (

        <button className={props.className} onClick={onClickHandler}> {props.title} </button>

    );
});

export default Button;