import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse
} from '@/types/common';
import { Area } from '@/types/entities';
import { BaseApiClient, BaseApiError } from '@/lib/base-client';
import { ResponseApi } from '@/types/responses';

export class AreaError extends BaseApiError {
  name: string = 'AreaError';
}

class AreasClient extends BaseApiClient {
  public async getAreasPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<Area>>> {
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
            PaginatedResponse<Area>
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

  public async getAreas(): Promise<ResponseApi<GSResponse<Area[]>>> {
    const cacheKey = this.getCacheKey('GET', '/api/areas');
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<Area[]>>('/api/areas');

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

  public async createArea(data: Area): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          Area,
          GSGenericResponse
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
    data: Area
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          Area,
          GSGenericResponse
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

const Areas = (idFuncionalidade: string) => new AreasClient(idFuncionalidade);
export default Areas;
