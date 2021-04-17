import React, { useContext, useEffect, useState, ChangeEvent, useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import styles from "./Dashboard.module.scss";
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { LoginContext } from '../../common/context/LoginContext';
import { CategoryService, StatsService, TransactionService, UtilService } from '../../services/';
import { CategoriesResponse, Category } from '../../common/objects/categories';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GetCategoriesInput } from '../../services/category-service';
import { CategoryTypesId } from '../../common/objects/CategoryTypesId';
import { Transaction } from '../../common/objects/transactions';
import { TransactionForm } from '../../common/objects/Transaction';
import Modal from "@material-ui/core/Modal";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from '@material-ui/core/Select';
import { KeyboardDatePicker } from '@material-ui/pickers';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { SnackbarContext } from '../../common/context/SnackbarContext';
import { constants } from '../../common/objects/constants';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import MonthsBalanceChart from '../MonthsBalanceChart/MonthsBalanceChart';
import { MonthInformation } from '../../common/objects/stats';

export default function Dashboard() {
    const {login} = useContext(LoginContext);
    const { setSnackbarInfo } = useContext(SnackbarContext);

    const [loading, setLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [transactionForm, setTransactionForm] = useState<TransactionForm>({
        categoryId: undefined,
        amount: undefined,
        date: UtilService.today(),
        description: "",
    });
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
                        setTransactions( UtilService.sortTransactionByDate(rsp.transactions));
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

    useEffect(() => {
        const userId = login.login?.id;
        if (!userId) return console.error("User id not found");
        setCurrentMonth(UtilService.currentMonth(selectedMonthNumber));
        getCategories(userId);
        getTransactions(userId);
        getMonthsInformation(userId, selectedYear)
        return () => {
            
        }
    }, [login, getCategories, getTransactions, selectedMonthNumber, getMonthsInformation, selectedYear]);
    
    const renderExpenses = (categories: Category[]) => {
        if (categories.length) {
            return categories.map(category => (
                <Grid item
                container
                direction="row"
                justify="space-between"
                spacing={0}
                key={category.id}
                >
                    <Typography variant="h6" component="h2" style={{ display: 'inline', marginLeft: '15px' }}>{ category.name }</Typography>
                    <Typography variant="h6" component="h2" style={{ display: 'inline', marginRight: '15px' }}>{ category.amount ? category.amount : 0 } €</Typography>
                </Grid>
            ))
        } else (<Typography variant="h6" component="h2" style={{ display: 'inline', marginLeft: '15px' }}>No categories to show</Typography>);
    };

    const renderTransactions = (transactions: Transaction[]) => {
        if (transactions.length) {
            const sortedByDate = transactions.sort((a, b) => Number(b.id) - Number(a.id));
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
    }

    const handleToggleModal = (transaction?: Transaction) => {
        if (transaction) {
            setTransactionForm({
                id: transaction.id,
                categoryId: transaction.category.id,
                amount: transaction.amount,
                date: transaction.date,
                description: transaction.description,
            });
        } else {
            setTransactionForm({
                id: undefined,
                categoryId: undefined,
                amount: undefined,
                date: UtilService.today(),
                description: ''
            })
        }
        setOpenModal(!openModal);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'amount') {
            setTransactionForm({...transactionForm, [event.target.name]: Number(event.target.value)});
        } else {
            setTransactionForm({...transactionForm, [event.target.name]: event.target.value});
        }
    }

    const handleSelectChange = (event: ChangeEvent<{ value: unknown }>) => {
        setTransactionForm({...transactionForm, categoryId: event.target.value as number});
    }

    const handleDateChange = (date: Date | null) => {
        setTransactionForm({...transactionForm, date: date ? UtilService.formatDate(date) : ''});
    };

    const renderUserCategories = (userCategories: Category[]) => {
        if (userCategories.length) {
          return userCategories.map(category => {
            return (
              <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
            );
          })
        }
    }

    const onSave = () => {
        const transaction: Transaction = {
            userId: login.login?.id as number,
            category: categories.find(c => c.id === transactionForm.categoryId) as Category,
            amount: transactionForm.amount as number,
            date: transactionForm.date,
            description: transactionForm.description,
            id: transactionForm.id
        }
        TransactionService.SaveTransaction(transaction).then(rsp => {
            if (rsp.status.success) {
                handleToggleModal();
                if (transactions.find(t => t.id === rsp.transaction.id)) {
                    setTransactions(transactions.map(t => t.id === rsp.transaction.id ? rsp.transaction : t));
                } else {
                    setTransactions([...transactions, rsp.transaction]);
                }
                getMonthsInformation(login.login?.id as number, selectedYear);
                getCategories(login.login?.id);
            } else {
                setSnackbarInfo({ severity: "error", message: rsp.status.errorMessage });
            }
        }).catch(e => setSnackbarInfo({ severity: "error", message: e }));
    }

    const modalBody = (
        <div className={styles.modalBg}>
            <h1 className={styles.title}>Add new transaction</h1>
            <TextField 
                    id="outlined-basic"
                    onChange={handleInputChange} 
                    label="Transaction Name" 
                    variant="outlined" 
                    name="description"
                    value={transactionForm.description}
                    fullWidth
                    />
            <TextField 
                    id="outlined-basic"
                    onChange={handleInputChange} 
                    label="Amount (€)" 
                    variant="outlined" 
                    name="amount"
                    type="number"
                    value={transactionForm.amount ? transactionForm.amount : ''}
                    style={{ marginTop: '10px' }}
                    fullWidth
                    placeholder="€"
                    />
            <FormControl style={{ marginTop: '10px' }} fullWidth variant='outlined'>
                <InputLabel id="category">Category</InputLabel>
                <Select
                labelId="category"
                id="categorySelect"
                value={transactionForm.categoryId ? transactionForm.categoryId : ''}
                onChange={handleSelectChange}
                >
                { renderUserCategories(categories) }
                </Select>
            </FormControl>
            <KeyboardDatePicker
                inputVariant="outlined"
                margin="normal"
                id="date-picker-dialog"
                label="Date"
                format="dd/MM/yyyy"
                value={UtilService.formatStringDatePicker(transactionForm.date)}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
                style={{ marginTop: '10px' }}
                fullWidth
            />
            <div className={styles.buttonGroup}>
                <Button variant="contained" color="primary" type="submit" onClick={onSave}>
                    Save
                </Button>
            </div>
        </div>
    );

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
            <Grid item>
                <Typography variant="h2" component="h1" style={{ marginTop: '5%' }}>
                    Welcome back, { login.login?.name }
                    <Link to="/user" style={{ textDecoration: 'none' }}>
                        <SettingsOutlinedIcon className={styles.settingsIcon} />
                    </Link>
                </Typography>
            </Grid>
            <Grid item>
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
                    <div className={styles.panel}>
                        <Grid container
                        direction="column"
                        alignItems="center"
                        justify='space-between'
                        style={{ height: '95%' }}
                        >
                            <Typography variant="h4" style={{ marginTop: '5px', marginBottom: '20px' }} component="h2">
                                Month expenses
                            </Typography>
                            <Grid container
                            direction="column"
                            style={{ height: '70%' }}
                            spacing={3}
                            >
                                { loading ? 
                                    (<CircularProgress color="secondary" />) 
                                    : 
                                    (<div className={styles.itemsContainer}>
                                        {renderExpenses(categories.filter(c => c.categoryType.id === CategoryTypesId.Expenses))}
                                    </div>)
                                }
                            </Grid>
                            <Link to="/categories">
                                <Button variant="outlined" color="primary">
                                    Manage
                                </Button>
                            </Link>
                        </Grid>
                    </div>
                </Grid>
                <Grid item>
                    <div className={styles.panel}>
                        <Grid container
                        direction="column"
                        alignItems="center"
                        justify='space-between'
                        style={{ height: '95%' }}
                        >
                            <Typography variant="h4" style={{ marginTop: '5px', marginBottom: '20px' }} component="h2">
                                Month incomes
                            </Typography>
                            <Grid container
                            direction="column"
                            style={{ height: '70%' }}
                            spacing={3}
                            >
                                { loading ? 
                                    (<CircularProgress color="secondary" />) 
                                    : 
                                    (<div className={styles.itemsContainer}>
                                        {renderExpenses(categories.filter(c => c.categoryType.id === CategoryTypesId.Incomes))}
                                    </div>)
                                }
                            </Grid>
                            <Link to="/categories">
                                <Button variant="outlined" color="primary">
                                    Manage
                                </Button>
                            </Link>
                        </Grid>
                    </div>
                </Grid>
                <Grid item>
                    <div className={styles.panel}>
                        <Grid container
                            direction="column"
                            alignItems="center"
                            justify='space-between'
                            style={{ height: '95%' }}
                            >
                                <Typography variant="h4" style={{ marginTop: '5px', marginBottom: '20px' }} component="h2">
                                    Last transactions
                                    <IconButton color="primary" aria-label="add transaction" component="span" onClick={() => handleToggleModal()}>
                                        <AddCircleOutlineIcon />
                                    </IconButton>
                                </Typography>
                                <Grid container
                                direction="column"
                                style={{ height: '70%' }}
                                spacing={3}
                                >
                                    { loading ? 
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
                    </div>
                </Grid>
            <Modal
                open={openModal}
                onClose={() => handleToggleModal()}
                aria-labelledby="add-transaction"
            >
                {modalBody}
            </Modal>
            </Grid>
        </Grid>
    )
}
