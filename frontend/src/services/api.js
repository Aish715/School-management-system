import axios from 'axios';

// The base URL of your Spring Boot backend
const API_BASE_URL = 'http://localhost:8080';

// --- Axios instance for public authentication routes ---
const authApiClient = axios.create({
    baseURL: `${API_BASE_URL}/auth`
});

// --- Axios instance for protected API routes ---
const protectedApiClient = axios.create({
    baseURL: `${API_BASE_URL}/api`
});

// Interceptor to automatically add the JWT token to every protected request
protectedApiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// --- Authentication Functions ---

// UPDATED: This function now accepts and sends the selected role
export const sendOtp = (mobile, role) => {
    const params = new URLSearchParams();
    params.append('mobile', mobile);
    params.append('role', role); // Add the role to the request
    return authApiClient.post(`/send-otp`, params);
};

export const verifyOtp = (mobile, code) => {
    const params = new URLSearchParams();
    params.append('mobile', mobile);
    params.append('code', code);
    return authApiClient.post(`/verify-otp`, params);
};


// --- Protected Student API Functions ---

export const getStudents = () => {
    return protectedApiClient.get('/students');
};

export const addStudent = (studentData) => {
    return protectedApiClient.post('/students', studentData);
};

export const updateStudent = (id, studentData) => {
    return protectedApiClient.put(`/students/${id}`, studentData);
};

export const deleteStudent = (id) => {
    return protectedApiClient.delete(`/students/${id}`);
};

