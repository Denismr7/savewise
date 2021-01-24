import { Category } from "./categories";
import { BasicResponse } from "./response";

export interface Transaction {
    id?: number;
    userId: number;
    category: Category;
    amount: number;
    date: Date;
    description: string;
}

export interface TransactionResponse extends BasicResponse {
    transaction: Transaction;
}

export interface TransactionsResponse extends BasicResponse {
    transactions: Transaction[];
}