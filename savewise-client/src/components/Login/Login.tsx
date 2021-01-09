import React, { ChangeEvent, ReactElement, SyntheticEvent, useState } from 'react';
import "./Login.scss";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { LoginData } from '../../common/login';
import { LoginService } from "../../services";
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

interface LoginError {
    hasErrors: boolean,
    message?: string
}

export default function Login(): ReactElement {
    const [loginForm, setLoginForm] = useState<LoginData>({ userName: '', password: '' });
    const [error, setError] = React.useState<LoginError>({ hasErrors: false });

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLoginForm({
            ...loginForm,
            [event.currentTarget.name] : event.currentTarget.value
        })
    };

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        const { status, login } = await LoginService.login(loginForm);
        if (status.success) {
            console.debug("Login correct", login);
        } else {
            setError({ hasErrors: !status.success, message: status.errorMessage });
        }
    }

    
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setError({ ...error, hasErrors: false });
  };

    return (
        <div className="LoginComponent">
            <form className="Login" onSubmit={handleSubmit}>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="stretch"
                    spacing={2}
                    >
                    <Grid item md={12}>
                        <TextField 
                            id="filled-basic"
                            onChange={handleInputChange} 
                            label="Username" 
                            variant="filled" 
                            name="userName" 
                            required
                            />
                    </Grid>
                    <Grid item md={12}>
                        <TextField 
                            id="filled-basic" 
                            onChange={handleInputChange} 
                            label="Password" 
                            variant="filled" 
                            name="password" 
                            type="password"
                            required
                            />
                    </Grid>
                    <Grid item md={12}>
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Snackbar open={error.hasErrors} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    { error.message }
                </Alert>
            </Snackbar>
        </div>
    )
}
