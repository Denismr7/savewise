export interface TransactionForm {
    id?: number;
    categoryId: number | undefined;
    amount: number | undefined;
    date: string;
    description: string;
}