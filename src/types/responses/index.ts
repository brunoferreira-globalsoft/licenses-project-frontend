import { FuncionalidadePerfil, ModuloPerfil } from '@/types/entities';

import { Funcionalidade } from '@/types/entities';

export interface ResponseApi<T> {
  info: T;
  status: number;
  statusText: string;
}

export interface ResponseAplicacao {
  ativo: boolean;
  descricao: string;
  id: string;
  modulos: ResponseModulo[];
  nome: string;
  createdOn: string;
  versao: string;
}

export interface ResponseCliente {
  id: string;
  nome: string;
  sigla: string;
  dadosExternos?: boolean;
  ativo?: boolean;
  dadosUrl?: string;
  nif?: string;
}

export interface ResponseFuncionalidade {
  id: string;
  nome: string;
  createdOn: string;
  moduloId: string;
  descricao: string;
  ativo?: boolean;
}

export interface ResponseLicenca {
  id: string;
  nome: string;
  dataInicio?: Date;
  dataFim?: Date;
  numeroUtilizadores: number;
  ativo?: boolean;
  aplicacaoId: string;
  clienteId: string;
  nomeCliente?: string;
  nomeAplicacao?: string;
  aplicacao: {
    nome: string;
  };
  cliente: {
    nome: string;
  };
}

export interface ResponseLogin {
  token: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
}

export interface ResponseModulo {
  id: string;
  nome: string;
  createdOn: string;
  aplicacaoId?: string;
  descricao: string;
  ativo?: boolean;
  funcionalidades: Funcionalidade[];
}

export interface ResponseModuloFuncionalidadeLicenca {
  modulos: ModuloPerfil[];
  funcionalidades: FuncionalidadePerfil[];
}

export interface ResponsePerfil {
  id: string;
  nome: string;
  ativo: boolean;
}

export interface ResponsePaginatedCliente {
  data: ResponseCliente[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export class ResponseUser {
  id = '';
  imageUrl = '';
  firstName = '';
  lastName = '';
  email = '';
  isActive = false;
  phoneNumber = '';
  roleId = '';
  clienteId = '';
  perfisUtilizador?: string[];
}
