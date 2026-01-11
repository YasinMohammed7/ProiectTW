export interface AuthStore {
    user: any | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    accessToken: string | null;
    setUser: (user: any) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string) => void;
    logout: () => void;
    // refreshToken: () => void;
    googleLogin: (credential: string) => void;
    reset: () => void;
}