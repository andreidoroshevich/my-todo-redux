import React, {useEffect} from 'react';
import TodoLists from "./components/todolist/TodoLists";
import {Login} from "./components/login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {AppRootStateType, useAppDispatch} from "./store/store";
import {initializeAppTC} from "./reducers/AppReducer";
import {useSelector} from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";




function App() {
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <Routes>
            <Route path={'/'} element={<TodoLists/>}/>
            <Route path={'login'} element={<Login/>}/>
            <Route path="/404" element={<h1>404: PAGE NOT FOUND</h1>}/>
            <Route path="*" element={<Navigate to={'/404'}/>}/>
        </Routes>
    );
}

export default App;
