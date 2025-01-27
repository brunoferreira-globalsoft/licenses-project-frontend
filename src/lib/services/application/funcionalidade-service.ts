import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse
} from '@/types/api/responses';
import { BaseApiClient, BaseApiError } from '@/lib/base-client';
import {
  FuncionalidadeDTO,
  CreateFuncionalidadeDTO,
  UpdateFuncionalidadeDTO
} from '@/types/dtos';
import { ResponseApi } from '@/types/responses';

export class FuncionalidadeError extends BaseApiError {
  name: string = 'FuncionalidadeError';
}

class FuncionalidadesClient extends BaseApiClient {
  public async getFuncionalidadesPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<FuncionalidadeDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/api/funcionalidades/funcionalidades-paginated',
      params
    );
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<FuncionalidadeDTO>
          >('/api/funcionalidades/funcionalidades-paginated', params);

          if (!response.info || !response.info.data) {
            console.error('Formato de resposta inválido:', response);
            throw new FuncionalidadeError('Formato de resposta inválido');
          }

          return response;
        } catch (error) {
          throw new FuncionalidadeError(
            'Falha ao obter funcionalidades paginadas',
            undefined,
            error
          );
        }
      })
    );
  }

  public async getFuncionalidades(): Promise<
    ResponseApi<GSResponse<FuncionalidadeDTO[]>>
  > {
    const cacheKey = this.getCacheKey('GET', '/api/funcionalidades');
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<FuncionalidadeDTO[]>
          >('/api/funcionalidades');

          if (!response.info || !response.info.data) {
            console.error('Formato de resposta inválido:', response);
            throw new FuncionalidadeError('Formato de resposta inválido');
          }

          return response;
        } catch (error) {
          throw new FuncionalidadeError(
            'Falha ao obter funcionalidades',
            undefined,
            error
          );
        }
      })
    );
  }

  public async createFuncionalidade(
    data: CreateFuncionalidadeDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateFuncionalidadeDTO,
          GSResponse<string>
        >('/api/funcionalidades', data);

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new FuncionalidadeError('Formato de resposta inválido');
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

  public async updateFuncionalidade(
    id: string,
    data: UpdateFuncionalidadeDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateFuncionalidadeDTO,
          GSResponse<string>
        >(`/api/funcionalidades/${id}`, data);

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new FuncionalidadeError('Formato de resposta inválido');
        }

        return response;
      } catch (error) {
        throw new FuncionalidadeError(
          'Falha ao atualizar funcionalidade',
          undefined,
          error
        );
      }
    });
  }

  public async deleteFuncionalidade(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          `/api/funcionalidades/${id}`
        );

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new FuncionalidadeError('Formato de resposta inválido');
        }

        return response;
      } catch (error) {
        throw new FuncionalidadeError(
          'Falha ao deletar funcionalidade',
          undefined,
          error
        );
      }
    });
  }
}

const FuncionalidadesService = (idFuncionalidade: string) =>
  new FuncionalidadesClient(idFuncionalidade);
export default FuncionalidadesService;
