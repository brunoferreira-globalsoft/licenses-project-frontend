import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse
} from '@/types/common';
import { Aplicacao } from '@/types/entities';
import { ResponseApi } from '@/types/responses';
import { BaseApiClient, BaseApiError } from '@/lib/base-client';

export class AplicacaoError extends BaseApiError {
  name: string = 'AplicacaoError';
}

class AplicacoesClient extends BaseApiClient {
  public async getAplicacoesPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<Aplicacao>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/api/aplicacoes/aplicacoes-paginated',
      params
    );
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<Aplicacao>
          >('/api/aplicacoes/aplicacoes-paginated', params);

          if (!response.info || !response.info.data) {
            console.error('Invalid response format:', response);
            throw new AplicacaoError('Invalid response format');
          }

          return response;
        } catch (error) {
          throw new AplicacaoError(
            'Failed to fetch paginated aplicacoes',
            undefined,
            error
          );
        }
      })
    );
  }

  public async getAplicacoes(): Promise<GSResponse<Aplicacao[]>> {
    const cacheKey = this.getCacheKey('GET', '/api/aplicacoes');
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<Aplicacao[]>>(
              '/api/aplicacoes'
            );

          if (!this.validateResponse<Aplicacao[]>(response)) {
            throw new AplicacaoError('Invalid response format');
          }

          return response;
        } catch (error) {
          throw new AplicacaoError(
            'Failed to fetch aplicacoes',
            undefined,
            error
          );
        }
      })
    );
  }

  public async createAplicacao(
    data: Aplicacao
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          Aplicacao,
          GSResponse<string>
        >('/api/aplicacoes', data);

        return response;
      } catch (error) {
        throw new AplicacaoError(
          'Failed to create aplicacao',
          undefined,
          error
        );
      }
    });
  }

  public async updateAplicacao(
    id: string,
    data: Aplicacao
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          Aplicacao,
          GSResponse<GSGenericResponse>
        >(`/api/aplicacoes/${id}`, data);

        return response.data;
      } catch (error) {
        throw new AplicacaoError(
          'Failed to update aplicacao',
          undefined,
          error
        );
      }
    });
  }

  public async deleteAplicacao(id: string): Promise<GSGenericResponse> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<
          GSResponse<GSGenericResponse>
        >(`/api/aplicacoes/${id}`);

        if (!this.validateResponse<GSGenericResponse>(response)) {
          throw new AplicacaoError('Invalid response format');
        }

        return response.data;
      } catch (error) {
        throw new AplicacaoError(
          'Failed to delete aplicacao',
          undefined,
          error
        );
      }
    });
  }
}

const Aplicacoes = (idFuncionalidade: string) =>
  new AplicacoesClient(idFuncionalidade);
export default Aplicacoes;
