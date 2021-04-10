import React, { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Button from '@material-ui/core/Button';
import styles from "./UserAdmin.module.scss";
import TextField from '@material-ui/core/TextField';

interface IUserForm {
    name?: string;
    lastName?: string;
    password?: string;
    rptPassword?: string;
}

export default function UserAdmin() {
    const [userForm, setUserForm] = useState<IUserForm>({});


    // FORM HANDLERS
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserForm({...userForm, [event.currentTarget.name]: event.currentTarget.value});
    }
    const handleSubmit = () => {
        console.debug("Form: ", userForm);
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
        </div>
    )
}
