import React, { ChangeEvent, ReactNode, useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Button from '@material-ui/core/Button';

import styles from './VaultDashboard.module.scss';
import { Vault } from '../../common/objects/vault';
import { VaultService } from '../../services';
import { LoginContext } from '../../common/context/LoginContext';
import { SnackbarContext } from '../../common/context/SnackbarContext';


export default function VaultDashboard() {
    const {login} = useContext(LoginContext);
    const { setSnackbarInfo } = useContext(SnackbarContext);

    const [vault, setVault] = useState<Vault | undefined>(undefined);
    const [allVaults, setAllVaults] = useState<Vault[]>([]);

    const handleSelectChange = (event: ChangeEvent<{ name?: string | undefined; value: unknown; }>, child: ReactNode) => {
        const selectedVault = allVaults.find(v => v.id === event.target.value) as Vault;
        setVault(selectedVault);
    }

    useEffect(() => {
        const userId = login.login?.id;
        if (!userId) return console.error("User id not found");

        VaultService.getUserVaults(userId).then(({ status, vaults }) => {
            if (status.success) {
                setAllVaults(vaults);
            } else {
                setSnackbarInfo({ severity: 'error', message: status.errorMessage })
            }
        }).catch(e => setSnackbarInfo({ severity: 'error', message: e }));
        return () => {
            
        }
    }, [login, setSnackbarInfo])

    const renderHeader = () => {
        return (
            <div className={styles.vaultDashboardHeader}>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={styles.backButton}
                        style={{ 'marginRight': '15px' }}
                    >
                        <ArrowBackIosIcon />
                    </Button>
                </Link>
                <FormControl variant="outlined">
                    <InputLabel id="vaultSelectLabel">Your vaults</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={vault?.id ? vault?.id : ""}
                        onChange={handleSelectChange}
                        label="Age"
                        className={styles.vaultSelect}
                    >
                        { renderMenuItems(allVaults) }
                    </Select>
                </FormControl>
            </div>
        )
    };

    const renderMenuItems = (vaults: Vault[]) => {
        return vaults.map(v => (
            <MenuItem key={v.id} value={v.id}>{ v.name }</MenuItem>
        ))
    }

    return (
        <Paper className="componentBg" elevation={2}>
            { renderHeader() }
        </Paper>
    )
}
