export interface SnackbarError {
    hasErrors: boolean,
    message?: string
}

export interface SnackbarSuccess {
    success: boolean,
    message?: string
}

export interface ISnackbarInfo {
    severity: "success" | "error" | undefined,
    message?: string
}