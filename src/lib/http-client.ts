import state from '@/states/state';
import { GSResponseToken } from '@/types/common';
import { ResponseApi } from '@/types/responses';
import axios, { type AxiosResponse, type AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '@/stores/auth-store';

// Define the base URL for your API
const apiUrl = state.URL;

interface ErrorResponse {
  messages: Record<string, string[]>;
}

export class HttpClient {
  private idFuncionalidade?: string;
  private readonly apiUrl: string = import.meta.env.VITE_URL;
  private readonly apiKey: string = import.meta.env.VITE_API_KEY;
  private tokenCheckInProgress = false;
  private lastTokenCheck = 0;
  private readonly TOKEN_CHECK_INTERVAL = 30000; // 30 seconds

  constructor(idFuncionalidade?: string) {
    this.idFuncionalidade = idFuncionalidade;
  }

  private async renewToken() {
    const currentTime = Date.now();

    // Skip if another check is in progress or if we checked recently
    if (
      this.tokenCheckInProgress ||
      currentTime - this.lastTokenCheck < this.TOKEN_CHECK_INTERVAL
    ) {
      return;
    }

    try {
      this.tokenCheckInProgress = true;
      const { token } = useAuthStore.getState();

      if (!token) {
        return;
      }

      const decodedToken: GSResponseToken = jwtDecode(token);
      const tokenExpiryTime = decodedToken.exp * 1000;

      if (tokenExpiryTime < currentTime) {
        const TokensClient = (await import('@/lib/methods/auth/tokens'))
          .default;
        const success = await TokensClient.getRefresh();

        if (!success) {
          console.error('Failed to renew token');
        }
      }
    } finally {
      this.lastTokenCheck = currentTime;
      this.tokenCheckInProgress = false;
    }
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
      // await this.renewToken();

      const headers: Record<string, string> = this.getHeaders();

      const response: AxiosResponse<T> = await axios.get(`${apiUrl}${url}`, {
        headers
      });

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
      // await this.renewToken();

      const response: AxiosResponse<U> = await axios.post(
        `${apiUrl}${url}`,
        data,
        {
          headers: this.getHeaders()
        }
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
      // await this.renewToken();

      const response: AxiosResponse<U> = await axios.put(
        `${apiUrl}${url}`,
        data,
        {
          headers: this.getHeaders()
        }
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
      // await this.renewToken();

      const response: AxiosResponse<T> = await axios.delete(`${apiUrl}${url}`, {
        headers: this.getHeaders()
      });

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
      // await this.renewToken();

      const response: AxiosResponse<T> = await axios.post(
        `${apiUrl}${url}`,
        {},
        {
          headers: this.getHeaders()
        }
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
      // await this.renewToken();

      const response: AxiosResponse<T> = await axios.put(
        `${apiUrl}${url}`,
        {},
        {
          headers: this.getHeaders()
        }
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
function handleErrorAxios(error: AxiosError): string {
  if (axios.isAxiosError(error)) {
    if (
      error.response?.data &&
      (error.response.data as ErrorResponse).messages
    ) {
      let messages = '';
      const arr = Object.entries(
        (error.response.data as ErrorResponse).messages
      );

      arr.forEach((x) => {
        if (Array.isArray(x))
          messages += (messages !== '' ? '\n' : '') + (x as string[][])[1][0];
      });

      return messages;
    }

    return error.message;
  }

  return 'Unknown error';
}

// General error handling function
function handleError(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Unknown error';
  }

  return 'Unknown error';
}
