import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import styles from "./UserAdmin.module.scss";
import TextField from '@material-ui/core/TextField';
import { LoginContext } from '../../common/context/LoginContext';
import { UserService } from '../../services';
import { User } from '../../common/objects/user';
import { SnackbarContext } from '../../common/context/SnackbarContext';

interface IUserForm {
    name?: string;
    lastName?: string;
    password?: string;
    rptPassword?: string;
    login?: string;
}

export default function UserAdmin() {
    // Context and routing
    const { login, setLogin } = useContext(LoginContext);
    const { setSnackbarInfo } = useContext(SnackbarContext);
    const history = useHistory();

    // States
    const [userForm, setUserForm] = useState<IUserForm>({});
    const [editMode, setEditMode] = useState<boolean>(false);

    useEffect(() => {
        if (login.isLogged) {
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
        if ((userForm.password || userForm.rptPassword) && userForm.password !== userForm.rptPassword) {
            setSnackbarInfo({ severity: "error", message: 'Passwords does not match' });
            return;
        }
        if (!editMode && !userForm.login) {
            setSnackbarInfo({ severity: "error", message: 'Login is required' });
            return;
        }
        if (!editMode && ((!userForm.password || !userForm.rptPassword) || (userForm.password !== userForm.rptPassword))) {
            setSnackbarInfo({ severity: "error", message: 'Password is required' });
            return;
        }

        const user: User = {
            name: userForm.name ? userForm.name : '',
            lastName: userForm.lastName ? userForm.lastName : '',
            password: userForm.password,
            login: userForm.login as string,
            id: login.login?.id as number
        }

        editMode ? editUser(user) : createUser(user);
    }

    // Methods
    const editUser = async (user: User) => {
        try {
            const { status, user: editedUser } = await UserService.editUser({ user });
            if (status.success) {
                setLogin({...login, login: editedUser});
                setSnackbarInfo({ severity: "success", message: 'User edited succesfully!' });
            } else {
                setSnackbarInfo({ severity: "error", message: status.errorMessage });
            }
        } catch (error) {
            console.error(error);
        }
    }

    const createUser = async (user: User) => {
        try {
            const { status } = await UserService.createUser({ user });
            if (status.success) {
                history.push("/login");
                setSnackbarInfo({ severity: "success", message: 'User created successfully! You can login now' });
            } else {
                setSnackbarInfo({ severity: "error", message: status.errorMessage });
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="componentBg">
            <div className="componentHeader">
                <h1 className={`${styles.marginAuto} componentHeaderTitle`}>
                    { editMode ? 'Your account' : 'Create account' }
                </h1>
            </div>
            <div className={styles.userForm}>
                <div className={styles.formRow}>
                    { !editMode &&
                        <TextField 
                        id="filled-basic"
                        onChange={handleInputChange} 
                        label="Login" 
                        variant="outlined" 
                        name="login"
                        value={userForm.login ? userForm.login : ''}
                        inputProps={{ maxLength: 15 }}
                        style={{ marginRight: '10px' }}
                        fullWidth
                        />
                    }
                    <TextField 
                        id="filled-basic"
                        onChange={handleInputChange} 
                        label="Name" 
                        variant="outlined" 
                        name="name"
                        value={userForm.name ? userForm.name : ''}
                        inputProps={{ maxLength: 20 }}
                        style={{ marginRight: '10px' }}
                        required
                        fullWidth
                        />
                    <TextField 
                        id="filled-basic"
                        onChange={handleInputChange} 
                        label="Last Name" 
                        variant="outlined" 
                        name="lastName"
                        value={userForm.lastName ? userForm.lastName : ''}
                        inputProps={{ maxLength: 20 }}
                        required
                        fullWidth
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
                        style={{ marginRight: '10px' }}
                        fullWidth
                        value={userForm.password ? userForm.password : ''}
                        />
                    <TextField 
                        id="filled-basic"
                        onChange={handleInputChange} 
                        label="Repeat password"
                        variant="outlined" 
                        name="rptPassword"
                        type="password"
                        fullWidth
                        value={userForm.rptPassword ? userForm.rptPassword : ''}
                        />
                </div>
            </div>
            <div className={styles.saveBtnContainer}>
                <Button className={styles.marginAuto} variant="contained" color="primary" type="submit" onClick={handleSubmit}>
                    Save
                </Button>
            </div>
        </div>
    )
}
