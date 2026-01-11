import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { DirectionStore } from "../@types/directions";
import { directionsService } from "../services/directionsService";

const initialState = {
    directions: null,
    isLoading: false,
    error: null,
}

export const useDirectionsStore = create<DirectionStore>()(
    devtools((set, get) => ({
        ...initialState,

        setDirections: (directions: any[]) => set({ directions }),
        setIsLoading: (isLoading: boolean) => set({ isLoading }),
        setError: (error: string) => set({ error }),
        reset: () => set(initialState),

        getDirections: async () => {
            set({ isLoading: true, error: null });
            try {
                const response = await directionsService.getDirections();
                set({ directions: response.directions, isLoading: false });
            } catch (error: any) {
                let errorMessage: string = "";
                switch (error.statusCode) {
                    case 401:
                        errorMessage = "Nu ai permisiuni sa accesezi aceasta ruta. Te rugam sa te autentifici.";
                        break;
                    default:
                        errorMessage = "A aparut o eroare la incarcarea rutelor. Te rugam sa incerci din nou.";
                        break;
                }
                set({ isLoading: false, error: errorMessage });
            }
        },
        createDirection: async (startLocationName: string, endLocationName: string) => {
            set({ isLoading: true, error: null });
            try {
                const response = await directionsService.createDirection(startLocationName, endLocationName);
                const { directions } = get();
                set({ directions: [...(directions || []), response.direction], isLoading: false });
            } catch (error: any) {
                let errorMessage: string = "";
                switch (error.statusCode) {
                    case 401:
                        errorMessage = "Nu ai permisiuni sa creezi aceasta ruta. Te rugam sa te autentifici.";
                        break;
                    default:
                        errorMessage = "A aparut o eroare la crearea rutelor. Te rugam sa incerci din nou.";
                        break;
                }
                set({ isLoading: false, error: errorMessage });
            }
        },
        updateDirection: async (id: number, startLocationName: string, endLocationName: string) => {
            set({ isLoading: true, error: null });
            try {
                const response = await directionsService.updateDirection(id, startLocationName, endLocationName);
                const { directions } = get();
                set({ directions: directions?.map((direction: any) => direction._id === id ? response.direction : direction), isLoading: false });
            } catch (error: any) {
                let errorMessage: string = "";
                switch (error.statusCode) {
                    case 401:
                        errorMessage = "Nu ai permisiuni sa actualizezi aceasta ruta. Te rugam sa te autentifici.";
                        break;
                    default:
                        errorMessage = "A aparut o eroare la actualizarea rutelor. Te rugam sa incerci din nou.";
                        break;
                }
                set({ isLoading: false, error: errorMessage });
            }
        },
        deleteDirection: async (id: number) => {
            set({ isLoading: true, error: null });
            try {
                const response = await directionsService.deleteDirection(id);
                console.log('Response:', response);
                const { directions } = get();
                set({ directions: directions?.filter((direction: any) => direction._id !== id), isLoading: false });
            } catch (error: any) {
                let errorMessage: string = "";
                switch (error.statusCode) {
                    case 401:
                        errorMessage = "Nu ai permisiuni sa stergezi aceasta ruta. Te rugam sa te autentifici.";
                        break;
                    default:
                        errorMessage = "A aparut o eroare la stergerea rutelor. Te rugam sa incerci din nou.";
                        break;
                }
                set({ isLoading: false, error: errorMessage });
            }
        },
    })))