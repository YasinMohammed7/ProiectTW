export interface DirectionStore {
    directions: any[] | null;
    isLoading: boolean;
    error: string | null;
    setDirections: (directions: any[]) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string) => void;
    getDirections: () => void;
    createDirection: (startLocationName: string, endLocationName: string) => void;
    updateDirection: (id: number, startLocationName: string, endLocationName: string) => void;
    deleteDirection: (id: number) => void;
    reset: () => void;
}