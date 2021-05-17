import { Category } from "./categories";
import { BasicResponse } from "./response";

export interface Transaction {
    id?: number;
    userId: number;
    category: Category;
    amount: number;
    date: string;
    description: string;
    vaultId?: number;
}

export interface TransactionResponse extends BasicResponse {
    transaction: Transaction;
}

export interface TransactionsResponse extends BasicResponse {
    transactions: Transaction[];
}

export interface TransactionForm {
    id?: number;
    categoryId: number | undefined;
    amount: number | undefined;
    date: string;
    description: string;
}