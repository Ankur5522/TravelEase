import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = 'https://travelease-iq3g.onrender.com';

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
        console.log(response);
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

export const fetchUserDetails = async (userId) => {
    try {
        const response = await axiosInstance.get(`user/fetchUser/${userId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const settleAmount = async ({receiverId, transactionId}) => {
    try {
        const response = await axiosInstance.post(`user/settleAmount`, {receiverId, transactionId});
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const enterUpi = async ({upi, userId}) => {
    try {
        const response = await axiosInstance.post(`user/enterUpi`, {upi, userId});
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
