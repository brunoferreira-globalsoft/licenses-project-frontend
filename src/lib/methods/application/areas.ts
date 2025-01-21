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
            console.error('Invalid response format:', response);
            throw new AreaError('Invalid response format');
          }

          return response;
        } catch (error) {
          console.error('Failed to fetch paginated areas:', error);
          throw new AreaError(
            'Failed to fetch paginated areas',
            undefined,
            error
          );
        }
      })
    );
  }

  public async createArea(
    data: Area
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          Area,
          GSResponse<string>
        >('/api/areas', data);

        console.log(response);

        return response;
      } catch (error) {
        throw new AreaError('Error creating area', undefined, error);
      }
    });
  }

  public async updateArea(
    id: string,
    data: Area
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          Area,
          GSResponse<string>
        >(`/api/areas/${id}`, data);

        return response;
      } catch (error) {
        throw new AreaError('Error updating area', undefined, error);
      }
    });
  }

  public async deleteArea(id: string): Promise<GSGenericResponse> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<
          GSResponse<GSGenericResponse>
        >(`/api/areas/${id}`);

        if (!this.validateResponse<GSGenericResponse>(response)) {
          throw new AreaError('Invalid response format');
        }

        return response.data;
      } catch (error) {
        throw new AreaError('Error deleting area', undefined, error);
      }
    });
  }
}

const Areas = (idFuncionalidade: string) => new AreasClient(idFuncionalidade);
export default Areas;
