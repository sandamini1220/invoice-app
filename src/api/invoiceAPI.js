import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/invoices';

export const getInvoices = () => axios.get(BASE_URL);
export const getInvoiceById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createInvoice = (data) => axios.post(BASE_URL, data);
export const updateInvoice = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteInvoice = (id) => axios.delete(`${BASE_URL}/${id}`);
