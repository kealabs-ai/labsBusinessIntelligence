import axios from 'axios';
import { getAuthToken } from './authService';
import { env } from '../utils/envManager';

const API_URL = `${env.apiBaseUrl}/caixa`;

export const getAllCaixas = async () => {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/caixas`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getCaixaById = async (id) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/caixas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createCaixa = async (caixaData) => {
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/caixas`, caixaData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateCaixa = async (id, caixaData) => {
    const token = getAuthToken();
    const response = await axios.put(`${API_URL}/caixas/${id}`, caixaData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteCaixa = async (id) => {
    const token = getAuthToken();
    await axios.delete(`${API_URL}/caixas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getTransacoesFromCaixa = async (caixaId) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/caixas/${caixaId}/transacoes`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const addTransacao = async (transacaoData) => {
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/transacoes`, transacaoData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteTransacao = async (id) => {
    const token = getAuthToken();
    await axios.delete(`${API_URL}/transacoes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
