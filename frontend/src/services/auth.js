import { jwtDecode } from 'jwt-decode';

export const getUserRole = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        return null;
    }
    try {
        const decodedToken = jwtDecode(token);
        // We are looking for the 'role' claim we set in the backend's JwtUtil.java
        return decodedToken.role;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};
