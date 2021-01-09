import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from './Login';

test('Should show labels for username and password', () => {
    // Arrange
    const usernameLabelText: string = 'Username';
    const passwordLabelText: string = 'Password';
    
    // Act
    render(<Login />);
    const userNameLabel = screen.getByLabelText(usernameLabelText);
    const passwordLabel = screen.getByLabelText(passwordLabelText);

    // Assert
    expect(userNameLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
});
