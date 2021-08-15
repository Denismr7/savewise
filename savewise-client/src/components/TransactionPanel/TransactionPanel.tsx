import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import TransactionModal from '../TransactionModal/TransactionModal';
import { Transaction } from '../../common/objects/transactions';
import styles from "./TransactionPanel.module.scss";
import { CategoryTypesId } from '../../common/objects/CategoryTypesId';
import { UtilService } from '../../services';
import PanelItem from '../PanelItem/PanelItem';


export interface ITransactionPanelProps {
    transactions: Transaction[];
    loading: boolean;
    onSave: (t: Transaction) => any;
    parent?: string;
}

export default function TransactionPanel({ transactions, loading, onSave, parent }: ITransactionPanelProps) {
    const [openModal, setOpenModal] = useState<boolean>(false);

    const renderTransactions = (transactions: Transaction[]) => {
        if (transactions.length) {
            const sortedByDate = UtilService.sortTransactionByDate(transactions);
            return sortedByDate.map(t => {
                let isIncome: boolean;
                if (parent === 'vault') {
                    // Vault Dashboard
                    isIncome = t.category.categoryType?.id === CategoryTypesId.VaultIncomes ? true : false;
                } else {
                    // Transaction Dashboard
                    isIncome = t.category.categoryType?.id === CategoryTypesId.Incomes ? true : false;
                }
                const symbol: string = isIncome ? "+" : "-";
                const color = isIncome ? 'incomeGreenColor' : 'regularColor';
                return (
                    <PanelItem item={{name: t.description, id: t.id, amount: t.amount}} symbol={symbol} incomesColor={color}/>
                )
            }
            )
        } else (<Typography variant="h6" component="h2" style={{ display: 'inline', marginLeft: '15px' }}>No transactions to show</Typography>);
    };

    return (
        <>
            <Grid container
                direction="column"
                justify='space-between'
                style={{ height: '95%' }}
            >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h5" component="h2" className="panelTitle">
                        LAST TRANSACTIONS
                    </Typography>
                    <IconButton color="primary" aria-label="add transaction" component="span" onClick={() => setOpenModal(true)}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                </div>
                <Grid container
                    direction="column"
                    style={{ height: '70%' }}
                    spacing={3}
                >
                    {loading ?
                        (<CircularProgress color="secondary" />)
                        :
                        (<div className={styles.itemsContainer}>
                            {renderTransactions(transactions)}
                        </div>)
                    }
                </Grid>
                <Link to="/transactions">
                    <Button variant="outlined" color="primary">
                        Manage
                        </Button>
                </Link>
            </Grid>
            <TransactionModal conditionToShow={openModal} handleVisibility={() => setOpenModal(!openModal)} handleSave={(t: Transaction) => onSave(t)} />
        </>
    )
}
