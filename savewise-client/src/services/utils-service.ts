export function today(): string {
    const today: Date = new Date();
    return `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`
}

export function formatStringForInputDate(date: string) {
    const dateObj: Date = new Date(date);
    return `${dateObj.getFullYear()}/${dateObj.getMonth() + 1}/${dateObj.getDate()}`
}

export function firstDayDate() {
    const monthNumber = new Date().getMonth() + 1;
    const month = monthNumber < 10 ? `0${monthNumber}` : monthNumber;
    const year = new Date().getFullYear();
    return `01/${month}/${year}`;
}