export interface Status {
    success: boolean;
    errorMessage: string;
}

export interface BasicResponse {
    status: Status;
}