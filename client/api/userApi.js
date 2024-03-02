import axios from 'axios';

const baseURL = 'http://10.0.2.2:5000';

const axiosInstance = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const login = async (formData) => {
    try {
        const response = await axiosInstance.post('user/login', formData);
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error('Failed to log in'); // or handle other error cases
        }
    } catch (error) {
        throw error.response.data;
    }
};


export const signup = async (formData) => {
    try {
        const response = await axiosInstance.post('user/signup', formData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
