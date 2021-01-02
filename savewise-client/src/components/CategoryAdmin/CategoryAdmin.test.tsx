import React from 'react';
import { render, screen } from '@testing-library/react';
import { CategoryAdmin } from "./CategoryAdmin";

test('renders learn react link', () => {
  render(<CategoryAdmin />);
  const linkElement = screen.getByText(/CategoryAdmin works!/i);
  expect(linkElement).toBeInTheDocument();
});