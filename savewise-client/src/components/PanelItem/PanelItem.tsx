import React from 'react'
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import styles from './PanelItem.module.scss';
import { IPanelItem } from '../../common/objects/IPanelItem';
import { constants } from '../../common/objects/constants';

interface IPanelItemProps {
    item: IPanelItem;
    symbol?: string;
    incomesColor?: any;
}

export default function PanelItem({ item, symbol, incomesColor }: IPanelItemProps) {
    return (
        <Grid item
                container
                direction="row"
                justify="space-between"
                spacing={0}
                key={item.id}
                >
                    <Typography variant="h6" component="h2" className={styles.itemName}>{ item.name }</Typography>
                    <Typography variant="h6" component="h2" className={`${styles.itemAmount} ${incomesColor ? incomesColor : undefined}`}>
                        { symbol ? symbol : undefined } { item.amount ? item.amount : 0 } {constants.currency}
                    </Typography>
        </Grid>
    )
}
