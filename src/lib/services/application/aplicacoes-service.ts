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
            console.error('Formato de resposta inválido:', response);
            throw new AplicacaoError('Formato de resposta inválido');
          }

          return response;
        } catch (error) {
          throw new AplicacaoError(
            'Falha ao obter aplicacoes paginadas',
            undefined,
            error
          );
        }
      })
    );
  }

  public async getAplicacoes(): Promise<ResponseApi<GSResponse<Aplicacao[]>>> {
    const cacheKey = this.getCacheKey('GET', '/api/aplicacoes');
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<Aplicacao[]>>(
              '/api/aplicacoes'
            );

          if (!response.info || !response.info.data) {
            console.error('Formato de resposta inválido:', response);
            throw new AplicacaoError('Formato de resposta inválido');
          }

          return response;
        } catch (error) {
          throw new AplicacaoError(
            'Falha ao obter aplicacoes',
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
        if (error instanceof BaseApiError && error.data) {
          // If it's a validation error, return it as a response
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

  public async updateAplicacao(
    id: string,
    data: Aplicacao
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          Aplicacao,
          GSGenericResponse
        >(`/api/aplicacoes/${id}`, data);

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new AplicacaoError('Formato de resposta inválido');
        }

        return response;
      } catch (error) {
        throw new AplicacaoError(
          'Falha ao atualizar aplicacao',
          undefined,
          error
        );
      }
    });
  }

  public async deleteAplicacao(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          `/api/aplicacoes/${id}`
        );

        if (!response.info || !response.info.data) {
          console.error('Formato de resposta inválido:', response);
          throw new AplicacaoError('Formato de resposta inválido');
        }

        return response;
      } catch (error) {
        throw new AplicacaoError(
          'Falha ao deletar aplicacao',
          undefined,
          error
        );
      }
    });
  }
}

const AplicacoesService = (idFuncionalidade: string) =>
  new AplicacoesClient(idFuncionalidade);
export default AplicacoesService;
