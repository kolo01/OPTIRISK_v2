import type { RegisterData } from "../../domains/interfaces/registerData.interface";
import type { ResetPasswordData } from "../../domains/interfaces/resetPassword";
import apiClient from "../apiservice";

const login = async (email: string, password: string) => {
    const response = await apiClient.post('/login/', { email, password })
    return response.data;
}

const register = async (data: RegisterData) => {
    const response = await apiClient.post('/users/', data)
    return response.data;
}

const active = async (token: string) => {
    const response = await apiClient.put('/active-account', { token: token })
    return response.data;
}

const demandToResetPassword = async (email: string) => {
    const response = await apiClient.post('/demand-to-reset-password', { email })
    return response.data;
}

const resetPassword = async (data:ResetPasswordData) => {
    const response = await apiClient.put('/reset-password',  data )
    return response.data;
}

const logout = () => {
    localStorage.clear();
    window.location.href = '/';
}

export const authService =  {
    login,
    register,
    active,
    demandToResetPassword,
    resetPassword,
    logout,
}