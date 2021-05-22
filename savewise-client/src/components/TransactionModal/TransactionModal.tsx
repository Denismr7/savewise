import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import Modal from "@material-ui/core/Modal";
import { CategoryService, TransactionService, UtilService } from '../../services';
import { Transaction, TransactionForm } from '../../common/objects/transactions';
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import { KeyboardDatePicker } from "@material-ui/pickers";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import { Category } from '../../common/objects/categories';
import { SnackbarContext } from "../../common/context/SnackbarContext";
import { LoginContext } from "../../common/context/LoginContext";
import { GetCategoriesInput } from '../../services/category-service';

export interface ITransactionModalProps {
    conditionToShow: boolean;
    handleVisibility: () => void;
    handleSave: (t: Transaction) => void;
}

export default function TransactionModal({ conditionToShow, handleVisibility, handleSave }: ITransactionModalProps) {
    const [transactionForm, setTransactionForm] = useState<TransactionForm>({
        categoryId: undefined,
        amount: undefined,
        date: UtilService.today(),
        description: "",
    });
    const [userCategories, setUserCategories] = useState<Category[]>([]);
    const { setSnackbarInfo } = useContext(SnackbarContext);
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
            })
            .catch((e) => console.log(`ERROR: ${e}`));
        return () => {
            
        }
    }, [login])

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
        handleVisibility();
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
                    handleSave(rsp.transaction);
                    setSnackbarInfo({ severity: "success", message: "Transaction saved successfully!" })
                } else {
                    setSnackbarInfo({ severity: "error", message: rsp.status.errorMessage });
                }
            })
            .catch((e) => setSnackbarInfo({ severity: "error", message: e }));
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

    const modalBody = (
        <div className="modalBg">
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
            <div className="buttonGroupModal">
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

    return (
        <Modal
                open={conditionToShow}
                onClose={() => handleToggleModal()}
                aria-labelledby="add-transaction"
            >
                {modalBody}
        </Modal>
    )
}
