import { toastService } from './toast.service';

const API_BASE_URL = 'http://api.matcha.com';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}

class ApiService {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    data: data,
                    message: data.message,
                };
            } else {
                return {
                    success: false,
                    message: data.message || 'Bir hata oluştu',
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.',
            };
        }
    }

    async login(email: string, password: string): Promise<ApiResponse> {
        const response = await this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response.success) {
            toastService.messages.loginSuccess();
        } else {
            toastService.messages.loginError(response.message);
        }

        return response;
    }

    async register(username: string, email: string, password: string): Promise<ApiResponse> {
        const response = await this.request('/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
        });

        if (response.success) {
            toastService.messages.registerSuccess();
        } else {
            toastService.messages.registerError(response.message);
        }

        return response;
    }
}

export const apiService = new ApiService();
