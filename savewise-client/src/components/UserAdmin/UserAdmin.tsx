import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Button from '@material-ui/core/Button';
import styles from "./UserAdmin.module.scss";
import TextField from '@material-ui/core/TextField';
import { LoginContext } from '../../common/context/LoginContext';
import { UserService } from '../../services';
import { User, UserInput } from '../../common/objects/user';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackbarError, SnackbarSuccess } from '../../common/objects/SnackbarHelpers';

interface IUserForm {
    name?: string;
    lastName?: string;
    password?: string;
    rptPassword?: string;
}

export default function UserAdmin() {
    // Context
    const { login, setLogin } = useContext(LoginContext);

    // States
    const [userForm, setUserForm] = useState<IUserForm>({});
    const [editMode, setEditMode] = useState<boolean>(false);
    const [error, setError] = React.useState<SnackbarError>({ hasErrors: false });
    const [saveSuccess, setSaveSuccess] = React.useState<SnackbarSuccess>({ success: false });

    useEffect(() => {
        if (login) {
            setUserForm({
                name: login.login?.name,
                lastName: login.login?.lastName
            });
            setEditMode(true);
        } else {
            setEditMode(false);
        }
        return () => {

        }
    }, [login])

    // HANDLERS
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserForm({...userForm, [event.currentTarget.name]: event.currentTarget.value});
    }
    const handleSubmit = () => {
        // TODO: Password validation

        if (editMode) {
            editUser();
        } else {
            // TODO
        }
    }
    const handleSnackbarClose = (severity?: string) => {
        if (severity === "error") {
            setError({ ...error, hasErrors: false });
        } else if (severity === "success") {
            setSaveSuccess({ ...saveSuccess, success: false });
        }
    };

    // Methods
    const editUser = async () => {
        const user: User = {
            name: userForm.name ? userForm.name : '',
            lastName: userForm.lastName ? userForm.lastName : '',
            password: userForm.password,
            login: login.login?.login as string,
            id: login.login?.id as number
        }
        try {
            const { status, user: editedUser } = await UserService.editUser({ user });
            if (status.success) {
                setLogin({...login, login: editedUser});
                setSaveSuccess({
                    success: true,
                    message: `User edited succesfully!`,
                });
            } else {
                setError({ hasErrors: true, message: status.errorMessage });
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="componentBg">
            <div className="componentHeader">
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <ArrowBackIosIcon />
                </Link>
                <h1 className={`${styles.marginAuto} componentHeaderTitle`}>Your profile</h1>
            </div>
            <div className={styles.userForm}>
                <div className={styles.formRow}>
                    <TextField 
                        id="filled-basic"
                        onChange={handleInputChange} 
                        label="Name" 
                        variant="outlined" 
                        name="name"
                        style={{ width: '45%' }}
                        value={userForm.name}
                        />
                    <TextField 
                        id="filled-basic"
                        onChange={handleInputChange} 
                        label="Last Name" 
                        variant="outlined" 
                        name="lastName"
                        style={{ width: '45%' }}
                        value={userForm.lastName}
                        />
                </div>
                <div className={styles.formRow}>
                    <TextField 
                        id="filled-basic"
                        onChange={handleInputChange} 
                        label="Password" 
                        variant="outlined" 
                        name="password"
                        type="password"
                        style={{ width: '45%' }}
                        value={userForm.password}
                        />
                    <TextField 
                        id="filled-basic"
                        onChange={handleInputChange} 
                        label="Repeat password" 
                        variant="outlined" 
                        name="rptPassword"
                        type="password"
                        style={{ width: '45%' }}
                        value={userForm.rptPassword}
                        />
                </div>
            </div>
            <div className={styles.saveBtnContainer}>
                <Button className={styles.marginAuto} variant="contained" color="primary" type="submit" onClick={handleSubmit}>
                    Save
                </Button>
            </div>
            <Snackbar open={saveSuccess.success} autoHideDuration={6000} onClose={() => handleSnackbarClose('success')}>
                <Alert onClose={() => handleSnackbarClose('success')} severity="success">
                    { saveSuccess.message }
                </Alert>
            </Snackbar>
            <Snackbar open={error.hasErrors} autoHideDuration={6000} onClose={() => handleSnackbarClose("error")}>
                <Alert onClose={() => handleSnackbarClose("error")} severity="error">
                    { error.message }
                </Alert>
            </Snackbar>
        </div>
    )
}
