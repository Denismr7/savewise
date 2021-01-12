import React from 'react';
import Grid from '@material-ui/core/Grid';
import "./Dashboard.scss"

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
                <div className="panel">
                    
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
    )
}
