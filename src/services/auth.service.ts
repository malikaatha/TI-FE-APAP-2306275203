import axios from 'axios';

const SSO_URL = import.meta.env.VITE_SSO_AUTH_URL;

export const login = () => {
  const returnUrl = window.location.origin + '/auth/ott';
  window.location.href = `${SSO_URL}/api/auth/sso/authorize?returnUrl=${returnUrl}`;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = `${SSO_URL}/api/auth/logout`;
};

export const exchangeTicket = async (ticket: string) => {
  const response = await axios.post(`${SSO_URL}/api/auth/sso/exchange?ticket=${ticket}`);
  return response.data;
};
