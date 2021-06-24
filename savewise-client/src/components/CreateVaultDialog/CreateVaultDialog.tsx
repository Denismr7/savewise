import React, { ChangeEvent, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { IVaultForm } from '../../common/objects/vault';

interface CreateVaultDialogProps {
    open: boolean;
    handleClose: (vaultForm?: IVaultForm) => void;
}

export default function CreateVaultDialog({ open, handleClose }: CreateVaultDialogProps) {
    const [vaultForm, setVaultForm] = useState<IVaultForm>({ name: "", amount: 0 });

    const resetAndEmitForm = (emit: boolean) => {
        if (emit) {
            handleClose(vaultForm);
        } else {
            handleClose(undefined);
        }

        setVaultForm({ name: "", amount: 0 });
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setVaultForm({...vaultForm, [event.target.id]: event.target.value});
    }

    function isValidAmount(amount?: number | string): boolean {
        if (amount === undefined || amount === "") return false;
        if (amount >= 0) return true;

        return false;
    }


    return (
        <Dialog open={open} onClose={() => resetAndEmitForm(false)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create new Vault</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Vault name"
                    type="text"
                    value={vaultForm.name}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    autoFocus
                    InputLabelProps={{ shrink: true }}
                    margin="dense"
                    id="amount"
                    label="Initial value"
                    type="number"
                    value={vaultForm.amount}
                    onChange={handleChange}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button disabled={!vaultForm.name || !isValidAmount(vaultForm.amount) ? true : false} onClick={() => resetAndEmitForm(true)} color="primary">
                    Create
                </Button>
                <Button onClick={() => resetAndEmitForm(false)} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}
