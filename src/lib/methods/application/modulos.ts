import { GSGenericResponse, GSResponse } from '@/types/common';
import { Modulo } from '@/types/entities';
import { BaseApiClient, BaseApiError } from '@/lib/base-client';

export class ModuloError extends BaseApiError {
  constructor(message: string, statusCode?: number, data?: unknown) {
    super(message, statusCode, data);
    this.name = 'ModuloError';
  }
}

class ModulosClient extends BaseApiClient {
  public async getModulos(aplicacaoId: string): Promise<GSResponse<Modulo[]>> {
    const cacheKey = this.getCacheKey('GET', '/api/modulos', { aplicacaoId });
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<Modulo[]>
          >(`/api/modulos?aplicacaoId=${aplicacaoId}`);

          if (!this.validateResponse<Modulo[]>(response)) {
            throw new ModuloError('Invalid response format');
          }

          return response;
        } catch (error) {
          throw new ModuloError('Failed to fetch modulos', undefined, error);
        }
      })
    );
  }

  public async createModulo(data: Modulo): Promise<GSResponse<string>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          Modulo,
          GSResponse<string>
        >('/api/modulos', data);

        if (!this.validateResponse<string>(response)) {
          throw new ModuloError('Invalid response format');
        }

        return response;
      } catch (error) {
        throw new ModuloError('Failed to create modulo', undefined, error);
      }
    });
  }

  public async updateModulo(
    id: string,
    data: Modulo
  ): Promise<GSGenericResponse> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          Modulo,
          GSResponse<GSGenericResponse>
        >(`/api/modulos/${id}`, data);

        if (!this.validateResponse<GSGenericResponse>(response)) {
          throw new ModuloError('Invalid response format');
        }

        return response.data;
      } catch (error) {
        throw new ModuloError('Failed to update modulo', undefined, error);
      }
    });
  }

  public async deleteModulo(id: string): Promise<GSGenericResponse> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<
          GSResponse<GSGenericResponse>
        >(`/api/modulos/${id}`);

        if (!this.validateResponse<GSGenericResponse>(response)) {
          throw new ModuloError('Invalid response format');
        }

        return response.data;
      } catch (error) {
        throw new ModuloError('Failed to delete modulo', undefined, error);
      }
    });
  }
}

const Modulos = (idFuncionalidade: string) =>
  new ModulosClient(idFuncionalidade);
export default Modulos;
