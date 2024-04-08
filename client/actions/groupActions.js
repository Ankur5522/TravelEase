import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const baseURL = 'http://10.0.2.2:5000';

const axiosInstance = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const fetchGroups = createAsyncThunk("groups/fetchGroups", async () => {
    try {
        const response = await axiosInstance.get('/group/getGroups');
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
})

export const createGroup = createAsyncThunk("groups/createGroup", async (group) => {
    try {
        const response = await axiosInstance.post('/group/createGroup', group);
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
})

