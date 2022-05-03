import React from 'react';


type UnchangibleHeaderType = {
    title: string
}

const UnchangibleHeader = (props: UnchangibleHeaderType) => {


    return (
        <div className={'maintitle'}><h3>{props.title}</h3></div>
    );
};

export default UnchangibleHeader;