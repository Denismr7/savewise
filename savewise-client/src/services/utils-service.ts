export function today(): string {
    const today: Date = new Date();
    return `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`
}

export function formatStringForInputDate(date: string) {
    const dateObj: Date = new Date(date);
    return `${dateObj.getFullYear()}/${dateObj.getMonth() + 1}/${dateObj.getDate()}`
}