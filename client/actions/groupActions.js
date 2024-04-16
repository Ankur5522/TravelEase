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
        throw error.response ? error.response.data : error.message;
    }
})

export const createGroup = createAsyncThunk("groups/createGroup", async (group) => {
    try {
        const response = await axiosInstance.post('/group/createGroup', group);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
})

export const deleteGroup = createAsyncThunk("groups/deleteGroup", async (id) => {
    try {
        const response = await axiosInstance.delete(`/group/deleteGroup/${id}`,);
        if(response.data?.message) {
            return id;
        }
        return;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
})

export const addMemberToGroup = createAsyncThunk("groups/addMemberToGroup", async ({ groupId, userId }) => {
    try {
        const response = await axiosInstance.post(`/group/addUserToGroup/${groupId}`, { userId });
        if(response.data?.message) {
            return { groupId, userId };
        }
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
})

export const removeMemberFromGroup = createAsyncThunk("groups/removeMemberFromGroup", async ({ groupId, userId }) => {
    try {
        const response = await axiosInstance.post(`/group/removeUserFromGroup/${groupId}`, { userId });
        if(response.data?.message) {
            return { groupId, userId };
        }
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
})

export const confirmGroup = createAsyncThunk("groups/confirmGroup", async (id) => {
    try {
        const response = await axiosInstance.post(`/group/confirmGroup/${id}`);
        if(response.data?.message) {
            return id;
        }
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
})

export const fetchMembers = async (id) => {
    try {
        const response = await axiosInstance.post(`/group/fetchMembers/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const fetchChatId = async (id) => {
    try {
        const response = await axiosInstance.get(`/group/fetchChatId/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}


export const verifyCode = createAsyncThunk("groups/verifyCode", async ({ code, userId }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/group/verifyCode', { code, userId });
        const {group} = response.data;
        return {group, userId}
    } catch (error) {
        return rejectWithValue(error.response.data || 'An error occurred');
    }
});
