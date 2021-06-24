import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';

interface DeleteVaultDialogProps {
    open: boolean;
    handleClose: (deleteVault: boolean) => void;
}

export default function CreateVaultDialog({ open, handleClose }: DeleteVaultDialogProps) {
    const onCloseDialog = (deleteVault: boolean) => {
        handleClose(deleteVault);
    }


    return (
        <Dialog open={open} onClose={() => onCloseDialog(false)} aria-labelledby="delete-vault">
            <DialogTitle id="delete-vault-title">Create new Vault</DialogTitle>
            <DialogContent>
                <DialogContentText id="delete-vault-description">
                    All vault transactions will be deleted and lost forever. Do you really want to delete the vault?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onCloseDialog(true)} color="primary">
                    Delete
                </Button>
                <Button onClick={() => onCloseDialog(false)} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}
