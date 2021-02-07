import moment from "moment";

export function today(): string {
    return moment().format("DD/MM/YYYY");
}

export function formatString(date: string): string {
    return moment(date).format("DD/MM/YYYY");
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