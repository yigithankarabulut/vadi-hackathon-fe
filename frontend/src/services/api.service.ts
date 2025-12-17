interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.yigithankarabulut.com';

export const apiService = {
    async login(email: string, password: string): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                return { success: false, message: 'Login failed' };
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error' };
        }
    },

    async register(username: string, email: string, password: string): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                return { success: false, message: 'Registration failed' };
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Network error' };
        }
    },
};
