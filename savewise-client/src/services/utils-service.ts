import moment from "moment";
import { Category } from "./objects/categories";

export function today(): string {
    return moment().format("DD/MM/YYYY");
}

export function tomorrow(): string {
    return moment().add(1, "day").format("DD/MM/YYYY");
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
    return moment(date).format("DD/MM/YYYY");
}

export function firstDayDate(): string {
    const monthNumber = new Date().getMonth() + 1;
    const month = monthNumber < 10 ? `0${monthNumber}` : monthNumber;
    const year = new Date().getFullYear();
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