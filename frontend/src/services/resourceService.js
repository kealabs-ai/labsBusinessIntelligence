import axios from 'axios';
import { getAuthToken } from './authService';
import { env } from '../utils/envManager';

const API_URL = `http://72.60.140.128:6002/api/v1/resources`;

export const getAllResources = async () => {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getResourceById = async (id) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createResource = async (resourceData) => {
    const token = getAuthToken();
    console.log('Creating resource with data:', resourceData);
    const response = await axios.post(`${API_URL}/`, resourceData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Create response:', response.data);
    return response.data;
};

export const updateResource = async (id, resourceData) => {
    const token = getAuthToken();
    console.log('Updating resource ID:', id, 'with data:', resourceData);
    const response = await axios.post(`${API_URL}/${id}`, resourceData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Update response:', response.data);
    return response.data;
};

export const deleteResource = async (id) => {
    const token = getAuthToken();
    await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getResourcesByType = async (type) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/type/${type}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};