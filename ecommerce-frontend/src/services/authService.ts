import api from './api';

export const login = (email: string, password: string) =>
  api.post('/users/login', { email, password });

export const register = (data: any) =>
  api.post('/users/register', data);

export const getProfile = () =>
  api.get('/users/profile'); 