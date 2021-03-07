import React, { useContext, useEffect, useState, ChangeEvent } from 'react';
import Grid from '@material-ui/core/Grid';
import styles from "./Dashboard.module.scss";
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { LoginContext } from '../../common/context/LoginContext';
import { CategoryService, TransactionService, UtilService } from '../../services/';
import { CategoriesResponse, Category } from '../../services/objects/categories';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SnackbarError, SnackbarSuccess } from '../../common/SnackbarHelpers';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { GetCategoriesInput } from '../../services/category-service';
import { CategoryTypesId } from '../../common/CategoryTypesId';
import { Transaction } from '../../services/objects/transactions';
import { TransactionForm } from '../../common/Transaction';
import Modal from "@material-ui/core/Modal";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from '@material-ui/core/Select';
import { KeyboardDatePicker } from '@material-ui/pickers';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

export default function Dashboard() {
    const {login} = useContext(LoginContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = React.useState<SnackbarError>({ hasErrors: false });
    const [saveSuccess, setSaveSuccess] = React.useState<SnackbarSuccess>({success: false,});
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [transactionForm, setTransactionForm] = useState<TransactionForm>({
        categoryId: undefined,
        amount: undefined,
        date: UtilService.today(),
        description: "",
    });
    const [actualMonth, setActualMonth] = useState<string>('');

    useEffect(() => {
        const userId = login.login?.id;
        setActualMonth(UtilService.currentMonth());
        getCategories(userId);
        getTransactions(userId);
        return () => {
            
        }
    }, [login]);

    const getCategories = (userId?: number) => {
        setLoading(true);
        const categoriesOptions: GetCategoriesInput = {
            includeAmounts: true,
            startDate: UtilService.firstDayDate(),
            endDate: UtilService.today()
          }
        if (userId) {
            CategoryService.getCategories(userId, categoriesOptions).then((rsp: CategoriesResponse) => {
                if (rsp.status.success) {
                    const sortedByAmount = UtilService.sortCategoriesByAmount(rsp.categories);
                    setCategories(sortedByAmount);
                    setLoading(false);
                } else {
                    setError({ hasErrors: true, message: rsp.status.errorMessage });
                    setLoading(false);
                }
            }).catch(e => {
                setError({ hasErrors: true, message: e });
                setLoading(false);
            })
        }
    }

    const getTransactions = (userId?: number) => {
        setLoading(true);
        if (userId) {
            TransactionService.GetTransactions(userId).then(rsp => {
                if (rsp.status.success) {
                    setTransactions(rsp.transactions);
                    setLoading(false);
                } else {
                    setError({ hasErrors: true, message: rsp.status.errorMessage });
                    setLoading(false);
                }
            }).catch(e => {
                setError({ hasErrors: true, message: e });
                setLoading(false);
            })
        }
    }
    
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

    const renderTransactions = (transactions: Transaction[]) =>  {
        if (transactions.length) {
            const sortedByDate = transactions.sort((a, b) => Number(b.id) - Number(a.id));
            return sortedByDate.map(t => (
                <Grid item
                container
                direction="row"
                justify="space-between"
                spacing={0}
                key={t.id}
                >
                    <Typography variant="h6" component="h2" style={{ display: 'inline', marginLeft: '15px' }}>{ t.description }</Typography>
                    <Typography variant="h6" component="h2" style={{ display: 'inline', marginRight: '15px' }}>{ t.amount ? t.amount : 0 } €</Typography>
                </Grid>
            ))
        } else (<Typography variant="h6" component="h2" style={{ display: 'inline', marginLeft: '15px' }}>No transactions to show</Typography>);
    }

    const handleCloseErrorModal = () => {
        setError({ hasErrors: false });
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

    const handleSnackbarClose = (severity?: string) => {
        if (severity === "error") {
            setError({ ...error, hasErrors: false });
        } else if (severity === "success") {
            setSaveSuccess({ ...saveSuccess, success: false });
        }
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
                getCategories(login.login?.id);
            } else {
                setError({ hasErrors: true, message: rsp.status.errorMessage })
            }
        }).catch(e => setError({ hasErrors: true, message: e }));
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
            <Snackbar open={error.hasErrors} autoHideDuration={6000} onClose={() => handleSnackbarClose('error')}>
                <Alert onClose={() => handleSnackbarClose('error')} severity="error">
                    { error.message }
                </Alert>
            </Snackbar>
        </div>
    );

    const renderMonth = () => (
        <>
            <Typography variant="h3" component="h2" style={{ marginBottom: '5%' }}>
                    { actualMonth }
            </Typography>
        </>
    )

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
                </Typography>
            </Grid>
            <Grid item>
                { renderMonth() }
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
            <Snackbar open={error.hasErrors} autoHideDuration={6000} onClose={handleCloseErrorModal}>
                <Alert onClose={handleCloseErrorModal} severity="error">
                    { error.message }
                </Alert>
            </Snackbar>
            <Snackbar
                open={saveSuccess.success}
                autoHideDuration={6000}
                onClose={() => handleSnackbarClose("success")}
            >
                <Alert
                    onClose={() => handleSnackbarClose("success")}
                    severity="success"
                >
                    {saveSuccess.message}
                </Alert>
            </Snackbar>
        </Grid>
    )
}
