import React from 'react';
import Grid from '@material-ui/core/Grid';
import "./Dashboard.scss"
import { Typography } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    return (
        <Grid 
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={1}
            >
            <Grid item>
                <Typography variant="h2" component="h1">
                    Welcome back
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
                                Categories
                            <IconButton color='primary'>
                                <Link to="/categories">
                                    <AddBoxIcon></AddBoxIcon>
                                </Link>
                            </IconButton>
                            </Typography>
                            <Grid container
                            direction="column"
                            style={{ height: '70%' }}
                            spacing={3}
                            >       
                                <Grid item
                                container
                                direction="row"
                                justify="space-between"
                                spacing={1}
                                >
                                    <Typography variant="h4" component="h2" style={{ display: 'inline', marginLeft: '15px' }}>Cat 1</Typography>
                                    <Typography variant="h4" component="h2" style={{ display: 'inline', marginRight: '15px' }}>100 €</Typography>
                                </Grid>
                                <Grid item
                                container
                                direction="row"
                                justify="space-between"
                                spacing={1}
                                >
                                    <Typography variant="h4" component="h2" style={{ display: 'inline', marginLeft: '15px' }}>Cat 2</Typography>
                                    <Typography variant="h4" component="h2" style={{ display: 'inline', marginRight: '15px' }}>95 €</Typography>
                                </Grid>
                                <Grid item
                                container
                                direction="row"
                                justify="space-between"
                                spacing={1}
                                >
                                    <Typography variant="h4" component="h2" style={{ display: 'inline', marginLeft: '15px' }}>Cat 3</Typography>
                                    <Typography variant="h4" component="h2" style={{ display: 'inline', marginRight: '15px' }}>60 €</Typography>
                                </Grid>
                            </Grid>
                            <Button variant="contained" color="primary">
                                View all
                            </Button>
                        </Grid>
                    </div>
                </Grid>
                <Grid item>
                    <div className="panel">

                    </div>
                </Grid>
                <Grid item>
                    <div className="panel">

                    </div>
                </Grid>
            </Grid>
        </Grid>
    )
}
