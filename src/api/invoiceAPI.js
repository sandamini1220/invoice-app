import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/invoices';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Use instance for all API calls
export const getInvoices = () => axiosInstance.get('/');
export const getInvoiceById = (id) => axiosInstance.get(`/${id}`);
export const createInvoice = (data) => axiosInstance.post('/', data);
export const updateInvoice = (id, data) => axiosInstance.put(`/${id}`, data);
export const deleteInvoice = (id) => axiosInstance.delete(`/${id}`);
