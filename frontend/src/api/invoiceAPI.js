import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/invoices';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Use instance for all API calls
export const getInvoices = () => axiosInstance.get('/');
export const getInvoiceById = (id) => axiosInstance.get(`/${id}`);
export const createInvoice = (data) => axiosInstance.post('/', data);
export const updateInvoice = (id, data) => axiosInstance.put(`/${id}`, data);
export const deleteInvoice = (id) => axiosInstance.delete(`/${id}`);
