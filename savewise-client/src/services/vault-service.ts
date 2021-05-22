import { VaultsResponse } from "../common/objects/vault";

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