import React, { useContext } from 'react';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackbarContext } from '../../common/context/SnackbarContext';

export default function SnackbarComponent() {
    const { snackbarInfo, setSnackbarInfo } = useContext(SnackbarContext);
    const autoHideDuration = 5000;

    const handleSnackbarClose = () => {
        setSnackbarInfo({ ...snackbarInfo, severity: undefined })
    };

    return (
        <>
            <Snackbar open={snackbarInfo.severity === "success"} autoHideDuration={autoHideDuration} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    { snackbarInfo.message }
                </Alert>
            </Snackbar>
            <Snackbar open={snackbarInfo.severity === "error"} autoHideDuration={autoHideDuration} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error">
                    { snackbarInfo.message }
                </Alert>
            </Snackbar>
        </>
    )
}
