import { BasicResponse } from "./response";
import { User } from "./user";

export interface LoginData {
    userName: string,
    password: string
}

export interface LoginResponse extends BasicResponse {
    login?: User;
}