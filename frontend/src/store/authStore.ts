import { create } from "zustand";
import type { AuthStore } from "../@types/auth";
import AuthService from "../services/AuthService";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const initialState = {
    user: null,
    isAuthenticated: false,
    accessToken: null,
    isLoading: false,
    error: null,
}

export const useAuthStore = create<AuthStore>()(
    devtools(persist((set) => ({
        ...initialState,

        setUser: (user: any) => set({ user }),
        setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
        setIsLoading: (isLoading: boolean) => set({ isLoading }),
        setError: (error: string) => set({ error }),
        reset: () => set(initialState),

        googleLogin: async (credential: string) => {
            set({ isLoading: true, error: null });
            try {
                const response = await AuthService.googleLogin(credential);
                set({ user: response.user, isAuthenticated: true, isLoading: false, accessToken: response.accessToken });
            } catch (error: any) {
                let errorMessage: string = "";
                switch (error.statusCode) {
                    case 401:
                        errorMessage = "Autentificarea nu a reusit. Te rugam sa incerci din nou.";
                        break;
                    default:
                        errorMessage = "A aparut o eroare la autentificare. Te rugam sa incerci din nou.";
                        break;
                }
                set({
                    isLoading: false,
                    error: errorMessage,
                })
                throw new Error(errorMessage)
            }
        },
        logout: async () => {
            set({ isLoading: true, error: null });
            try {
                await AuthService.logout();
                set({ user: null, isAuthenticated: false, isLoading: false, accessToken: null });
            } catch (error: any) {
                let errorMessage: string = "";
                switch (error.statusCode) {
                    case 401:
                        errorMessage = "Deconectarea nu a reusit. Te rugam sa incerci din nou.";
                        break;
                    default:
                        errorMessage = "A aparut o eroare la deconectare. Te rugam sa incerci din nou.";
                        break;
                }
                set({
                    isLoading: false,
                    error: errorMessage,
                })
                throw new Error(errorMessage)
            }
        },
        // refreshToken: async () => {
        //     set({ isLoading: true, error: null });
        //     try {
        //         const response = await AuthService.refreshToken();
        //         set({ user: response.user, isAuthenticated: true, isLoading: false, accessToken: response.accessToken });
        //     } catch (error: any) {
        //         let errorMessage: string = "";
        //         switch (error.statusCode) {
        //             case 401:
        //                 errorMessage = "Sesiunea a expirat. Te rugam sa te autentifici din nou.";
        //                 break;
        //             default:
        //                 errorMessage = "A aparut o eroare la actualizarea sesiunii. Te rugam sa incerci din nou.";
        //                 break;
        //         }
        //         set({
        //             isLoading: false,
        //             error: errorMessage,
        //         })
        //         throw new Error(errorMessage)
        //     }
        // },
    }), {
        name: 'auth-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            accessToken: state.accessToken,
        }),
    })))