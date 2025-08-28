import axios from 'axios';
import keycloak from '../KeycloakService';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Ensure token fresh before each request
API.interceptors.request.use(async (config) => {
  if (keycloak?.token) {
    try { await keycloak.updateToken(30); } catch (e) { /* ignore */ }
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});

export const fetchInvoices   = () => API.get('/invoices');
export const getInvoices     = fetchInvoices;   
export const getInvoiceById  = (id) => API.get(`/invoices/${id}`);
export const createInvoice   = (data) => API.post('/invoices', data);
export const updateInvoice   = (id, data) => API.put(`/invoices/${id}`, data);
export const deleteInvoice   = (id) => API.delete(`/invoices/${id}`);
