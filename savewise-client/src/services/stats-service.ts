import { MonthsInformationResponse } from "../common/objects/stats";

const apiUrl = process.env.REACT_APP_API_BASE_URL;
const baseUrl = `${apiUrl}/stats`;

export function getMonthIncomeExpenses(userId: number, year: number): Promise<MonthsInformationResponse> {
    if (!userId) return Promise.reject("User id null");
    if (!year) return Promise.reject("Year is null");
    const url = `${baseUrl}/user/${userId}/year-by-month/${year}`;
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