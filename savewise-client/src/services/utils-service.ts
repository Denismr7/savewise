import moment from "moment";

export function today(): string {
    return moment().format("DD/MM/YYYY");
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