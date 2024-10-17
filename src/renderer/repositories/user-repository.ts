import axios from 'axios';
import { MD5 } from 'crypto-js';
import { IUserProfile } from '../interfaces';

const TOKEN_STORAGE_KEY = 'token';

export const login = async (username: string, password: string): Promise<{ access_token: string }> => {
  const data = {
    account: username,
    password,
  };

  const { data: { data: { token } } } = await axios.request({
    url: '/api/auth:signIn',
    method: 'POST',
    data,
  });
  setToken(token);

  return token;
}

export const logout = () => {
  setToken();
}

export const getProfile = async (): Promise<IUserProfile> => {
  const { data: { data: profile } } = await axios.request({
    url: '/api/auth:check',
    method: 'GET',
  });
  return { id: profile.id, name: profile.nickname, email: profile.email, phone: profile.phone } as any;
}

export const refreshToken = async () => {
  const access_token = localStorage.getItem('token');
  if (!access_token) {
    return;
  }

  const res = await axios.request({
    url: '/api/auth/refresh',
    method: 'POST',
    data: {
      access_token,
    },
  });

  setToken(res.data.access_token);

  return res.data;
}

export const getToken = () => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export const setToken = (token?: string) => {
  if (!token) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return;
  }
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}