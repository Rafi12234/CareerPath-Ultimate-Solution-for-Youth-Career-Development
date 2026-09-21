import { createContext, useContext, useMemo, useState } from 'react';
import api from '../utils/api';

const CompanyContext = createContext(null);

const safeParse = (value) => {
  try { return JSON.parse(value || 'null'); } catch { return null; }
};

export function CompanyProvider({ children }) {
  const [companyUser, setCompanyUser] = useState(() => safeParse(localStorage.getItem('company_user')));
  const [company, setCompany] = useState(() => safeParse(localStorage.getItem('company_profile')));

  const persist = (userData, companyData, token) => {
    if (token) localStorage.setItem('company_token', token);
    if (userData) localStorage.setItem('company_user', JSON.stringify(userData));
    if (companyData) localStorage.setItem('company_profile', JSON.stringify(companyData));
    setCompanyUser(userData || null);
    setCompany(companyData || null);
  };

  const login = async (email, password) => {
    const res = await api.post('/company/login', { email, password });
    persist(res.data.user, res.data.company, res.data.token);
    return res.data;
  };

  const register = async (payload) => {
    const res = await api.post('/company/register', payload);
    persist(res.data.user, res.data.company, res.data.token);
    return res.data;
  };

  const refresh = async () => {
    const res = await api.get('/company/me', { skipCache: true });
    persist(res.data.user, res.data.company);
    return res.data;
  };

  const logout = async () => {
    try { await api.post('/company/logout'); } catch { /* local logout still applies */ }
    localStorage.removeItem('company_token');
    localStorage.removeItem('company_user');
    localStorage.removeItem('company_profile');
    setCompanyUser(null);
    setCompany(null);
  };

  const value = useMemo(() => ({ companyUser, company, login, register, refresh, logout, persist }), [companyUser, company]);
  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export const useCompany = () => useContext(CompanyContext);
