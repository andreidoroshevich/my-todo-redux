import React from 'react';


type UnchangeableHeaderType = {
    title: string
}

const UnchangeableHeader = (props: UnchangeableHeaderType) => {


    return (
        <div className={'mainTitle'}><h3>{props.title}</h3></div>
    );
};

export default UnchangeableHeader;