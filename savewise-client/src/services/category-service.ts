import { CategoriesResponse, Category, CategoryResponse, CategoryTypesResponse } from "../common/objects/categories";
import { Status } from "../common/objects/response";

const apiUrl = process.env.REACT_APP_API_BASE_URL;
const baseUrl = `${apiUrl}/categories`;

export interface GetCategoriesInput {
  includeAmounts: boolean,
  startDate: string,
  endDate: string,
  categoryTypeId?: number
}

export function getCategories(userId: number, searchOptions: GetCategoriesInput): Promise<CategoriesResponse> {
    if (!userId) return Promise.reject("User id null");
    const url = `${baseUrl}/user/${userId}`;
    const body = JSON.stringify(searchOptions);
    const options: RequestInit = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',    
        'Access-Control-Allow-Origin':'*',
      },
      body
    };
    return fetch(url, options).then(response =>
      response.json()
    );
  }

export function getCategoryTypes(): Promise<CategoryTypesResponse> {
    const url = `${baseUrl}/types`;
    return fetch(url).then(response =>
      response.json()
    );
  }

export function saveCategory(category: Category): Promise<CategoryResponse> {
  if (!category) return Promise.reject("Category null");
    const url = baseUrl;
    const body = JSON.stringify(category);
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

export function editCategory(category: Category): Promise<CategoryResponse> {
  if (!category || !category.id) return Promise.reject("Category or category.id null");
  const url = `${baseUrl}/${category.id}`;
  const body = JSON.stringify(category);
  const options: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',    
      'Access-Control-Allow-Origin':'*',
    },
    body
  };
  return fetch(url, options).then(r => r.json());
}

export function deleteCategory(categoryId: number): Promise<Status> {
  if (!categoryId) return Promise.reject("Category id null");
  const url = `${baseUrl}/${categoryId}`;
  const options: RequestInit = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',    
      'Access-Control-Allow-Origin':'*',
    }
  };
  return fetch(url, options).then(r => r.json());
}