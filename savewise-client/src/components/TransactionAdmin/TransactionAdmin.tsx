import React, { useContext, useEffect, useState } from "react";
import { Transaction, TransactionForm } from "../../common/objects/transactions";
import { LoginContext } from "../../common/context/LoginContext";
import {
    TransactionService,
    UtilService,
} from "../../services";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import styles from "./TransactionAdmin.module.scss";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Status } from "../../common/objects/response";
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import { SnackbarContext } from "../../common/context/SnackbarContext";
import { constants } from "../../common/objects/constants";
import { CategoryTypesId } from "../../common/objects/CategoryTypesId";
import TransactionModal from "../TransactionModal/TransactionModal";

interface SearchByDates {
    fromDate: string,
    toDate: string
}

export default function TransactionAdmin() {
    const { login } = useContext(LoginContext);
    const { setSnackbarInfo } = useContext(SnackbarContext);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
    const [transactionForm, setTransactionForm] = useState<TransactionForm>({
        categoryId: undefined,
        amount: undefined,
        date: UtilService.today(),
        description: "",
    });
    const [loading, setLoading] = useState(true);
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [searchForm, setSearchForm] = useState<SearchByDates>({ fromDate: UtilService.today(), toDate: UtilService.tomorrow() });

    useEffect(() => {
        const id: number = login.login?.id as number;
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

        };
    }, [login]);

    const renderTransactions = (transactions: Transaction[]) => {
        return transactions.map((transaction) => {
            const isIncome = transaction.category.categoryType?.id === CategoryTypesId.Incomes ? true : false; 
            const symbol: string = isIncome ? "+" : "-";
            const color = isIncome ? 'incomeGreenColor' : 'regularColor';
            return (
                <div className={styles.transactionItem} key={transaction.id}>
                    <p className={styles.transactionName}>{transaction.description}</p>
                    <span className={`${styles.transactionAmount} ${color}`}>
                       { symbol } { transaction.amount } { constants.currency } 
                    </span>
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
        setSelectedTransaction(transaction);
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

    const onSave = (savedTransaction: Transaction) => {
        let updatedTransactions: Transaction[];
        if (transactions.find((t) => t.id === savedTransaction.id)) {
            updatedTransactions = transactions.map((t) => t.id === savedTransaction.id ? savedTransaction : t);
        } else {
            updatedTransactions = [...transactions, savedTransaction];
        }
        const sortedTransactions = UtilService.sortTransactionByDate(updatedTransactions);
        setTransactions(sortedTransactions);
    };

    const onConfirmDelete = () => {
        if (transactionForm.id) {
            TransactionService.deleteTransaction(transactionForm.id)
                .then((rsp: Status) => {
                    if (rsp.success) {
                        handleToggleDeleteModal();
                        setTransactions(
                            UtilService.sortTransactionByDate(transactions.filter((t) => t.id !== transactionForm.id))
                        );
                        setSnackbarInfo({ severity: "success", message: `Transaction ${transactionForm.description} deleted succesfully!` });
                    } else {
                        setSnackbarInfo({ severity: "error", message: rsp.errorMessage });
                    }
                })
                .catch((e) => setSnackbarInfo({ severity: "error", message: e }));
        }
    };

    const confirmDeleteBody = (
        <div className="modalBg">
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
            <TransactionModal conditionToShow={openModal} transaction={selectedTransaction}
             handleVisibility={() => setOpenModal(!openModal)} handleSave={(t: Transaction) => onSave(t)} />
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
