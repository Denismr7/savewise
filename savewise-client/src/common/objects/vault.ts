import { BasicResponse } from "./response";

export interface Vault {
    id?: number;
    name: string;
    userId: number;
    amount: number;
}

export interface VaultsResponse extends BasicResponse {
    vaults: Vault[];
}

export interface IVaultForm {
    name: string;
    amount: number;
}