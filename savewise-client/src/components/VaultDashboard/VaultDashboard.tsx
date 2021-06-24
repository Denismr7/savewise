import React, { ChangeEvent, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import styles from './VaultDashboard.module.scss';
import { Vault } from '../../common/objects/vault';
import { StatsService, TransactionService, VaultService } from '../../services';
import { LoginContext } from '../../common/context/LoginContext';
import { SnackbarContext } from '../../common/context/SnackbarContext';
import VaultChart from '../VaultChart/VaultChart';
import TransactionPanel from '../TransactionPanel/TransactionPanel';
import { Transaction } from '../../common/objects/transactions';
import { VaultMonthlyAmount } from '../../common/objects/stats';
import moment from 'moment';
import { CategoryTypesId } from '../../common/objects/CategoryTypesId';
import { constants } from '../../common/objects/constants';
import VaultDashboardHeader from '../VaultDashboardHeader/VaultDashboardHeader';


export default function VaultDashboard() {
    const {login} = useContext(LoginContext);
    const { setSnackbarInfo } = useContext(SnackbarContext);

    const [vault, setVault] = useState<Vault | undefined>(undefined);
    const [allVaults, setAllVaults] = useState<Vault[]>([]);
    const [vaultTransactions, setVaultTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [chartData, setChartData] = useState<VaultMonthlyAmount[]>([]);
    const [ currentYear ] = useState<number>(moment().year());

    const handleSelectChange = (event: ChangeEvent<{ name?: string | undefined; value: unknown; }>, child: ReactNode) => {
        const selectedVault = allVaults.find(v => v.id === event.target.value) as Vault;
        setVault(selectedVault);
    }

    const handleDelete = () => {
        setVault(undefined);
    }

    const handleSavedTransaction = (newTransaction: Transaction) => {
        if (!newTransaction.vaultId || newTransaction.vaultId !== vault?.id) return;

        setVaultTransactions([...vaultTransactions, newTransaction]);
        updateChartData(newTransaction);
    }

    const getChartData = useCallback(
        (userId: number, vaultId: number, year: number) => {
            StatsService.getVaultMonthlyAmount(userId, vaultId, year).then(({ status, vaultInformation }) => {
                if (status.success) {
                    setChartData(vaultInformation);
                }  else {
                    setSnackbarInfo({ severity: 'error', message: status.errorMessage })
                }
            }).catch(e => setSnackbarInfo({ severity: 'error', message: e }));
        },
        [setSnackbarInfo],
    );

     // Get chart data
     useEffect(() => {
         const userId = login.login?.id;
        if (!userId || !vault) return;

        getChartData(userId, vault.id as number, currentYear);
        return () => {
            
        }
    }, [currentYear, getChartData, login, vault]);

    // Update chart data
    const updateChartData = (newTransaction: Transaction) => {
        // Guards
        if (!newTransaction) return;
        const transactionCatType = newTransaction.category.categoryType.id;
        if (transactionCatType !== CategoryTypesId.VaultIncomes && transactionCatType !== CategoryTypesId.VaultExpenses) return;
        
        // Get year and month of the new transaction
        const transactionYear = moment(newTransaction.date, constants.dateFormats.fullDate).year();
        const transactionMonth = moment(newTransaction.date, constants.dateFormats.fullDate).month() + 1;
        if (transactionYear !== currentYear) return;
        
        // Update data
        setChartData(chartData.map(data => {
            if (data.month !== transactionMonth) return data;

            
            const transactionAmount = transactionCatType === CategoryTypesId.VaultIncomes ? newTransaction.amount : newTransaction.amount * -1;
            data.amount += transactionAmount;

            return data;
        }));
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
    }, [login, setSnackbarInfo]);

    useEffect(() => {
        const userId = login.login?.id;
        if (!userId) return console.error("User id not found");
        if (!vault?.id) return;

        setLoading(true);

        TransactionService.GetTransactions(userId, undefined, undefined, 10, vault?.id).then(({ status, transactions }) => {
            if (status.success) {
                setVaultTransactions(transactions);
                setLoading(false);
            } else {
                setSnackbarInfo({ severity: 'error', message: status.errorMessage })
            }
        }).catch(e => setSnackbarInfo({ severity: 'error', message: e }));

        return () => {
            
        }
    }, [login, vault, setSnackbarInfo]);

    const renderVaultData = () => {
        const noData = (
            <div className={styles.noData}>
                <Typography align="center" variant="h4">Amount: {vault?.amount} {constants.currency}</Typography>
                <h2>This vault has no transactions</h2>
            </div>
        );

        const vaultData = (
            <div className={styles.vaultData}>
                    <Typography align="center" variant="h4">Amount: {vault?.amount} {constants.currency}</Typography>
                    <Paper elevation={1} className={styles.componentBody}>
                        <div className={styles.chartContainer}>
                            <VaultChart chartData={chartData}/>
                        </div>
                        <div className={styles.transactionPanelContainer}>
                            <TransactionPanel transactions={vaultTransactions} loading={loading} onSave={handleSavedTransaction}/>
                        </div>
                    </Paper>
            </div>
        )
        return vaultTransactions.length ? vaultData : noData;
    }

    return (
        <Paper className="componentBg" elevation={2}>
            <VaultDashboardHeader selectValue={vault?.id} handleChange={handleSelectChange} allVaults={allVaults} handleDelete={handleDelete} />
            {
                vault ? 
                renderVaultData()
                :
                null
            }
        </Paper>
    )
}
