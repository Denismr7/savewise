import { BasicResponse } from "../common/objects/response";
import { Vault, VaultResponse, VaultsResponse } from "../common/objects/vault";

const apiUrl = process.env.REACT_APP_API_BASE_URL;
const baseUrl = `${apiUrl}/vaults`;

export function getUserVaults(userId: number): Promise<VaultsResponse> {
    if (!userId) return Promise.reject("User id null");
    const url = `${baseUrl}/user/${userId}`;
    const options: RequestInit = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',    
        'Access-Control-Allow-Origin':'*',
      }
    };
    return fetch(url, options).then(response =>
      response.json()
    );
}

export function saveVault(vault: Vault): Promise<VaultResponse> {
    if (!vault) return Promise.reject("Vault null");

    const url = `${baseUrl}`;
    const body = JSON.stringify(vault);
    const options: RequestInit = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',    
          'Access-Control-Allow-Origin':'*',
        },
        body
    };

    return fetch(url, options).then(response => response.json());
}

export function deleteVault(vaultId: number): Promise<BasicResponse> {
    if (!vaultId) return Promise.reject("Vault null");

    const url = `${baseUrl}/${vaultId}`;
    const options: RequestInit = {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',    
          'Access-Control-Allow-Origin':'*',
        }
    };

    return fetch(url, options).then(response => response.json());
}