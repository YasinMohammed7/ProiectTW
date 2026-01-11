import { api } from "../api/api";
import { CustomApiError } from "../@types/apiTypes";

class AuthService {
    async googleLogin(credential: string) {
        try {
            const response = await api.post('/auth/google', { credential });
            return response.data;
        } catch (error: any) {
            console.log('Bundles error respoghktfyfyukfnseeeeee:', error.response?.data);
            const message = error.response?.data?.message || 'Connection failed';
            const statusCode = error.response?.status || 0;
            const errorType = error.response?.data?.error || "Connection failed";
            throw new CustomApiError(message, statusCode, errorType, error.response?.data);
        }
    }

    // async refreshToken() {
    //     try {
    //         const response = await api.post('/auth/refresh');
    //         return response.data;
    //     } catch (error: any) {
    //         console.log('Bundles error respoghktfyfyukfnseeeeee:', error.response?.data);
    //         const message = error.response?.data?.message || 'Connection failed';
    //         const statusCode = error.response?.status || 0;
    //         const errorType = error.response?.data?.error || "Connection failed";
    //         throw new CustomApiError(message, statusCode, errorType, error.response?.data);
    //     }
    // }

    async logout() {
        try {
            const response = await api.post('/auth/logout');
            return response.data;
        } catch (error: any) {
            console.log('Bundles error respoghktfyfyukfnseeeeee:', error.response?.data);
            const message = error.response?.data?.message || 'Connection failed';
            const statusCode = error.response?.status || 0;
            const errorType = error.response?.data?.error || "Connection failed";
            throw new CustomApiError(message, statusCode, errorType, error.response?.data);
        }
    }
}

export default new AuthService();