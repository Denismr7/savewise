import React, { useContext, useEffect, useState, useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import styles from "./Dashboard.module.scss";
import { Typography } from '@material-ui/core';
import { LoginContext } from '../../common/context/LoginContext';
import { CategoryService, StatsService, TransactionService, UtilService } from '../../services/';
import { CategoriesResponse, Category } from '../../common/objects/categories';
import { GetCategoriesInput } from '../../services/category-service';
import { CategoryTypesId } from '../../common/objects/CategoryTypesId';
import { Transaction } from '../../common/objects/transactions';
import IconButton from '@material-ui/core/IconButton';
import { SnackbarContext } from '../../common/context/SnackbarContext';
import { constants } from '../../common/objects/constants';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import MonthsBalanceChart from '../MonthsBalanceChart/MonthsBalanceChart';
import { MonthInformation } from '../../common/objects/stats';
import moment from 'moment';
import TransactionModal from '../TransactionModal/TransactionModal';
import TransactionPanel from '../TransactionPanel/TransactionPanel';
import NavbarComponent from '../NavbarComponent/NavbarComponent';
import DashboardPanel from '../DashboardPanel/DashboardPanel';

export default function Dashboard() {
    const {login} = useContext(LoginContext);
    const { setSnackbarInfo } = useContext(SnackbarContext);

    const [loading, setLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [currentMonth, setCurrentMonth] = useState<string>('');
    const [selectedMonthNumber, setSelectedMonthNumber] = useState<number>(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [chartData, setChartData] = useState<MonthInformation[]>([]);

    const getCategories = useCallback(
        (userId?: number) => {
            setLoading(true);
            const categoriesOptions: GetCategoriesInput = {
                includeAmounts: true,
                startDate: UtilService.firstDayDate(selectedMonthNumber, selectedYear),
                endDate: UtilService.lastDayMonthDate(selectedMonthNumber, selectedYear)
            }
            if (userId) {
                CategoryService.getCategories(userId, categoriesOptions).then((rsp: CategoriesResponse) => {
                    if (rsp.status.success) {
                        const sortedByAmount = UtilService.sortCategoriesByAmount(rsp.categories);
                        setCategories(sortedByAmount);
                        setLoading(false);
                    } else {
                        setSnackbarInfo({ severity: "error", message: rsp.status.errorMessage });
                        setLoading(false);
                    }
                }).catch(e => {
                    setSnackbarInfo({ severity: "error", message: e });
                    setLoading(false);
                })
            }
        },
        [setSnackbarInfo, selectedMonthNumber, selectedYear],
    );

    const getTransactions = useCallback(
        (userId?: number) => {
            setLoading(true);
            if (userId) {
                const fromDate = UtilService.firstDayDate(selectedMonthNumber, selectedYear);
                const toDate = UtilService.lastDayMonthDate(selectedMonthNumber, selectedYear)
                TransactionService.GetTransactions(userId, fromDate, toDate, 10).then(rsp => {
                    if (rsp.status.success) {
                        setTransactions(rsp.transactions);
                        setLoading(false);
                    } else {
                        setSnackbarInfo({ severity: "error", message: rsp.status.errorMessage });
                        setLoading(false);
                    }
                }).catch(e => {
                    setSnackbarInfo({ severity: "error", message: e });
                    setLoading(false);
                })
            }
        },
        [setSnackbarInfo, selectedMonthNumber, selectedYear],
    );

    const getMonthsInformation = useCallback(
        async (userId: number, selectedYear: number) => {
            try {
                const { status, monthsInformation } = await StatsService.getMonthIncomeExpenses(userId, selectedYear);
                if (status.success) {
                    setChartData(monthsInformation);
                } else {
                    setSnackbarInfo({ severity: "error", message: status.errorMessage });
                }
            } catch (error) {
                setSnackbarInfo({ severity: "error", message: error });
            }
        },
        [setSnackbarInfo],
    )

    const updateMonthsBalance = (newTransaction: Transaction) => {
        const transactionMonth = moment(UtilService.toDate(newTransaction.date)).format("M");

        const monthIndex: number = chartData.findIndex(mi => mi.month.toString() === transactionMonth);
        if (monthIndex === -1) {
            return;
        }

        const monthBalance: MonthInformation = chartData[monthIndex];
        const categoryTipe = newTransaction.category.categoryType.id;
        if (categoryTipe === CategoryTypesId.Incomes) {
            monthBalance.incomes += newTransaction.amount;
        } else if (categoryTipe === CategoryTypesId.Expenses) {
            monthBalance.expenses += newTransaction.amount;
        } else {
            return;
        }

        setChartData(chartData.map((mi, index) => index === monthIndex ? monthBalance : mi ));
    }

    useEffect(() => {
        const userId = login.login?.id;
        if (!userId) return console.error("User id not found");
        setCurrentMonth(UtilService.currentMonth(selectedMonthNumber));
        getCategories(userId);
        getTransactions(userId);
        return () => {
            
        }
    }, [login, getCategories, getTransactions, selectedMonthNumber, getMonthsInformation, selectedYear]);
    
    // Only update balance if the year changes
    useEffect(() => {
        const userId = login.login?.id;
        if (!userId) return console.error("User id not found");
        getMonthsInformation(userId, selectedYear);
        return () => {
            
        }
    }, [login, selectedYear, getMonthsInformation])

    const onSave = (newTransaction: Transaction) => {
        setTransactions([...transactions, newTransaction]);
        updateMonthsBalance(newTransaction);
        getCategories(login.login?.id);
    };

    const navigateMonth = (direction: "b" | "f") => {
        let month = selectedMonthNumber;
        let year = selectedYear;
        switch (direction) {
            case "b":
                if (month > 1) {
                    month = month - 1;
                } else {
                    year = year - 1;
                    month = 12;
                }
                break;
            case "f":
                if (month < 12) {
                    month = month + 1;
                } else {
                    year = year + 1;
                    month = 1;
                }
                break;
            default:
                break;
        }
        if (year !== selectedYear) {
            setSelectedYear(year);
        }
        setSelectedMonthNumber(month);
    }

    const renderMonthController = () => (
        <div className={styles.monthController}>
            <IconButton aria-label="backMonth" component="span" onClick={() => navigateMonth("b")}>
                <ArrowBackIosOutlinedIcon />
            </IconButton>
            <Typography variant="h4" component="h4" className={styles.currentMonthName}>
                {currentMonth}, {selectedYear}
            </Typography>
            <IconButton aria-label="forwardMonth" component="span" onClick={() => navigateMonth("f")}>
                <ArrowForwardIosOutlinedIcon />
            </IconButton>
        </div>
    )

    const renderCurrentBalance = () => {
        const incomes: number = categories.filter(c => c.categoryType.id === CategoryTypesId.Incomes).reduce((acc, c) => acc = Number(c.amount) + acc, 0);
        const expenses: number = categories.filter(c => c.categoryType.id === CategoryTypesId.Expenses).reduce((acc, c) => acc = Number(c.amount) + acc, 0);
        const result = Number((incomes - expenses).toFixed(2));
        return (
            <div className={styles.balanceContainer}>
                <Typography variant="h6" component="h6">
                    Balance:
                    <span className={`${styles.balanceResult} ${result > 0 ? 'incomeGreenColor' : 'regularColor'}`}>
                        { result } { constants.currency }
                    </span>
                </Typography>
            </div>
        )
    }

    return (
        <Grid 
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={5}
            style={{ width: '99%' }}
            >
            <Grid item xs={12} md={12} lg={12} xl={12} style={{ width: '100%', paddingLeft: '5%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginTop: '2%' }}>
                    <NavbarComponent />
                </div>
            </Grid>
            <Grid item className={styles.chartPanel}>
                { login.login && chartData.length && <MonthsBalanceChart userId={login.login.id} selectedYear={selectedYear} chartData={chartData} /> }
            </Grid>
            <Grid item>
                { renderMonthController() }
                { renderCurrentBalance() }
            </Grid>
            <Grid container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={10}
            >
                <Grid item>
                    <DashboardPanel panelTitle="Month expenses" panelItems={categories.filter(c => c.categoryType.id === CategoryTypesId.Expenses)} loading={loading} />
                </Grid>
                <Grid item>
                    <DashboardPanel panelTitle="Month incomes" panelItems={categories.filter(c => c.categoryType.id === CategoryTypesId.Incomes)} loading={loading}/>
                </Grid>
                <Grid item>
                    <div className={styles.transactionsPanel}>
                        <TransactionPanel transactions={transactions} loading={loading} onSave={onSave} ></TransactionPanel>
                    </div>
                </Grid>
            <TransactionModal conditionToShow={openModal} handleVisibility={() => setOpenModal(!openModal)} handleSave={(t: Transaction) => onSave(t)} />
            </Grid>
        </Grid>
    )
}
