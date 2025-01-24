import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { GSResponseToken } from '@/types/api/responses';

interface AuthState {
  token: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
  email: string;
  name: string;
  userId: string;
  roleId: string;
  clientId: string;
  permissions: Record<string, number>;
  isLoaded: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setUser: (email: string) => void;
  decodeToken: () => void;
  clearAuth: () => void;
}

const initialState: AuthState = {
  token: '',
  refreshToken: '',
  refreshTokenExpiryTime: '',
  email: '',
  name: '',
  userId: '',
  roleId: '',
  clientId: '',
  permissions: {},
  isLoaded: false,
  isAuthenticated: false
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setToken: (token: string) => {
        set({ token, isAuthenticated: !!token, isLoaded: true });
        get().decodeToken();
      },

      setRefreshToken: (refreshToken: string) => {
        set({ refreshToken });
      },

      setUser: (email: string) => {
        set({ email });
      },

      decodeToken: () => {
        const { token } = get();
        if (!token) {
          console.warn('No token available to decode');
          return;
        }

        try {
          const decoded: GSResponseToken = jwtDecode(token);
          set({
            name: decoded.name,
            userId: decoded.uid,
            roleId: decoded.roles.toLowerCase(),
            isLoaded: true
          });
        } catch (err) {
          console.error('Failed to decode JWT:', err);
          get().clearAuth();
        }
      },

      clearAuth: () => {
        set({ ...initialState, isLoaded: true });
      }
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setToken(state.token);
      }
    }
  )
);
