import React, { ChangeEvent, ReactElement, SyntheticEvent, useState } from 'react';
import "./Login.scss";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

interface LoginData {
    userName: string,
    password: string
}

export default function Login(): ReactElement {
    const [loginData, setLoginData] = useState<LoginData>({ userName: '', password: '' });

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLoginData({
            ...loginData,
            [event.currentTarget.name] : event.currentTarget.value
        })
    };

    const handleSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        console.debug("Sending data...", loginData);
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
        </div>
    )
}
