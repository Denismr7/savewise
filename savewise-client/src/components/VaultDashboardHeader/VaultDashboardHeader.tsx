import React, { ChangeEvent, ReactNode } from 'react';
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import styles from './VaultDashboardHeader.module.scss';
import { Vault } from '../../common/objects/vault';

interface VaultDashboardHeaderProps {
    selectValue?: number;
    handleChange: (event: ChangeEvent<{ name?: string | undefined; value: unknown; }>, child: ReactNode) => void;
    allVaults: Vault[];
}

export default function VaultDashboardHeader({ selectValue, handleChange, allVaults }: VaultDashboardHeaderProps) {
    const renderMenuItems = (vaults: Vault[]) => {
        return vaults.map(v => (
            <MenuItem key={v.id} value={v.id}>{ v.name }</MenuItem>
        ))
    };

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
                        value={selectValue ? selectValue : ""}
                        onChange={handleChange}
                        label="Age"
                        className={styles.vaultSelect}
                    >
                        { renderMenuItems(allVaults) }
                    </Select>
                </FormControl>
            </div>
    )
}
