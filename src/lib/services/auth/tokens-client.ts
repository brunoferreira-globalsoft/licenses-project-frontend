import { createHttpClient, HttpClient } from '@/lib/http-client';
import { useAuthStore } from '@/stores/auth-store';
import axios, { type AxiosRequestConfig } from 'axios';
import type { ResponseLogin } from '@/types/responses';
import { LicencaDTO } from '@/types/dtos';
import { GSResponse } from '@/types/api/responses';
class TokensClient {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = createHttpClient('');
  }

  public login = async (email: string, password: string): Promise<boolean> => {
    const { setToken, setRefreshToken, setUser, decodeToken } =
      useAuthStore.getState();

    const options: AxiosRequestConfig = {
      method: 'POST',
      url: `${import.meta.env.VITE_URL}/api/tokens`,
      headers: {
        tenant: 'root',
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json',
        'X-API-Key': import.meta.env.VITE_API_KEY
      },
      data: { email, password }
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200 && response.data.data != null) {
        const loginResponse: ResponseLogin = response.data.data;

        // Update auth store
        setToken(loginResponse.token);
        setRefreshToken(loginResponse.refreshToken);
        setUser(email);
        decodeToken();

        // Get license info
        const licenseResponse = await this.httpClient.getRequest<
          GSResponse<LicencaDTO>
        >('/api/licencas/by-api-key');

        if (licenseResponse.info.data) {
          useAuthStore.setState({
            clientId: licenseResponse.info.data.clienteId
          });
        }

        return true;
      }
      console.error('Login failed');
      return false;
    } catch (err) {
      console.error('Login error', err);
      return false;
    }
  };

  public getRefresh = async (): Promise<boolean> => {
    const { setToken, setRefreshToken } = useAuthStore.getState();
    const refreshToken = useAuthStore.getState().refreshToken;

    if (!refreshToken) {
      console.error('No refresh token available');
      return false;
    }

    console.log('getRefresh', refreshToken);

    const options: AxiosRequestConfig = {
      method: 'GET',
      url: `${import.meta.env.VITE_URL}/api/tokens/${refreshToken}`,
      headers: {
        tenant: 'root',
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json',
        'X-API-Key': import.meta.env.VITE_API_KEY
      }
    };

    try {
      const response = await axios.request(options);

      console.log('getRefresh response', response);

      if (response.status === 200 && response.data?.data) {
        const refreshResponse: ResponseLogin = response.data.data;
        setToken(refreshResponse.token);
        setRefreshToken(refreshResponse.refreshToken);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Refresh error', err);
      return false;
    }
  };
}

// Export a singleton instance
export default new TokensClient();
