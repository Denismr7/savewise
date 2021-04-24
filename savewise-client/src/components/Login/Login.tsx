import React, { ChangeEvent, ReactElement, SyntheticEvent, useContext, useState } from 'react';
import "./Login.scss";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { LoginData } from '../../common/objects/login';
import { LoginService, SessionService } from "../../services";
import { LoginContext } from '../../common/context/LoginContext';
import { Redirect, useHistory, Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { SnackbarContext } from '../../common/context/SnackbarContext';

export default function Login(): ReactElement {
    const [loginForm, setLoginForm] = useState<LoginData>({ userName: '', password: '' });
    const { setSnackbarInfo } = useContext(SnackbarContext);
    const {login, setLogin} = useContext(LoginContext);
    const history = useHistory();

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
            setLogin({ isLogged: true, login });
            SessionService.setLogin(login);
            history.push("/dashboard");
        } else {
            setSnackbarInfo({ severity: "error", message: status.errorMessage });
        }
    }

  if (login.isLogged) {
     return (
         <Redirect to="/dashboard" />
         )
  }

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
                        <Typography variant="h4" component="h1" gutterBottom>
                            Login
                        </Typography>
                    </Grid>
                    <Grid item md={12}>
                        <TextField 
                            id="filled-basic"
                            onChange={handleInputChange} 
                            label="Username" 
                            variant="filled" 
                            name="userName"
                            fullWidth
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
                            fullWidth
                            required
                            />
                    </Grid>
                    <Grid item md={12}>
                        <Button variant="contained" color="primary" type="submit">
                            Login
                        </Button>
                    </Grid>
                    <Grid item md={12}>
                        <Link to="/user">
                            <Button variant="outlined" color="default" type="button">
                                Create account
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </div>
    )

}
