import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import {useFormik} from "formik";
import {loginTC} from "../../reducers/AuthReducer";
import {AppRootStateType, useAppDispatch, useAppSelector} from "../../store/store";
import {ErrorSnackbar} from "../../common/components/ErrorSnackBar";
import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import AppBar from "@mui/material/AppBar";
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import {RequestStatusType} from "../../reducers/AppReducer";
import LinearProgress from "@mui/material/LinearProgress";


type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

export const Login = () => {

    const dispatch = useAppDispatch()
    const isLoggedIn=useSelector<AppRootStateType, boolean>(state=>state.auth.isLoggedIn)
    const status = useAppSelector<RequestStatusType>(state => state.app.status)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikErrorType = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            if (!values.password) {
                errors.password = 'Required';
            } else if (values.password.length<4) {
                errors.password = 'Password length should be more then 4 characters';
            }
            return errors;
        },
        onSubmit: values => {
            dispatch(loginTC(values))
            formik.resetForm()
        },
    })

    if (isLoggedIn) {
        return <Navigate to={'/'}/>
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>

                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>

            <Grid container justifyContent={'center'}>
                <Grid item justifyContent={'center'}>

                    <form onSubmit={formik.handleSubmit}>
                        <FormControl>
                            <FormLabel>
                                <p>To log in get registered
                                    <a href={'https://social-network.samuraijs.com/'}
                                       target={'_blank'}> here
                                    </a>
                                </p>
                                <p>or use common test account credentials:</p>
                                <p>Email: free@samuraijs.com</p>
                                <p>Password: free</p>
                            </FormLabel>
                            <FormGroup>
                                <TextField
                                    label="Email"
                                    margin="normal"
                                    {...formik.getFieldProps('email')}
                                />
                                {formik.touched.email
                                    && formik.errors.email
                                    && <div style={{color: 'red'}}>{formik.errors.email}</div>}
                                <TextField type="password"
                                           label="Password"
                                           margin="normal"
                                           {...formik.getFieldProps('password')}
                                />
                                {formik.touched.password
                                    && formik.errors.password
                                    && <div style={{color: 'red'}}>{formik.errors.password}</div>}

                                <FormControlLabel label={'Remember me'} control={<Checkbox
                                    checked={formik.values.rememberMe}
                                    {...formik.getFieldProps('rememberMe')}
                                />}/>
                                <Button type={'submit'} variant={'contained'} color={'primary'}>
                                    Login
                                </Button>
                            </FormGroup>
                        </FormControl>
                    </form>
                    <ErrorSnackbar/>
                </Grid>
            </Grid>

        </>
    )
}