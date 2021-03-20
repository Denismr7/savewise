import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from './Login';
import { LoginData, LoginResponse } from '../../common/objects/login';
import { LoginService } from "../../services";
import { User } from '../../common/objects/user';

test('Should show labels for username and password', () => {
    // Arrange
    const usernameLabelText: string = 'Username *';
    const passwordLabelText: string = 'Password *';
    
    // Act
    render(<Login />);
    const userNameLabel = screen.getByLabelText(usernameLabelText);
    const passwordLabel = screen.getByLabelText(passwordLabelText);

    // Assert
    expect(userNameLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
});

test('Should show an error if loginData is incorrect and return the correct user otherwise', async () => {
    // Arrange
    const wrongLogin: LoginData = {
        userName: 'fake',
        password: 'fake'
    }
    const correctLogin: LoginData = {
        userName: 'correct',
        password: 'correct'
    }
    const user1: User = {
        name: 'Correct',
        login: 'correct',
        lastName: 'User',
        id: 1,
        password: 'correct'
    }
    const userDatabase: User[] = [user1];
    const mockLoginService = jest.spyOn(LoginService, "login");
    const mockLoginMethod = (login: LoginData): Promise<LoginResponse> => {
        const user: User | undefined = userDatabase.find(u => u.login === login.userName);
        if (user) {
            const matchPassword: boolean = user.password === login.password;
            if (matchPassword) {
                const response: LoginResponse = {
                    login: user,
                    status: {
                        success: true
                    }
                }
                return Promise.resolve(response);
            } else {
                const response: LoginResponse = {
                    status: {
                        success: false,
                        errorMessage: 'Incorrect password'
                    }
                }
                return Promise.resolve(response);
            }
        } else {
            const response: LoginResponse = {
                status: {
                    success: false,
                    errorMessage: 'User not found'
                }
            };
            return Promise.resolve(response);
        }
    }
    mockLoginService.mockImplementation(mockLoginMethod);
    
    // Act
    render(<Login />);
    const { status, login } = await LoginService.login(wrongLogin);
    const { status: correctStatus, login: correctLoginResponse } = await LoginService.login(correctLogin);

    // Assert
    
    // 1. Incorrect login
    expect(status.success).toEqual(false);
    expect(status.errorMessage).toBeTruthy();
    expect(status.errorMessage).toEqual('User not found');
    expect(login).toBeFalsy();

    // 2. Correct login
    expect(correctStatus.success).toEqual(true);
    expect(correctStatus.errorMessage).toBeFalsy();
    expect(correctLoginResponse).toEqual(user1);
});
