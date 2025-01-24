import { BaseApiClient, BaseApiError } from '@/lib/base-client';
import { ResponseApi } from '@/types/responses';
import { AreaDTO, CreateAreaDTO, UpdateAreaDTO } from '@/types/dtos';
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest
} from '@/types/api/responses';
import { PaginatedResponse } from '@/types/api/responses';

export class AreaError extends BaseApiError {
  name: string = 'AreaError';
}

class AreasClient extends BaseApiClient {
  public async getAreasPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<AreaDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/api/areas/areas-paginated',
      params
    );
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<AreaDTO>
          >('/api/areas/areas-paginated', params);

          console.log('Areas API Response:', response);

          if (!response.info || !response.info.data) {
            console.error('Formato de resposta inválido:', response);
            throw new AreaError('Formato de resposta inválido');
          }

          return response;
        } catch (error) {
          console.error('Falha ao obter áreas paginadas:', error);
          throw new AreaError(
            'Falha ao obter áreas paginadas',
            undefined,
            error
          );
        }
      })
    );
  }

  public async getAreas(): Promise<ResponseApi<GSResponse<AreaDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/api/areas');
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<AreaDTO[]>>(
              '/api/areas'
            );

          if (!response.info || !response.info.data) {
            console.error('Formato de resposta inválido:', response);
            throw new AreaError('Formato de resposta inválido');
          }

          return response;
        } catch (error) {
          throw new AreaError('Falha ao obter áreas', undefined, error);
        }
      })
    );
  }

  public async createArea(
    data: CreateAreaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateAreaDTO,
          GSResponse<string>
        >('/api/areas', data);

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new AreaError('Formato de resposta inválido');
        }

        return response;
      } catch (error) {
        throw new AreaError('Falha ao criar área', undefined, error);
      }
    });
  }

  public async updateArea(
    id: string,
    data: UpdateAreaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateAreaDTO,
          GSResponse<string>
        >(`/api/areas/${id}`, data);

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new AreaError('Formato de resposta inválido');
        }

        return response;
      } catch (error) {
        throw new AreaError('Falha ao atualizar área', undefined, error);
      }
    });
  }

  public async deleteArea(id: string): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          `/api/areas/${id}`
        );

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new AreaError('Formato de resposta inválido');
        }

        return response;
      } catch (error) {
        throw new AreaError('Falha ao deletar área', undefined, error);
      }
    });
  }
}

const AreasService = (idFuncionalidade: string) =>
  new AreasClient(idFuncionalidade);
export default AreasService;
