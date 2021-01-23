import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Category, CategoryResponse } from '../../services/objects/categories';
import { CategoryService } from "../../services";
import { LoginContext } from '../../common/context/LoginContext';
import Button from '@material-ui/core/Button';
import "./CategoryAdmin.scss";
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { SnackbarError, SnackbarSuccess } from '../../common/SnackbarHelpers';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Status } from '../../services/objects/response';

export function CategoryAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [error, setError] = React.useState<SnackbarError>({ hasErrors: false });
  const [saveSuccess, setSaveSuccess] = React.useState<SnackbarSuccess>({ success: false });
  const [loading, setLoading] = useState(true);
  const {login} = useContext(LoginContext);
  
  useEffect(() => {
    const id: number = login.login?.id as number;
    CategoryService.getCategories(id).then(rsp => {
      if (rsp.status.success) {
        setCategories(rsp.categories);
        setLoading(false);
      } else {
        console.log(`Error: ${rsp.status.errorMessage}`);
      }
    }).catch(e => {
      console.log(`ERROR: ${e}`);
    })
    return () => {
      setCategories([]);
    }
  }, [login]);

  const showCategories = (categories: Category[]) => {
    return categories.map(category => {
      return (
        <div className="categoryItem" key={category.id}>
          <p className="categoryName">{ category.name }</p>
          <div className="categoryItemButtons">
            <IconButton onClick={() => handleToggleModal(category.id, category.name)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleToggleDeleteModal(category.id, category.name)}>
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
        )
    })
  }

  const handleToggleModal = (selectedCategoryId?: number, categoryName?: string) => {
    if (selectedCategoryId) {
      setSelectedCategoryId(selectedCategoryId);
      if (categoryName) setNewCategoryName(categoryName);
    } else {
      setSelectedCategoryId(undefined);
      setNewCategoryName('');
    }
    setOpenModal(!openModal);
  }

  const handleToggleDeleteModal = (selectedCategoryId?: number, categoryName?: string) => {
    if (selectedCategoryId) {
      setSelectedCategoryId(selectedCategoryId);
      if (categoryName) setNewCategoryName(categoryName);
    } else {
      setSelectedCategoryId(undefined);
      setNewCategoryName('');
    }
    setOpenConfirmDelete(!openConfirmDelete);
  }

  const handleNewCategoryName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewCategoryName(event.currentTarget.value);
  }

  const handleSnackbarClose = (severity?: string) => {
    if (severity === 'error') {
      setError({ ...error, hasErrors: false });
    }
    else if (severity === 'success') {
      setSaveSuccess({ ...saveSuccess, success: false });
    }
  };

  const submitCategory = (categoryName: string, categoryId?: number) => {
    const category: Category = {
      name: categoryName,
      userId: login.login?.id,
      id: categoryId
    }

    if (!categoryId) {
      CategoryService.saveCategory(category).then((rsp: CategoryResponse) => {
        if (rsp.status.success) {
          handleToggleModal();
          setCategories([ ...categories, rsp.category ])
          setSaveSuccess({ success: true, message: `Category ${rsp.category.name} saved succesfully!` });
        } else {
          setError({ hasErrors: true, message: rsp.status.errorMessage });
        }
      })
    } else {
      CategoryService.editCategory(category).then((rsp: CategoryResponse) => {
        if (rsp.status.success) {
          handleToggleModal();
          setCategories(categories.map(cat => cat.id === category.id ? category : cat));
          setSaveSuccess({ success: true, message: `Category ${rsp.category.name} edited succesfully!` });
        } else {
          setError({ hasErrors: true, message: rsp.status.errorMessage });
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
          setSaveSuccess({ success: true, message: `Category ${newCategoryName} deleted succesfully!` });
        } else {
          setError({ hasErrors: true, message: rsp.errorMessage });
        }
      })
    }
  }

  const modalBody = (
    <div className="modalBg">
      { selectedCategoryId ? 
        (<h1 id="add-category">Edit category</h1>) 
        : 
        (<h1 id="add-category">Create category</h1>) 
      }
      <TextField 
                id="filled-basic"
                onChange={handleNewCategoryName} 
                label="Category Name" 
                variant="filled" 
                name="categoryName"
                value={newCategoryName}
                />
        <div className="buttonGroup">
          <Button variant="contained" color="primary" type="submit" onClick={() => submitCategory(newCategoryName, selectedCategoryId)}>
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
      <h1>Delete category { newCategoryName }</h1>
      <p>This is irreversible. All transactions will be lost</p>
      <Button variant="contained" color="secondary" type="submit" onClick={() => handleDeleteCategory(selectedCategoryId)}>
          Confirm
      </Button>
    </div>
  );

  return (
    <div className="componentBg">
      <div className="titleButton">
        <Button variant="contained" startIcon={<ArrowBackIosIcon />}>
          <Link to="/dashboard" color="inherit" style={{ textDecoration: 'none' }}>
            Dashboard
          </Link>
        </Button>
        <h1>Your categories</h1>
        <Button variant="contained" color="primary" type="submit" onClick={() => handleToggleModal()}>
          Add new
        </Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        { loading ? "Loading" : showCategories(categories) }
      </div>
      <Modal
        open={openModal}
        onClose={() => handleToggleModal()}
        aria-labelledby="add-category"
      >
        {modalBody}
      </Modal>
      <Modal
        open={openConfirmDelete}
        onClose={() => handleToggleDeleteModal()}
        aria-labelledby="delete-category"
      >
        {confirmDeleteBody}
      </Modal>
      <Snackbar open={saveSuccess.success} autoHideDuration={6000} onClose={() => handleSnackbarClose('success')}>
        <Alert onClose={() => handleSnackbarClose('success')} severity="success">
            { saveSuccess.message }
        </Alert>
      </Snackbar>
    </div>
  );
}