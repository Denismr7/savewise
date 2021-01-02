import { CategoriesResponse, Category, CategoryResponse } from "./objects/categories";

const apiUrl = process.env.REACT_APP_API_BASE_URL;
const baseUrl = `${apiUrl}/categories`;

export function getCategories(userId: number): Promise<CategoriesResponse> {
    const url = `${baseUrl}/user/${userId}`
    return fetch(url).then(response =>
      response.json()
    );
  }

export function saveCategory(category: Category): Promise<CategoryResponse> {
    const url = baseUrl;
    const body = JSON.stringify(category);
    const options: RequestInit = {
        method: 'POST',
        body
    };
    return fetch(url, options).then(r => r.json());
}