import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Category } from "../../common/objects/categories";
import { Transaction } from "../../common/objects/transactions";
import { LoginContext } from "../../common/context/LoginContext";
import { GetCategoriesInput } from "../../services/category-service";
import {
    CategoryService,
    TransactionService,
    UtilService,
} from "../../services";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import styles from "./TransactionAdmin.module.scss";
import Select from "@material-ui/core/Select";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Status } from "../../common/objects/response";
import { TransactionForm } from "../../common/objects/Transaction";
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import { SnackbarContext } from "../../common/context/SnackbarContext";

interface SearchByDates {
    fromDate: string,
    toDate: string
}

export default function TransactionAdmin() {
    const { login } = useContext(LoginContext);
    const { setSnackbarInfo } = useContext(SnackbarContext);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
    const [transactionForm, setTransactionForm] = useState<TransactionForm>({
        categoryId: undefined,
        amount: undefined,
        date: UtilService.today(),
        description: "",
    });
    const [loading, setLoading] = useState(true);
    const [userCategories, setUserCategories] = useState<Category[]>([]);
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [searchForm, setSearchForm] = useState<SearchByDates>({ fromDate: UtilService.today(), toDate: UtilService.tomorrow() });

    useEffect(() => {
        const id: number = login.login?.id as number;
        const categoriesOptions: GetCategoriesInput = {
            includeAmounts: false,
            startDate: "",
            endDate: "",
        };
        CategoryService.getCategories(id, categoriesOptions)
            .then((rsp) => {
                if (rsp.status.success) {
                    setUserCategories(rsp.categories);
                } else {
                    console.log(`Error: ${rsp.status.errorMessage}`);
                }
            })
            .catch((e) => console.log(`ERROR: ${e}`));

        TransactionService.GetTransactions(id, undefined, undefined, 10)
            .then((rsp) => {
                if (rsp.status.success) {
                    setTransactions(rsp.transactions);
                    setLoading(false);
                } else {
                    console.log(`Error: ${rsp.status.errorMessage}`);
                }
            })
            .catch((e) => console.log(`ERROR: ${e}`));

        return () => {
            setUserCategories([]);
        };
    }, [login]);

    const renderTransactions = (transactions: Transaction[]) => {
        return transactions.map((transaction) => {
            return (
                <div className={styles.transactionItem} key={transaction.id}>
                    <p className={styles.transactionDesc}>{transaction.description}</p>
                    <div>
                        <span className={styles.date}>{UtilService.formatDateString(transaction.date)}</span>
                        <IconButton size="small" onClick={() => handleToggleModal(transaction)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleToggleDeleteModal(transaction)}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </div>
            );
        });
    };

    const renderSearch = () => {
        return (
            <>
                <KeyboardDatePicker
                    inputVariant="outlined"
                    margin="normal"
                    id="date-picker-dialog"
                    label="From"
                    format="dd/MM/yyyy"
                    value={UtilService.formatStringDatePicker(searchForm.fromDate)}
                    onChange={(_, value) => handleSearchDateChange(value, 'fromDate')}
                    KeyboardButtonProps={{
                        "aria-label": "to date",
                    }}
                />
                <KeyboardDatePicker
                    inputVariant="outlined"
                    margin="normal"
                    id="date-picker-dialog"
                    label="To"
                    format="dd/MM/yyyy"
                    value={UtilService.formatStringDatePicker(searchForm.toDate)}
                    onChange={(_, value) => handleSearchDateChange(value, 'toDate')}
                    KeyboardButtonProps={{
                        "aria-label": "from date",
                    }}
                    style={{ marginTop: "10px" }}
                />
                <IconButton onClick={handleSubmitSearch} disabled={disableSearch()}>
                    <SearchIcon />
                </IconButton>
                <IconButton onClick={() => setShowSearch(false)}>
                    <CancelIcon />
                </IconButton>
            </>
        );
    };

    const disableSearch = (): boolean => {
        if (searchForm.fromDate && searchForm.toDate) {
            let fromDate = new Date(searchForm.fromDate);
            let toDate = new Date(searchForm.toDate);
            return fromDate > toDate;
        } else {
            return true;
        }
    }

    const handleSearchDateChange = (date: string | null | undefined, name: 'fromDate' | 'toDate') => {
        if (date) {
            setSearchForm({ ...searchForm, [name]: date });
        }
    }

    const handleSubmitSearch = async () => {
        if (login.login?.id) {
            try {
                const { status, transactions } = await TransactionService.GetTransactions(login.login?.id, searchForm.fromDate, searchForm.toDate);
                if (status.success) {
                    setTransactions(transactions);
                } else {
                    setSnackbarInfo({ severity: "error", message: status.errorMessage });
                }
            } catch (error) {
                setSnackbarInfo({ severity: "error", message: error });
            }
        }
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
                description: "",
            });
        }
        setOpenModal(!openModal);
    };

    const handleToggleDeleteModal = (transaction?: Transaction) => {
        if (transaction) {
            setTransactionForm({
                id: transaction.id,
                categoryId: transaction.category.id,
                amount: transaction.amount,
                date: transaction.date,
                description: transaction.description,
            });
        }
        setOpenConfirmDelete(!openConfirmDelete);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === "amount") {
            setTransactionForm({
                ...transactionForm,
                [event.target.name]: Number(event.target.value),
            });
        } else {
            setTransactionForm({
                ...transactionForm,
                [event.target.name]: event.target.value,
            });
        }
    };

    const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setTransactionForm({
            ...transactionForm,
            categoryId: event.target.value as number,
        });
    };

    const handleDateChange = (date: Date | null) => {
        setTransactionForm({
            ...transactionForm,
            date: date ? UtilService.formatDate(date) : "",
        });
    };

    const renderUserCategories = (userCategories: Category[]) => {
        if (userCategories.length) {
            return userCategories.map((category) => {
                return (
                    <MenuItem key={category.id} value={category.id}>
                        {category.name}
                    </MenuItem>
                );
            });
        }
    };

    const onSave = () => {
        const transaction: Transaction = {
            userId: login.login?.id as number,
            category: userCategories.find(
                (c) => c.id === transactionForm.categoryId
            ) as Category,
            amount: transactionForm.amount as number,
            date: transactionForm.date,
            description: transactionForm.description,
            id: transactionForm.id,
        };
        TransactionService.SaveTransaction(transaction)
            .then((rsp) => {
                if (rsp.status.success) {
                    handleToggleModal();
                    if (transactions.find((t) => t.id === rsp.transaction.id)) {
                        setTransactions(
                            transactions.map((t) =>
                                t.id === rsp.transaction.id ? rsp.transaction : t
                            )
                        );
                    } else {
                        setTransactions([...transactions, rsp.transaction]);
                    }
                } else {
                    setSnackbarInfo({ severity: "error", message: rsp.status.errorMessage });
                }
            })
            .catch((e) => setSnackbarInfo({ severity: "error", message: e }));
    };

    const onConfirmDelete = () => {
        if (transactionForm.id) {
            TransactionService.deleteTransaction(transactionForm.id)
                .then((rsp: Status) => {
                    if (rsp.success) {
                        handleToggleDeleteModal();
                        setTransactions(
                            transactions.filter((t) => t.id !== transactionForm.id)
                        );
                        setSnackbarInfo({ severity: "success", message: `Transaction ${transactionForm.description} deleted succesfully!` });
                    } else {
                        setSnackbarInfo({ severity: "error", message: rsp.errorMessage });
                    }
                })
                .catch((e) => setSnackbarInfo({ severity: "error", message: e }));
        }
    };

    const modalBody = (
        <div className={styles.modalBg}>
            {transactionForm.id ? 
            (<h1 className="titleColor">Edit transaction</h1>) 
            : 
            (<h1 className="titleColor">Create transaction</h1>)}
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
                value={transactionForm.amount ? transactionForm.amount : ""}
                style={{ marginTop: "10px" }}
                placeholder="€"
                fullWidth
            />
            <FormControl
                style={{ marginTop: "10px" }}
                variant="outlined"
                fullWidth
            >
                <InputLabel id="category">Category</InputLabel>
                <Select
                    labelId="category"
                    id="categorySelect"
                    value={transactionForm.categoryId ? transactionForm.categoryId : ""}
                    onChange={handleSelectChange}
                >
                    {renderUserCategories(userCategories)}
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
                    "aria-label": "change date",
                }}
                style={{ marginTop: "10px" }}
                fullWidth
            />
            <div className={styles.buttonGroup}>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={onSave}
                >
                    Save
                </Button>
            </div>
        </div>
    );

    const confirmDeleteBody = (
        <div className={styles.modalBg}>
            <h1>Delete transaction {transactionForm.description}</h1>
            <p>This is irreversible. Are you sure?</p>
            <Button
                variant="contained"
                color="secondary"
                type="submit"
                onClick={onConfirmDelete}
            >
                Confirm
            </Button>
        </div>
    );

    const renderHeader = () => {
        return (
            <>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <ArrowBackIosIcon />
                </Link>
                <h1 className="titleColor">Last transactions</h1>
                <Button
                    variant="outlined"
                    color="primary"
                    type="submit"
                    onClick={() => handleToggleModal()}
                >
                    Add new
                </Button>
                <IconButton onClick={() => setShowSearch(true)}>
                    <SearchIcon />
                </IconButton>
            </>
        );
    }

    return (
        <div className="componentBg">
            <div className="componentHeader">
                {showSearch ? renderSearch() : renderHeader()}
            </div>
            {loading ? "Loading" : 
                (<div className={styles.transactionsContainer}>
                        {renderTransactions(transactions)}
                </div>)
            }
            <Modal
                open={openModal}
                onClose={() => handleToggleModal()}
                aria-labelledby="add-transaction"
            >
                {modalBody}
            </Modal>
            <Modal
                open={openConfirmDelete}
                onClose={() => handleToggleDeleteModal()}
                aria-labelledby="delete-transaction"
            >
                {confirmDeleteBody}
            </Modal>
        </div>
    );
}
