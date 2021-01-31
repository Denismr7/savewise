import { Entity } from "../../common/Entity";
import { BasicResponse } from "./response";

export interface Category {
    id?: number;
    name: string;
    userId?: number;
    amount?: number;
    categoryType: Entity;
}

export interface CategoryResponse extends BasicResponse {
    category: Category;
}

export interface CategoriesResponse extends BasicResponse {
    categories: Category[];
}

export interface CategoryTypesResponse extends BasicResponse{
    categoryTypes: Entity[];
}