export class CustomApiError extends Error implements ApiError {
    statusCode: number;
    error?: string;
    details?: Details;

    constructor(message: string, statusCode: number, error?: string, details?: Details) {
        super(message);
        this.name = 'CustomApiError';
        this.statusCode = statusCode;
        this.error = error;
        this.details = details;
    }
}

export interface ApiError {
    message: string
    statusCode: number
    error?: string
    details?: Details
}

export interface Details {
    message?: string
    statusCode?: number
    error?: string
}