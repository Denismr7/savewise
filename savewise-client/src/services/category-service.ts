import { CategoriesResponse, Category, CategoryResponse } from "./objects/categories";
import { Status } from "./objects/response";

const apiUrl = process.env.REACT_APP_API_BASE_URL;
const baseUrl = `${apiUrl}/categories`;

export function getCategories(userId: number): Promise<CategoriesResponse> {
    if (!userId) return Promise.reject("User id null");
    const url = `${baseUrl}/user/${userId}`
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