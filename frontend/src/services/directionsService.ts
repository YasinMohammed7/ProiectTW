import { api } from "../api/api";
import { CustomApiError } from "../@types/apiTypes";

class DirectionsService {
    async getDirections() {
        try {
            const response = await api.get(`/directions`);
            return response.data;
        } catch (error: any) {
            console.log('Bundles error respoghktfyfyukfnseeeeee:', error.response?.data);
            const message = error.response?.data?.message || 'Connection failed';
            const statusCode = error.response?.status || 0;
            const errorType = error.response?.data?.error || "Connection failed";
            throw new CustomApiError(message, statusCode, errorType, error.response?.data);
        }
    }

    async createDirection(startLocationName: string, endLocationName: string) {
        try {
            const response = await api.post(`/directions`, { startLocationName, endLocationName });
            return response.data;
        } catch (error: any) {
            console.log('Bundles error respoghktfyfyukfnseeeeee:', error.response?.data);
            const message = error.response?.data?.message || 'Connection failed';
            const statusCode = error.response?.status || 0;
            const errorType = error.response?.data?.error || "Connection failed";
            throw new CustomApiError(message, statusCode, errorType, error.response?.data);
        }
    }

    async deleteDirection(id: number) {
        try {
            const response = await api.delete(`/directions/${id}`);
            return response.data;
        } catch (error: any) {
            console.log('Bundles error respoghktfyfyukfnseeeeee:', error.response?.data);
            const message = error.response?.data?.message || 'Connection failed';
            const statusCode = error.response?.status || 0;
            const errorType = error.response?.data?.error || "Connection failed";
            throw new CustomApiError(message, statusCode, errorType, error.response?.data);
        }
    }

    async updateDirection(id: number, startLocationName: string, endLocationName: string) {
        try {
            const response = await api.put(`/directions/${id}`, { startLocationName, endLocationName });
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

export const directionsService = new DirectionsService();