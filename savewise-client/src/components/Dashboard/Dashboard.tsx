import React, { useContext, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import "./Dashboard.scss"
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { LoginContext } from '../../common/context/LoginContext';
import { CategoryService } from '../../services/';
import { CategoriesResponse, Category } from '../../services/objects/categories';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SnackbarError } from '../../common/SnackbarHelpers';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { GetCategoriesInput } from '../../services/category-service';
import { CategoryTypesId } from '../../common/CategoryTypesId';

export default function Dashboard() {
    const {login} = useContext(LoginContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = React.useState<SnackbarError>({ hasErrors: false });

    useEffect(() => {
        getCategories(login.login?.id);
        return () => {
            
        }
    }, [login]);

    const getCategories = (userId?: number) => {
        setLoading(true);
        const categoriesOptions: GetCategoriesInput = {
            includeAmounts: false,
            startDate: '',
            endDate: ''
          }
        if (userId) {
            CategoryService.getCategories(userId, categoriesOptions).then((rsp: CategoriesResponse) => {
                if (rsp.status.success) {
                    setCategories(rsp.categories);
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
                spacing={1}
                key={category.id}
                >
                    <Typography variant="h4" component="h2" style={{ display: 'inline', marginLeft: '15px' }}>{ category.name }</Typography>
                    <Typography variant="h4" component="h2" style={{ display: 'inline', marginRight: '15px' }}>{ category.amount ? category.amount : 0 } €</Typography>
                </Grid>
            ))
        } else (<Typography variant="h4" component="h2" style={{ display: 'inline', marginLeft: '15px' }}>No categories to show</Typography>);
    };

    const handleCloseErrorModal = () => {
        setError({ hasErrors: false });
    }

    return (
        <Grid 
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={1}
            >
            <Grid item>
                <Typography variant="h2" component="h1" style={{ marginTop: '5%' }}>
                    Welcome back, { login.login?.name }
                </Typography>
            </Grid>
            <Grid container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={1}
            >
                <Grid item>
                    <div className="panel">
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
                                    : renderExpenses(categories.filter(c => c.categoryType.id === CategoryTypesId.Expenses))
                                }
                            </Grid>
                            <Link to="/categories">
                                <Button variant="contained" color="primary">
                                    Manage
                                </Button>
                            </Link>
                        </Grid>
                    </div>
                </Grid>
                <Grid item>
                    <div className="panel">
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
                                    : renderExpenses(categories.filter(c => c.categoryType.id === CategoryTypesId.Incomes)) 
                                }
                            </Grid>
                            <Link to="/categories">
                                <Button variant="contained" color="primary">
                                    Manage
                                </Button>
                            </Link>
                        </Grid>
                    </div>
                </Grid>
                <Grid item>
                    <div className="panel">
                        <Grid container
                            direction="column"
                            alignItems="center"
                            justify='space-between'
                            style={{ height: '95%' }}
                            >
                                <Typography variant="h4" style={{ marginTop: '5px', marginBottom: '20px' }} component="h2">
                                    Last transactions
                                </Typography>
                                <Grid container
                                direction="column"
                                style={{ height: '70%' }}
                                spacing={3}
                                >
                                    TODO: Transactions
                                </Grid>
                                <Link to="/transactions">
                                    <Button variant="contained" color="primary">
                                        Manage
                                    </Button>
                                </Link>
                            </Grid>
                    </div>
                </Grid>
            </Grid>
            <Snackbar open={error.hasErrors} autoHideDuration={6000} onClose={handleCloseErrorModal}>
                <Alert onClose={handleCloseErrorModal} severity="error">
                    { error.message }
                </Alert>
            </Snackbar>
        </Grid>
    )
}
