import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });


export const fetchInvoices   = () => API.get('/invoices');
export const getInvoices     = fetchInvoices;   
export const getInvoiceById  = (id) => API.get(`/invoices/${id}`);
export const createInvoice   = (data) => API.post('/invoices', data);
export const updateInvoice   = (id, data) => API.put(`/invoices/${id}`, data);
export const deleteInvoice   = (id) => API.delete(`/invoices/${id}`);
