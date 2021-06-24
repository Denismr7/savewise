import { BasicResponse } from "./response";

interface DataByMonth {
    month: number;
}

export interface MonthInformation extends DataByMonth {
    incomes: number;
    expenses: number;
}

export interface MonthsInformationResponse extends BasicResponse {
    monthsInformation: MonthInformation[];
}

export interface VaultMonthlyAmount extends DataByMonth {
    amount: number;
}

export interface VaultMonthlyAmountResponse extends BasicResponse {
    vaultInformation: VaultMonthlyAmount[];
}