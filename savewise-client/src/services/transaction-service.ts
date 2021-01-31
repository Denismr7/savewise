import { Status } from "./objects/response";
import { Transaction, TransactionResponse, TransactionsResponse } from "./objects/transactions";

const apiUrl = process.env.REACT_APP_API_BASE_URL;
const baseUrl = `${apiUrl}/transactions`;

export function GetTransactions(userId: number, startDate?: string, endDate?: string, limit?: number): Promise<TransactionsResponse> {
    const url = `${baseUrl}/user/${userId}`;
    let queries: string;
    if (startDate && endDate) {
        queries = `?startDate=${startDate}&endDate=${endDate}`;
    } else {
        queries = `?limit=${limit ? limit : 5}`
    }
    const urlWithQuery = url + queries;

    return fetch(urlWithQuery).then(rsp => rsp.json());
}

export function SaveTransaction(transaction: Transaction): Promise<TransactionResponse> {
    const url = baseUrl;
    const body = JSON.stringify({...transaction, date: new Date(transaction.date)});
    const options: RequestInit = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',    
          'Access-Control-Allow-Origin':'*',
        },
        body
    };

    return fetch(url, options).then(r => r.json());
}

export function deleteTransaction(transactionId: number): Promise<Status> {
    if (!transactionId) return Promise.reject("Transaction id null");
    const url = `${baseUrl}/${transactionId}`;
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',    
        'Access-Control-Allow-Origin':'*',
      }
    };
    return fetch(url, options).then(r => r.json());
  }