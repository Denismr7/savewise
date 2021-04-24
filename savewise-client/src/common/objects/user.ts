import { BasicResponse } from "./response";

export interface User {
    id: number,
    login: string,
    name: string,
    lastName: string,
    password?: string
}

export interface UserInput {
    user: User;
}

export interface UserResponse extends BasicResponse {
    user: User;
}