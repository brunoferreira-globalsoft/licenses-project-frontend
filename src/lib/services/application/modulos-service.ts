import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse
} from '@/types/api/responses';
import { BaseApiClient, BaseApiError } from '@/lib/base-client';
import { ModuloDTO, CreateModuloDTO, UpdateModuloDTO } from '@/types/dtos';
import { ResponseApi } from '@/types/responses';

export class ModuloError extends BaseApiError {
  name: string = 'ModuloError';
}

class ModulosClient extends BaseApiClient {
  public async getModulosPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<ModuloDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/api/modulos/modulos-paginated',
      params
    );
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<ModuloDTO>
          >('/api/modulos/modulos-paginated', params);

          if (!response.info || !response.info.data) {
            console.error('Formato de resposta inválido:', response);
            throw new ModuloError('Formato de resposta inválido');
          }

          return response;
        } catch (error) {
          throw new ModuloError(
            'Falha ao obter módulos paginados',
            undefined,
            error
          );
        }
      })
    );
  }

  public async getModulos(): Promise<ResponseApi<GSResponse<ModuloDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/api/modulos');
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<ModuloDTO[]>>(
              '/api/modulos'
            );

          if (!response.info || !response.info.data) {
            console.error('Formato de resposta inválido:', response);
            throw new ModuloError('Formato de resposta inválido');
          }

          return response;
        } catch (error) {
          throw new ModuloError('Falha ao obter módulos', undefined, error);
        }
      })
    );
  }

  public async createModulo(
    data: CreateModuloDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateModuloDTO,
          GSResponse<string>
        >('/api/modulos', data);

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new ModuloError('Formato de resposta inválido');
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

  public async updateModulo(
    id: string,
    data: UpdateModuloDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateModuloDTO,
          GSResponse<string>
        >(`/api/modulos/${id}`, data);

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new ModuloError('Formato de resposta inválido');
        }

        return response;
      } catch (error) {
        throw new ModuloError('Falha ao atualizar módulo', undefined, error);
      }
    });
  }

  public async deleteModulo(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          `/api/modulos/${id}`
        );

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new ModuloError('Formato de resposta inválido');
        }

        return response;
      } catch (error) {
        throw new ModuloError('Falha ao deletar módulo', undefined, error);
      }
    });
  }
}

const ModulosService = (idFuncionalidade: string) =>
  new ModulosClient(idFuncionalidade);
export default ModulosService;
