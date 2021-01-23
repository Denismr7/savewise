import { BasicResponse } from "./response";

export interface Category {
    id?: number;
    name: string;
    userId?: number;
    amount?: number;
}

export interface CategoryResponse extends BasicResponse {
    category: Category;
}

export interface CategoriesResponse extends BasicResponse {
    categories: Category[];
}