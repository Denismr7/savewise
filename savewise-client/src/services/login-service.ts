import { LoginData, LoginResponse } from "../common/login";

const apiUrl = process.env.REACT_APP_API_BASE_URL;
const baseUrl = `${apiUrl}/login`;

export function login(loginData: LoginData): Promise<LoginResponse> {
    const url = `${baseUrl}`;
    const body = JSON.stringify(loginData);
    const options: RequestInit = {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',    
            'Access-Control-Allow-Origin':'*',
        },
        body
    }
    return fetch(url, options).then(response =>
      response.json()
    );
  }