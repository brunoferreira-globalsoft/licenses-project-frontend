import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse
} from '@/types/api/responses';
import { BaseApiClient, BaseApiError } from '@/lib/base-client';
import {
  BloqueioLicencaDTO,
  CreateLicencaDTO,
  LicencaDTO,
  UpdateLicencaDTO
} from '@/types/dtos';
import { ResponseApi } from '@/types/responses';

export class LicencaError extends BaseApiError {
  name: string = 'LicencaError';
}

class LicencasClient extends BaseApiClient {
  public async getLicencasPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<LicencaDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/api/licencas/licencas-paginated',
      params
    );
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<LicencaDTO>
          >('/api/licencas/licencas-paginated', params);

          if (!response.info || !response.info.data) {
            console.error('Formato de resposta inválido:', response);
            throw new LicencaError('Formato de resposta inválido');
          }

          return response;
        } catch (error) {
          throw new LicencaError(
            'Falha ao obter licenças paginadas',
            undefined,
            error
          );
        }
      })
    );
  }

  public async getLicencas(): Promise<ResponseApi<GSResponse<LicencaDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/api/licencas');
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<LicencaDTO[]>>(
              '/api/licencas'
            );

          if (!response.info || !response.info.data) {
            console.error('Formato de resposta inválido:', response);
            throw new LicencaError('Formato de resposta inválido');
          }

          return response;
        } catch (error) {
          throw new LicencaError('Falha ao obter licenças', undefined, error);
        }
      })
    );
  }

  public async createLicenca(
    data: CreateLicencaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateLicencaDTO,
          GSResponse<string>
        >('/api/licencas', data);

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new LicencaError('Formato de resposta inválido');
        }

        return response;
      } catch (error) {
        if (error instanceof BaseApiError && error.data) {
          return {
            info: error.data as GSResponse<string>,
            status: error.statusCode || 400,
            statusText: error.message
          };
        }
        throw error;
      }
    });
  }

  public async updateLicenca(
    id: string,
    data: UpdateLicencaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateLicencaDTO,
          GSResponse<string>
        >(`/api/licencas/${id}`, data);

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new LicencaError('Formato de resposta inválido');
        }

        return response;
      } catch (error) {
        if (error instanceof BaseApiError && error.data) {
          return {
            info: error.data as GSResponse<string>,
            status: error.statusCode || 400,
            statusText: error.message
          };
        }
        throw error;
      }
    });
  }

  public async deleteLicenca(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          `/api/licencas/${id}`
        );

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new LicencaError('Formato de resposta inválido');
        }

        return response;
      } catch (error) {
        throw new LicencaError('Falha ao deletar licença', undefined, error);
      }
    });
  }

  public async getLicencaByApiKey(): Promise<
    ResponseApi<GSResponse<LicencaDTO>>
  > {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.getRequest<
          GSResponse<LicencaDTO>
        >('/api/licencas/by-api-key');

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new LicencaError('Formato de resposta inválido');
        }

        return response;
      } catch (error) {
        throw new LicencaError(
          'Falha ao obter licença por API key',
          undefined,
          error
        );
      }
    });
  }

  public async getLicencaById(
    id: string
  ): Promise<ResponseApi<GSResponse<LicencaDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/api/licencas/${id}`);
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<LicencaDTO>
          >(`/api/licencas/${id}`);

          if (!response.info || !response.info.data) {
            console.error('Formato de resposta inválido:', response);
            throw new LicencaError('Formato de resposta inválido');
          }

          return response;
        } catch (error) {
          throw new LicencaError(
            'Falha ao obter licença por ID',
            undefined,
            error
          );
        }
      })
    );
  }

  public async createLicencaApiKey(
    licencaId: string
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          null,
          GSResponse<string>
        >(`/api/keys/${licencaId}/create`, null);

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new LicencaError('Formato de resposta inválido');
        }

        return response;
      } catch (error) {
        throw new LicencaError('Falha ao criar API key', undefined, error);
      }
    });
  }

  public async blockLicenca(
    licencaId: string,
    data: BloqueioLicencaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          BloqueioLicencaDTO,
          GSResponse<string>
        >(`/api/licencas/${licencaId}/block`, data);

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new LicencaError('Formato de resposta inválido');
        }

        return response;
      } catch (error) {
        throw new LicencaError('Falha ao bloquear licença', undefined, error);
      }
    });
  }

  public async unblockLicenca(
    licencaId: string
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          null,
          GSResponse<string>
        >(`/api/licencas/${licencaId}/unblock`, null);

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new LicencaError('Formato de resposta inválido');
        }

        return response;
      } catch (error) {
        throw new LicencaError(
          'Falha ao desbloquear licença',
          undefined,
          error
        );
      }
    });
  }
}

const LicencasService = (idFuncionalidade: string) =>
  new LicencasClient(idFuncionalidade);
export default LicencasService;
