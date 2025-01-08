import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api";

export const registerUser = (data) => axios.post(`${API_URL}/users/register`, data);
export const loginUser = (data) => axios.post(`${API_URL}/users/login`, data);
export const fetchTableData = (endpoint) => axios.get(`${API_URL}/${endpoint}`);
export const deleteRecord = (endpoint, id) => axios.delete(`${API_URL}/${endpoint}/${id}`);
export const updateRecord = (endpoint, id, data) =>
    axios.put(`${API_URL}/${endpoint}/${id}`, data);