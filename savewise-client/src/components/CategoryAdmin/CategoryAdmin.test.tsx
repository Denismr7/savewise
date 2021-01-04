import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { CategoryAdmin } from "./CategoryAdmin";
import { CategoriesResponse, Category } from '../../services/objects/categories';
import { CategoryService } from "../../services/";

const mockCategory: Category = {
  id: 1,
  name: 'Mock category'
};
const mockCategories: Category[] = [mockCategory];
const mockResponse: CategoriesResponse = {
  categories: mockCategories,
  status: {
    success: true,
    errorMessage: ''
  }
}

test('Show loading text when component starts', () => {
  // Arrange

  // Act
  render(<CategoryAdmin />);
  
  //Assert
  const mockCategoryName = screen.getByText(/Loading/i);
  expect(mockCategoryName).toBeInTheDocument();
});

test('Show mock category fetched from API', async () => {
  // Arrange
  jest.spyOn(CategoryService, 'getCategories').mockResolvedValue(mockResponse);

  // Act
  render(<CategoryAdmin />);

  // Assert
  await waitFor(() => expect(screen.getByText(/Mock category/i)).toBeInTheDocument());
});