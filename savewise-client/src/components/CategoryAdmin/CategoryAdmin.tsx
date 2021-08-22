import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Category, CategoryResponse } from '../../common/objects/categories';
import { CategoryService } from "../../services";
import { LoginContext } from '../../common/context/LoginContext';
import Button from '@material-ui/core/Button';
import styles from "./CategoryAdmin.module.scss";
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Status } from '../../common/objects/response';
import { GetCategoriesInput } from '../../services/category-service';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Entity } from '../../common/objects/Entity';
import { SnackbarContext } from '../../common/context/SnackbarContext';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import { constants } from '../../common/objects/constants';

interface categoryForm {
  categoryName: string,
  categoryType: number | undefined
}

export function CategoryAdmin() {
    const {login} = useContext(LoginContext);
    const { setSnackbarInfo } = useContext(SnackbarContext);

    const [categories, setCategories] = useState<Category[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
    const [categoryForm, setCategoryForm] = useState<categoryForm>({ categoryName: '', categoryType: 0 });
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [categoryTypesList, setCategoryTypesList] = useState<Entity[]>([]);
  
    useEffect(() => {
        const id: number = login.login?.id as number;
        const categoriesOptions: GetCategoriesInput = {
            includeAmounts: false,
            startDate: '',
            endDate: ''
        }
        CategoryService.getCategories(id, categoriesOptions).then(rsp => {
            if (rsp.status.success) {
                setCategories(rsp.categories);
                setLoading(false);
            } else {
                console.log(`Error: ${rsp.status.errorMessage}`);
            }
        }).catch(e => console.log(`ERROR: ${e}`));

        CategoryService.getCategoryTypes().then(rsp => {
            if (rsp.status.success) {
                setCategoryTypesList(rsp.categoryTypes);
            } else {
                console.log(`ERROR: ${rsp.status.errorMessage}`);
            }
        }).catch(e => console.log(`ERROR: ${e}`));
        return () => {
            setCategories([]);
        }
    }, [login]);

    const showCategories = (categories: Category[]) => {
        return categories.map(category => {
            return (
                <div className={styles.categoryItem} key={category.id}>
                    <p className={styles.categoryName}>{category.name}</p>
                    <div>
                        <IconButton size="small" onClick={() => handleToggleModal(category.id, { categoryName: category.name, categoryType: category.categoryType.id })}>
                            <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleToggleDeleteModal(category.id, { categoryName: category.name, categoryType: category.categoryType.id })}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </div>
            )
        })
    }

    const handleToggleModal = (selectedCategoryId?: number, categoryForm?: categoryForm) => {
        if (selectedCategoryId) {
            setSelectedCategoryId(selectedCategoryId);
            if (categoryForm) setCategoryForm(categoryForm);
        } else {
            setSelectedCategoryId(undefined);
            setCategoryForm({ categoryName: '', categoryType: undefined });
        }
        setOpenModal(!openModal);
    }

    const handleToggleDeleteModal = (selectedCategoryId?: number, categoryForm?: categoryForm) => {
        if (selectedCategoryId) {
            setSelectedCategoryId(selectedCategoryId);
            if (categoryForm) setCategoryForm(categoryForm);
        } else {
            setSelectedCategoryId(undefined);
            setCategoryForm({ categoryName: '', categoryType: undefined });
        }
        setOpenConfirmDelete(!openConfirmDelete);
    }

    const handleNewCategoryName = (event: ChangeEvent<HTMLInputElement>) => {
        setCategoryForm({ ...categoryForm, categoryName: event.currentTarget.value });
    }

    const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCategoryForm({ ...categoryForm, categoryType: event.target.value as number });
    }

    const submitCategory = (categoryForm: categoryForm, categoryId?: number) => {
        const category: Category = {
            name: categoryForm.categoryName,
            userId: login.login?.id,
            id: categoryId,
            categoryType: {
                id: categoryForm.categoryType
            }
        }

        if (!categoryId) {
            CategoryService.saveCategory(category).then((rsp: CategoryResponse) => {
                if (rsp.status.success) {
                    handleToggleModal();
                    setCategories([...categories, rsp.category])
                    setSnackbarInfo({ severity: "success", message: `Category ${rsp.category.name} saved succesfully!` });
                } else {
                    setSnackbarInfo({ severity: "error", message: rsp.status.errorMessage });
                }
            })
        } else {
            CategoryService.editCategory(category).then((rsp: CategoryResponse) => {
                if (rsp.status.success) {
                    handleToggleModal();
                    setCategories(categories.map(cat => cat.id === category.id ? category : cat));
                    setSnackbarInfo({ severity: "success", message: `Category ${rsp.category.name} edited succesfully!` });
                } else {
                    setSnackbarInfo({ severity: "error", message: rsp.status.errorMessage });
                }
            })
        }

    }

    const handleDeleteCategory = (categoryId?: number) => {
        if (categoryId) {
            CategoryService.deleteCategory(categoryId).then((rsp: Status) => {
                if (rsp.success) {
                    handleToggleDeleteModal();
                    setCategories(categories.filter(cat => cat.id !== categoryId));
                    setSnackbarInfo({ severity: "success", message: `Category ${categoryForm.categoryName} deleted succesfully!` });
                } else {
                    setSnackbarInfo({ severity: "error", message: rsp.errorMessage });
                }
            })
        }
    }

    const renderCategoryTypes = (categoryTypesList: Entity[]) => {
        if (categoryTypesList.length) {
            return categoryTypesList.map(type => {
                return (
                    <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                );
            })
        }
    }

  const modalBody = (
    <>
      <TextField 
                id="filled-basic"
                onChange={handleNewCategoryName} 
                label="Category Name" 
                variant="outlined" 
                name="categoryName"
                value={categoryForm.categoryName}
                fullWidth
                />
      <FormControl style={{ marginTop: '10px' }} variant='filled' fullWidth>
        <InputLabel id="categoryType">Type</InputLabel>
        <Select
          variant="outlined"
          labelId="categoryType"
          id="categoryTypeSelect"
          value={categoryForm.categoryType ? categoryForm.categoryType : ''}
          onChange={handleTypeChange}
        >
          { renderCategoryTypes(categoryTypesList) }
        </Select>
      </FormControl>
    </>
  );

  return (
    <div className="componentBg">
        <div className="componentHeader">
            <Link to={constants.routes.dashboard} style={{ textDecoration: 'none' }}>
                <ArrowBackIosIcon />
            </Link>
            <h1 className="titleColor">Your categories</h1>
            <Button variant="outlined" color="primary" type="submit" onClick={() => handleToggleModal()}>
                Add new
            </Button>
        </div>
        { loading ? 
            "Loading" 
            : 
            (<div className={styles.categoriesContainer}>
                {showCategories(categories)}
            </div>)
        }
        <Dialog open={openModal} onClose={() => handleToggleModal()} aria-labelledby="add-category">
            <DialogTitle id="add-category-title">
                {selectedCategoryId ?
                    'Edit category'
                    :
                    'Create category'
                }
            </DialogTitle>
            <DialogContent>
                {modalBody}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => submitCategory(categoryForm, selectedCategoryId)} color="primary" variant="contained">
                    Save
                </Button>
                <Button onClick={() => handleToggleModal()} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog open={openConfirmDelete} onClose={() => handleToggleDeleteModal()} aria-labelledby="delete-category">
            <DialogTitle id="delete-category-title">
                Delete category { categoryForm.categoryName }
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This is irreversible. Are you sure?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleDeleteCategory(selectedCategoryId)} color="primary" variant="contained">
                    Confirm
                </Button>
                <Button onClick={() => handleToggleDeleteModal()} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    </div>
  );
}