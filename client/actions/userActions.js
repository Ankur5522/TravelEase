import { createAsyncThunk } from '@reduxjs/toolkit';
import { login, signup } from '../api/userApi';

export const loginUser = createAsyncThunk('user/login', async (userData, { rejectWithValue }) => {
    try {
        const user = await login(userData);
        console.log("user",user)
        return user;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});

export const signupUser = createAsyncThunk('user/signup', async (userData, { rejectWithValue }) => {
    try {
        const user = await signup(userData);
        return user;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});
