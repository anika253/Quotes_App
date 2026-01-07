const API_BASE_URL = 'http://localhost:5000/api';

// Helper to get token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper for authenticated requests
const authFetch = async (url, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Handle unauthorized (e.g., redirect to login)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    return response.json();
};

export const api = {
    sendOtp: async (phoneNumber) => {
        const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber }),
        });
        return response.json();
    },
    verifyOtp: async (phoneNumber, otp) => {
        const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber, otp }),
        });
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },
    setupProfile: async (profileData) => {
        return authFetch('/profile/setup', {
            method: 'POST',
            body: JSON.stringify(profileData),
        });
    },
    getProfile: async (phoneNumber) => {
        return authFetch(`/profile/get?phoneNumber=${phoneNumber}`);
    },
    initiatePayment: async (paymentData) => {
        return authFetch('/payment/initiate', {
            method: 'POST',
            body: JSON.stringify(paymentData),
        });
    },
    verifyPayment: async (paymentId) => {
        return authFetch('/payment/verify', {
            method: 'POST',
            body: JSON.stringify({ paymentId }),
        });
    },
    getCategories: async () => {
        const response = await fetch(`${API_BASE_URL}/quotes/categories`);
        return response.json();
    },
};
