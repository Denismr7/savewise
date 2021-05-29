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
import { constants } from '../../common/objects/constants';
import { UtilService } from '../../services';


export interface ITransactionPanelProps {
    transactions: Transaction[];
    loading: boolean;
    onSave: Function;
}

export default function TransactionPanel({ transactions, loading, onSave }: ITransactionPanelProps) {
    const [openModal, setOpenModal] = useState<boolean>(false);

    const renderTransactions = (transactions: Transaction[]) => {
        if (transactions.length) {
            const sortedByDate = UtilService.sortTransactionByDate(transactions);
            return sortedByDate.map(t => {
                const isIncome = t.category.categoryType?.id === CategoryTypesId.Incomes ? true : false; 
                const symbol: string = isIncome ? "+" : "-";
                const color = isIncome ? 'incomeGreenColor' : 'regularColor';
                return (
                    <Grid item
                        container
                        direction="row"
                        justify="space-between"
                        spacing={0}
                        key={t.id}
                    >
                        <Typography variant="h6" component="h2" style={{ display: 'inline', marginLeft: '15px' }}>{t.description}</Typography>
                        <Typography variant="h6" component="h2" style={{ display: 'inline', marginRight: '15px' }} className={color}>
                            { symbol } { t.amount } { constants.currency }
                        </Typography>
                    </Grid>
                )
            }
            )
        } else (<Typography variant="h6" component="h2" style={{ display: 'inline', marginLeft: '15px' }}>No transactions to show</Typography>);
    };

    return (
        <>
            <Grid container
                direction="column"
                alignItems="center"
                justify='space-between'
                style={{ height: '95%' }}
            >
                <Typography variant="h4" style={{ marginTop: '5px', marginBottom: '20px' }} component="h2">
                    Last transactions
                        <IconButton color="primary" aria-label="add transaction" component="span" onClick={() => setOpenModal(true)}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Typography>
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
