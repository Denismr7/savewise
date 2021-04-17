import moment from "moment";
import { Category } from "../common/objects/categories";
import { constants } from "../common/objects/constants";
import { Transaction } from "../common/objects/transactions";

export function today(): string {
    return moment().format(constants.dateFormats.date);
}

export function tomorrow(): string {
    return moment().add(1, "day").format(constants.dateFormats.date);
}

export function lastDayMonthDate(month: number, year: number): string {
    const d = new Date(year, month, 0);
    const asString = formatDate(d);
    return asString;
}

export function toDate(dateAsString: string): Date {
    return moment(dateAsString, constants.dateFormats.fullDate).toDate();
}

export function formatStringDatePicker(date: string): string {
    const d = date.split("/");
    const day = d[0];
    const month = d[1];
    const year = d[2];
    return `${month}/${day}/${year}`;
}

export function formatDateString(string: string): string {
    return string.substr(0, 10);
}

export function formatDate(date: Date): string {
    return moment(date).format(constants.dateFormats.date);
}

export function firstDayDate(monthNumber: number, year: number): string {
    const month = monthNumber < 10 ? `0${monthNumber}` : monthNumber;
    return `01/${month}/${year}`;
}

export function sortCategoriesByAmount(categories: Category[]): Category[] {
    return categories.sort((a, b) => {
        if (a.amount && b.amount) {
            return b.amount - a.amount
        } else if (!a.amount && b.amount) {
            return b.amount - 0;
        } else if (a.amount && !b.amount){
            return 0 - a.amount;
        } else {
            return 0
        }
    });
}

export function sortTransactionByDate(transactions: Transaction[]): Transaction[] {
    return transactions.sort((a, b) => {
        const first = toDate(a.date).getTime();
        const second = toDate(b.date).getTime();
        if (second === first) {
            return Number(b.id) - Number(a.id);
        }
        return second - first;
    });
}

export function currentMonth(monthNumber: number): string {
    const string = `${monthNumber}/01/2021`;
    return moment(string).format("MMMM");
}