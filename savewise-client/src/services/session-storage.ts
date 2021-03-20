import { User } from "../common/objects/user";

const loginKey: string = 'savewlogin';

export const setLogin = (login?: User) => {
    if (login) {
        const item: string = JSON.stringify(login);
        sessionStorage.setItem(loginKey, item);
    }
}

export const getLogin = (): User | null => {
    const item: string | null = sessionStorage.getItem(loginKey);
    if (item) {
        return JSON.parse(item) as User;
    } else {
        return null;
    }
}