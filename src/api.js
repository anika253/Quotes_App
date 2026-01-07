const API_BASE_URL = 'http://localhost:5000/api';

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
        return response.json();
    },
    setupProfile: async (profileData) => {
        const response = await fetch(`${API_BASE_URL}/profile/setup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData),
        });
        return response.json();
    },
    initiatePayment: async (paymentData) => {
        const response = await fetch(`${API_BASE_URL}/payment/initiate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData),
        });
        return response.json();
    },
    verifyPayment: async (paymentId) => {
        const response = await fetch(`${API_BASE_URL}/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId }),
        });
        return response.json();
    },
    getCategories: async () => {
        const response = await fetch(`${API_BASE_URL}/quotes/categories`);
        return response.json();
    },
};
