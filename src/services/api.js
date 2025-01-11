import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api";

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const loginUser = async (data) => {
    try {
        const response = await api.post('/users/login', data);
        if (response.data.role) {
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('username', response.data.username);
        }
        return response;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await api.post('/users/logout');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
    } catch (error) {
        console.error('Logout error:', error);
        // Clear local storage even if the request fails
        localStorage.clear();
        throw error;
    }
};

export const registerUser = (data) => api.post('/users/register', data);

export const fetchTableData = (endpoint) => api.get(`/${endpoint}`);

export const deleteRecord = (endpoint, id) => api.delete(`/${endpoint}/${id}`);

export const updateRecord = (endpoint, id, data) => api.put(`/${endpoint}/${id}`, data);

export const fetchUnapprovedUsers = async () => {
    try {
        const username = localStorage.getItem('username'); // Get username from localStorage
        if (!username) {
            throw new Error('Username not found in localStorage.');
        }

        const response = await api.get('/users/unapproved', {
            headers: {
                username, // Send username in headers
            },
        });

        return response;
    } catch (error) {
        console.error('Error fetching unapproved users:', error.response?.data || error.message);
        throw error;
    }
};

export const approveOrDenyUser = async (userId, action) => {
    try {
        const username = localStorage.getItem('username'); // Ensure username is available
        if (!username) {
            throw new Error('Username not found in localStorage.');
        }

        const response = await api.post(`/users/${userId}/approve-deny`,
            { action },
            {
                headers: {
                    username, // Pass username in headers
                },
            }
        );

        return response;
    } catch (error) {
        console.error('Error in approveOrDenyUser:', error.response?.data || error.message);
        throw error;
    }
};

export const fetchOrderRegistry = () => api.get('/orders-registry');

export const updateOrderRegistry = (orderNumber, data) =>
    api.put(`/orders-registry/${orderNumber}`, data);

export const deleteOrderRegistry = (orderNumber) =>
    api.delete(`/orders-registry/${orderNumber}`);

// Tech Card API Endpoints

export const fetchTechCards = () => api.get('/tech-cards/combined');

export const fetchTechCardByOrderNumber = (orderNumber) =>
    api.get(`/tech-cards/combined/${orderNumber}`);

export const updateTechCard = (orderNumber, data) =>
    api.put(`/tech-cards/combined/${orderNumber}`, data);

export const deleteTechCard = (orderNumber) =>
    api.delete(`/tech-cards/combined/${orderNumber}`);