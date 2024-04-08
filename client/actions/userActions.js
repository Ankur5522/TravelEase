import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = 'http://10.0.2.2:5000';

const axiosInstance = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const loginUser = createAsyncThunk('user/login', async (userData) => {
    try {
        const response = await axiosInstance.post('user/login', userData);
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error('Failed to log in');
        }
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
});

export const checkUser = async (phoneNumber) => {
    try {
        const response = await axiosInstance.post('user/checkUser', phoneNumber);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const signupUser = createAsyncThunk('user/signup', async (userData) => {
    try {
        const response = await axiosInstance.post('user/signup', userData);
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
});
