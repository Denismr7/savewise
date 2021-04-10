import { BasicResponse } from "../common/objects/response";
import { UserInput, UserResponse } from "../common/objects/user";

const apiUrl = process.env.REACT_APP_API_BASE_URL;
const baseUrl = `${apiUrl}/user`;

export function createUser(request: UserInput): Promise<BasicResponse> {
    const url = `${baseUrl}`;
    const body = JSON.stringify(request);
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

export function editUser(request: UserInput): Promise<UserResponse> {
    const url = `${baseUrl}`;
    const body = JSON.stringify(request);
    const options: RequestInit = {
        method: 'PATCH',
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