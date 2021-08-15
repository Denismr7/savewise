import React from 'react';
import styles from './DashboardPanel.module.scss';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import PanelItem from '../PanelItem/PanelItem';
import { IPanelItem } from '../../common/objects/IPanelItem';
import { constants } from '../../common/objects/constants';

interface DashboardPanelProps {
    panelTitle: string,
    panelItems: IPanelItem[],
    loading: boolean
    buttonText?: string
}

export default function DashboardPanel({ panelTitle, panelItems, loading, buttonText }: DashboardPanelProps) {

    const itemsRenderer = (items: IPanelItem[]) => {
        if (items.length) {
            return items.map(item => (
                <PanelItem key={item.id} item={item} />
            ))
        } else (<Typography variant="h6" component="h2" style={{ display: 'inline', marginLeft: '15px' }}>No data to show</Typography>);
    };

    return (
        <div className={styles.panel}>
                        <Grid container
                        direction="column"
                        justify='space-between'
                        style={{ height: '95%' }}
                        >
                            <Typography variant="h5" component="h2" className="panelTitle">
                                { panelTitle.toUpperCase() }
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
                            <Link to={constants.routes.categories}>
                                <Button variant="outlined" color="primary">
                                    { buttonText ? buttonText : "Manage" }
                                </Button>
                            </Link>
                        </Grid>
                    </div>
    )
}
