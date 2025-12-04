import axios from 'axios';
import { getAuthToken } from './authService';
import { env } from '../utils/envManager';

const API_URL = `${env.apiBaseUrl}/caixa`;

export const getAllCashRegisters = async () => {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/cash-registers`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getCashRegisterById = async (id) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/cash-registers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createCashRegister = async (cashRegisterData) => {
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/cash-registers`, cashRegisterData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateCashRegister = async (id, cashRegisterData) => {
    const token = getAuthToken();
    const response = await axios.put(`${API_URL}/cash-registers/${id}`, cashRegisterData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteCashRegister = async (id) => {
    const token = getAuthToken();
    await axios.delete(`${API_URL}/cash-registers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getTransactionsFromCashRegister = async (cashRegisterId) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/cash-registers/${cashRegisterId}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const addTransaction = async (transactionData) => {
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/transactions`, transactionData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteTransaction = async (id) => {
    const token = getAuthToken();
    await axios.delete(`${API_URL}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Backward compatibility exports
export const getAllCaixas = getAllCashRegisters;
export const getCaixaById = getCashRegisterById;
export const createCaixa = createCashRegister;
export const updateCaixa = updateCashRegister;
export const deleteCaixa = deleteCashRegister;
export const getTransacoesFromCaixa = getTransactionsFromCashRegister;
export const addTransacao = addTransaction;
export const deleteTransacao = deleteTransaction;
