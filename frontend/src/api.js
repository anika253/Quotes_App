import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle unauthorized errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const api = {
    sendOtp: (phoneNumber) => apiClient.post('/auth/send-otp', { phoneNumber }),
    
    verifyOtp: async (phoneNumber, otp) => {
        const response = await apiClient.post('/auth/verify-otp', { phoneNumber, otp });
        const data = response.data;
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    checkAuth: () => apiClient.get('/auth/check-auth'),

    setupProfile: (profileData) => apiClient.post('/profile/setup', profileData),
    
    getProfile: (phoneNumber) => apiClient.get(`/profile/get`, { params: { phoneNumber } }),
    
    initiatePayment: (paymentData) => apiClient.post('/payment/initiate', paymentData),
    
    verifyPayment: (paymentId) => apiClient.post('/payment/verify', { paymentId }),
    
    getQuotes: (category) => apiClient.get('/quotes', { params: { category } }),
    
    getCategories: () => apiClient.get('/quotes/categories'),
};

export default apiClient;
