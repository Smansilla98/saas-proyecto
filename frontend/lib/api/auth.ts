import { apiClient } from './client';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'docente' | 'alumno';
  sede?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/login', {
      email,
      password,
    });
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get<User>('/me');
    return response.data;
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },
};

