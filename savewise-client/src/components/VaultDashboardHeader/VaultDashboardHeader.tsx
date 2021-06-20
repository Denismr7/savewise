import React, { ChangeEvent, ReactNode, useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import styles from './VaultDashboardHeader.module.scss';
import { IVaultForm, Vault } from '../../common/objects/vault';
import CreateVaultDialog from '../CreateVaultDialog/CreateVaultDialog';
import { VaultService } from '../../services';
import { LoginContext } from '../../common/context/LoginContext';
import { SnackbarContext } from '../../common/context/SnackbarContext';
import DeleteVaultDialog from '../DeleteVaultDialog/DeleteVaultDialog';

interface VaultDashboardHeaderProps {
    selectValue?: number;
    handleChange: (event: ChangeEvent<{ name?: string | undefined; value: unknown; }>, child: ReactNode) => void;
    handleDelete: () => void;
    allVaults: Vault[];
}

export default function VaultDashboardHeader({ selectValue, handleChange, handleDelete, allVaults }: VaultDashboardHeaderProps) {
    const { login } = useContext(LoginContext);
    const { setSnackbarInfo } = useContext(SnackbarContext);
    
    const [ showCreateDialog, setShowCreateDialog ] = useState<boolean>(false);
    const [ showDeleteDialog, setShowDeleteDialog ] = useState<boolean>(false);
    const [ selectedVault, setSelectedVault ] = useState<Vault | undefined>(undefined);

    const renderMenuItems = (vaults: Vault[]) => {
        return vaults.map(v => (
            <MenuItem key={v.id} value={v.id}>{ v.name }</MenuItem>
        ))
    };

    useEffect(() => {
        setSelectedVault(allVaults.find(vault => vault.id === selectValue));
        return () => {
            
        }
    }, [allVaults, selectValue])

    async function onCloseSaveDialog(vaultForm?: IVaultForm) {
        if (vaultForm) {
            const vaultToSave: Vault = {
                name: vaultForm.name,
                amount: vaultForm.amount != null && vaultForm.amount >= 0 ? vaultForm.amount : 0,
                userId: login.login?.id ?? 0
            }
            try {
                const { status, vault } = await VaultService.saveVault(vaultToSave);
                if (status.success) {
                    allVaults.push(vault);
                    setSnackbarInfo({ severity: 'success', message: 'Vault created successfully' });
                } else {
                    setSnackbarInfo({ severity: 'error', message: status.errorMessage });
                }
            } catch (error) {
                setSnackbarInfo({ severity: 'error', message: error });
            }
        }

        setShowCreateDialog(false);
    }

    async function onCloseDeleteDialog(deleteVault: boolean) {
        if (deleteVault && selectedVault?.id) {
            try {
                const { status } = await VaultService.deleteVault(selectedVault?.id);
                if (status.success) {
                    setSnackbarInfo({ severity: 'success', message: 'Vault deleted successfully' });
                    allVaults.splice(allVaults.findIndex(vault => vault.id === selectedVault.id), 1);
                    handleDelete();
                } else {
                    setSnackbarInfo({ severity: 'error', message: status.errorMessage });
                }
            } catch (error) {
                setSnackbarInfo({ severity: 'error', message: error });
            }
        } 
        setShowDeleteDialog(false);
    }

    return (
        <div className={styles.vaultDashboardHeader}>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={`${styles.backButton} ${styles.button}`}
                    >
                        <ArrowBackIosIcon />
                    </Button>
                </Link>
                <div className={styles.vaultSelect}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="vaultSelectLabel">Your vaults</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={selectValue ? selectValue : ""}
                            onChange={handleChange}
                            label="Age"
                            fullWidth
                        >
                            { renderMenuItems(allVaults) }
                        </Select>
                    </FormControl>
                </div>
                <Button
                        onClick={() => setShowCreateDialog(!showCreateDialog)}
                        variant="contained"
                        color="primary"
                        className={`${styles.newVaultButton} ${styles.button}`}
                    >
                        <AddIcon />
                        Create
                </Button>
                <Button
                        onClick={() => setShowDeleteDialog(!showDeleteDialog)}
                        variant="contained"
                        color="secondary"
                        className={`${styles.deleteVaultButton} ${styles.button}`}
                        disabled={selectedVault?.amount !== 0}
                    >
                        <DeleteIcon />
                        Delete vault
                </Button>
                <CreateVaultDialog open={showCreateDialog} handleClose={onCloseSaveDialog} />
                <DeleteVaultDialog open={showDeleteDialog} handleClose={onCloseDeleteDialog}/>
            </div>
    )
}
