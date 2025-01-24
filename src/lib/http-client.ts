import state from '@/states/state';
import { GSResponseToken } from '@/types/api/responses';
import axios, { type AxiosResponse, type AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '@/stores/auth-store';
import { BaseApiError } from '@/lib/base-client';
import { ResponseApi } from '@/types/responses';

// Define the base URL for your API
const apiUrl = state.URL;

export class HttpClient {
  private idFuncionalidade?: string;
  // private readonly apiUrl: string = import.meta.env.VITE_URL;
  private readonly apiKey: string = import.meta.env.VITE_API_KEY;
  private tokenCheckInProgress = false;
  private lastTokenCheck = 0;
  private readonly TOKEN_CHECK_INTERVAL = 30000; // 30 seconds

  constructor(idFuncionalidade?: string) {
    this.idFuncionalidade = idFuncionalidade;
  }

  private async renewToken(): Promise<boolean> {
    const currentTime = Date.now();

    // Skip if another check is in progress or if we checked recently
    if (
      this.tokenCheckInProgress ||
      currentTime - this.lastTokenCheck < this.TOKEN_CHECK_INTERVAL
    ) {
      return true;
    }

    try {
      this.tokenCheckInProgress = true;
      const { token } = useAuthStore.getState();

      if (!token) {
        return false;
      }

      const decodedToken: GSResponseToken = jwtDecode(token);
      const tokenExpiryTime = decodedToken.exp * 1000;

      if (tokenExpiryTime < currentTime) {
        const TokensClient = (await import('@/lib/services/auth/tokens-client'))
          .default;
        const success = await TokensClient.getRefresh();

        if (success) {
          // Update localStorage state
          const { token: newToken, refreshToken } = useAuthStore.getState();

          state.Token = newToken;
          state.Refresh_Token = refreshToken;
          state.save(); // This will update localStorage
        }

        return success;
      }

      return true;
    } finally {
      this.lastTokenCheck = currentTime;
      this.tokenCheckInProgress = false;
    }
  }

  private async withTokenRenewal<T>(
    requestFn: () => Promise<AxiosResponse<T>>
  ): Promise<AxiosResponse<T>> {
    const tokenValid = await this.renewToken();

    if (!tokenValid) {
      throw new Error('Unable to renew token');
    }

    return requestFn();
  }

  protected getHeaders() {
    const { token } = useAuthStore.getState();

    const headers = {
      tenant: 'root',
      'Accept-Language': 'en-US',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-API-Key': this.apiKey
    };

    if (this.idFuncionalidade) {
      headers['X-Funcionalidade-Id'] = this.idFuncionalidade;
    }

    return headers;
  }

  public getRequest = async <T>(url: string): Promise<ResponseApi<T>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.get(`${apiUrl}${url}`, {
          headers: this.getHeaders()
        })
      );

      return {
        info: response.data,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log('AxiosError');
        console.log(error);
        throw handleErrorAxios(error);
      } else {
        console.log('Not an AxiosError');
        console.log(error);
        throw handleError(error);
      }
    }
  };

  public postRequest = async <T, U>(
    url: string,
    data: T
  ): Promise<ResponseApi<U>> => {
    try {
      //

      const response = await this.withTokenRenewal(() =>
        axios.post(`${apiUrl}${url}`, data, {
          headers: this.getHeaders()
        })
      );

      return {
        info: response.data,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw handleErrorAxios(error);
      else throw handleError(error);
    }
  };

  // Similarly update other methods (putRequest, deleteRequest, etc.)
  public putRequest = async <T, U>(
    url: string,
    data: T
  ): Promise<ResponseApi<U>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.put(`${apiUrl}${url}`, data, {
          headers: this.getHeaders()
        })
      );

      return {
        info: response.data,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw handleErrorAxios(error);
      else throw handleError(error);
    }
  };

  public deleteRequest = async <T>(url: string): Promise<ResponseApi<T>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.delete(`${apiUrl}${url}`, {
          headers: this.getHeaders()
        })
      );

      return {
        info: response.data,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw handleErrorAxios(error);
      else throw handleError(error);
    }
  };

  public postWithoutDataRequest = async <T>(
    url: string
  ): Promise<ResponseApi<T>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.post(
          `${apiUrl}${url}`,
          {},
          {
            headers: this.getHeaders()
          }
        )
      );

      return {
        info: response.data,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw handleErrorAxios(error);
      else throw handleError(error);
    }
  };

  public putWithoutDataRequest = async <T>(
    url: string
  ): Promise<ResponseApi<T>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.put(
          `${apiUrl}${url}`,
          {},
          {
            headers: this.getHeaders()
          }
        )
      );

      return {
        info: response.data,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw handleErrorAxios(error);
      else throw handleError(error);
    }
  };
}

export const createHttpClient = (idFuncionalidade: string) =>
  new HttpClient(idFuncionalidade);

// Error handling function for Axios errors
function handleErrorAxios(error: AxiosError): never {
  if (axios.isAxiosError(error)) {
    if (
      error.response?.data &&
      typeof error.response.data === 'object' &&
      'succeeded' in error.response.data &&
      'messages' in error.response.data
    ) {
      // For validation errors, preserve the structure
      throw new BaseApiError(
        'Validation Error',
        error.response.status,
        error.response.data
      );
    }

    throw new BaseApiError(error.message, error.response?.status);
  }

  throw new BaseApiError('Unknown error', 500);
}

// General error handling function
function handleError(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Unknown error';
  }

  return 'Unknown error';
}
