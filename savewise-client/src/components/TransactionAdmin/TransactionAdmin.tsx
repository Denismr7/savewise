import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { SnackbarError, SnackbarSuccess } from "../../common/SnackbarHelpers";
import { Category } from "../../services/objects/categories";
import { Transaction } from "../../services/objects/transactions";
import { LoginContext } from "../../common/context/LoginContext";
import { GetCategoriesInput } from "../../services/category-service";
import { CategoryService, TransactionService, UtilService } from "../../services";
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
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import "./TransactionAdmin.scss";
import Select from '@material-ui/core/Select';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Status } from "../../services/objects/response";
import { TransactionForm } from "../../common/Transaction";

export default function TransactionAdmin() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
    const [transactionForm, setTransactionForm] = useState<TransactionForm>({
        categoryId: undefined,
        amount: undefined,
        date: UtilService.today(),
        description: "",
    });
    const [error, setError] = React.useState<SnackbarError>({ hasErrors: false });
    const [saveSuccess, setSaveSuccess] = React.useState<SnackbarSuccess>({success: false});
    const [loading, setLoading] = useState(true);
    const [userCategories, setUserCategories] = useState<Category[]>([]);
    const { login } = useContext(LoginContext);

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
            }).catch((e) => console.log(`ERROR: ${e}`));

        TransactionService.GetTransactions(id, undefined, undefined, 10).then(rsp => {
            if (rsp.status.success) {
                setTransactions(rsp.transactions);
                setLoading(false);
            } else {
                console.log(`Error: ${rsp.status.errorMessage}`);
            }
        }).catch((e) => console.log(`ERROR: ${e}`));

        return () => {
            setUserCategories([]);
        };
    }, [login]);

    const renderTransactions = (transactions: Transaction[]) => {
        return transactions.map((transaction) => {
            return (
                <div className="transactionItem" key={transaction.id}>
                    <p className="transactionDesc">{transaction.description}</p>
                    <p>{ UtilService.formatString(transaction.date) }</p>
                    <div className="transactionItemButtons">
                        <IconButton onClick={() => handleToggleModal(transaction)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleToggleDeleteModal(transaction)}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </div>
            );
        });
    };

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

    const handleToggleDeleteModal = (transaction?: Transaction) => {
        if (transaction) {
            setTransactionForm({
                id: transaction.id,
                categoryId: transaction.category.id,
                amount: transaction.amount,
                date: UtilService.formatString(transaction.date),
                description: transaction.description,
            });
        }
        setOpenConfirmDelete(!openConfirmDelete);
    };

    const handleSnackbarClose = (severity?: string) => {
        if (severity === "error") {
            setError({ ...error, hasErrors: false });
        } else if (severity === "success") {
            setSaveSuccess({ ...saveSuccess, success: false });
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'amount') {
            setTransactionForm({...transactionForm, [event.target.name]: parseInt(event.target.value)});
        } else {
            setTransactionForm({...transactionForm, [event.target.name]: event.target.value});
        }
    }

    const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
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
            category: userCategories.find(c => c.id === transactionForm.categoryId) as Category,
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
            } else {
                setError({ hasErrors: true, message: rsp.status.errorMessage })
            }
        }).catch(e => setError({ hasErrors: true, message: e }));
    }

    const onConfirmDelete = () => {
        if (transactionForm.id) {
            TransactionService.deleteTransaction(transactionForm.id).then((rsp: Status) => {
                if (rsp.success) {
                  handleToggleDeleteModal();
                  setTransactions(transactions.filter(t => t.id !== transactionForm.id));
                  setSaveSuccess({ success: true, message: `Category ${transactionForm.description} deleted succesfully!` });
                } else {
                  setError({ hasErrors: true, message: rsp.errorMessage });
                }
              }).catch(e => setError({ hasErrors: true, message: e }))
        }
    }

    const modalBody = (
        <div className="modalBg">
          { transactionForm.id ? 
            (<h1 id="add-transaction">Edit transaction</h1>) 
            : 
            (<h1 id="add-transaction">Create transaction</h1>) 
          }
          <TextField 
                    id="filled-basic"
                    onChange={handleInputChange} 
                    label="Transaction Name" 
                    variant="filled" 
                    name="description"
                    value={transactionForm.description}
                    />
          <TextField 
                    id="filled-basic"
                    onChange={handleInputChange} 
                    label="Amount (€)" 
                    variant="filled" 
                    name="amount"
                    type="number"
                    value={transactionForm.amount ? transactionForm.amount : ''}
                    style={{ marginTop: '10px' }}
                    placeholder="€"
                    />
          <FormControl style={{ width: '225px', marginTop: '10px' }} variant='filled'>
            <InputLabel id="category">Category</InputLabel>
            <Select
              labelId="category"
              id="categorySelect"
              value={transactionForm.categoryId ? transactionForm.categoryId : ''}
              onChange={handleSelectChange}
            >
              { renderUserCategories(userCategories) }
            </Select>
          </FormControl>
        <KeyboardDatePicker
            inputVariant="filled"
            margin="normal"
            id="date-picker-dialog"
            label="Date"
            format="dd/MM/yyyy"
            value={UtilService.formatString(transactionForm.date)}
            onChange={handleDateChange}
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }}
            style={{ marginTop: '10px', width: '225px' }}
        />
            <div className="buttonGroup">
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

      const confirmDeleteBody = (
        <div className="modalBg">
          <h1>Delete transaction { transactionForm.description }</h1>
          <p>This is irreversible. Are you sure?</p>
          <Button variant="contained" color="secondary" type="submit" onClick={onConfirmDelete}>
              Confirm
          </Button>
        </div>
      );

    return (
        <div className="componentBg">
            <div className="titleButton">
                <Button variant="contained" startIcon={<ArrowBackIosIcon />}>
                    <Link
                        to="/dashboard"
                        color="inherit"
                        style={{ textDecoration: "none" }}
                    >
                        Dashboard
          </Link>
                </Button>
                <h1>Last transactions</h1>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={() => handleToggleModal()}
                >
                    Add new
        </Button>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {loading ? "Loading" : renderTransactions(transactions)}
            </div>
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
        </div>
    );
}
