import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Category, CategoryResponse } from '../../services/objects/categories';
import { CategoryService } from "../../services";
import { LoginContext } from '../../common/context/LoginContext';
import Button from '@material-ui/core/Button';
import "./CategoryAdmin.scss";
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import { saveCategory } from '../../services/category-service';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { SnackbarError, SnackbarSuccess } from '../../common/SnackbarHelpers';



export function CategoryAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
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
      return <p className={`category${category.id}`} key={category.id}>{ category.name }</p>
    })
  }

  const handleToggleModal = () => {
    setOpenModal(!openModal);
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

  const submitCategory = (categoryName: string) => {
    const category: Category = {
      name: categoryName,
      userId: login.login?.id
    }

    saveCategory(category).then((rsp: CategoryResponse) => {
      if (rsp.status.success) {
        handleToggleModal();
        setCategories([ ...categories, rsp.category ])
        setSaveSuccess({ success: true, message: `Category ${rsp.category.name} saved succesfully!` });
      } else {
        setError({ hasErrors: true, message: rsp.status.errorMessage });
      }
    })
  }

  const modalBody = (
    <div className="modalBg">
      <h1 id="add-category">Create category</h1>
      <TextField 
                id="filled-basic"
                onChange={handleNewCategoryName} 
                label="Category Name" 
                variant="filled" 
                name="categoryName"
                />
        <div className="buttonGroup">
          <Button variant="contained" color="primary" type="submit" onClick={() => submitCategory(newCategoryName)}>
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

  return (
    <div className="componentBg">
      <div className="titleButton">
        <h1>Your categories</h1>
        <Button variant="contained" color="primary" type="submit" onClick={handleToggleModal}>
          Add new
        </Button>
      </div>
      { loading ? "Loading" : showCategories(categories) }
      <Modal
        open={openModal}
        onClose={handleToggleModal}
        aria-labelledby="add-category"
      >
        {modalBody}
      </Modal>
      <Snackbar open={saveSuccess.success} autoHideDuration={6000} onClose={() => handleSnackbarClose('success')}>
        <Alert onClose={() => handleSnackbarClose('success')} severity="success">
            { saveSuccess.message }
        </Alert>
      </Snackbar>
    </div>
  );
}