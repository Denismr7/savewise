import { BasicResponse } from "./response";

export interface MonthInformation {
    month: number;
    incomes: number;
    expenses: number;
}

export interface MonthsInformationResponse extends BasicResponse {
    monthsInformation: MonthInformation[];
}