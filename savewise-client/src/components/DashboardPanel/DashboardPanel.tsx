import React from 'react';
import styles from './DashboardPanel.module.scss';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

interface DashboardPanelProps {
    panelTitle: string,
    panelItems: PanelItem[],
    loading: boolean
    buttonText?: string
}

interface PanelItem {
    id?: number,
    name: string,
    amount?: number
}

export default function DashboardPanel({ panelTitle, panelItems, loading, buttonText }: DashboardPanelProps) {

    const itemsRenderer = (items: PanelItem[]) => {
        if (items.length) {
            return items.map(item => (
                <Grid item
                container
                direction="row"
                justify="space-between"
                spacing={0}
                key={item.id}
                >
                    <Typography variant="h6" component="h2" style={{ display: 'inline', fontSize: '1rem', marginLeft: '15px' }}>{ item.name }</Typography>
                    <Typography variant="h6" component="h2" style={{ display: 'inline', fontSize: '1rem', marginRight: '15px' }}>{ item.amount ? item.amount : 0 } €</Typography>
                </Grid>
            ))
        } else (<Typography variant="h6" component="h2" style={{ display: 'inline', marginLeft: '15px' }}>No data to show</Typography>);
    };

    return (
        <div className={styles.panel}>
                        <Grid container
                        direction="column"
                        alignItems="center"
                        justify='space-between'
                        style={{ height: '95%' }}
                        >
                            <Typography variant="h5" style={{ marginTop: '5px', marginBottom: '20px' }} component="h2">
                                { panelTitle }
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
                                        {itemsRenderer(panelItems)}
                                    </div>)
                                }
                            </Grid>
                            <Link to="/categories">
                                <Button variant="outlined" color="primary">
                                    { buttonText ? buttonText : "Manage" }
                                </Button>
                            </Link>
                        </Grid>
                    </div>
    )
}
