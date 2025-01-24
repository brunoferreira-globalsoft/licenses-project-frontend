import { User } from '@/types/models';

export interface Area {
  id?: string;
  nome: string;
}

export interface Aplicacao {
  id: string;
  nome: string;
  descricao: string;
  versao: string;
  ativo: boolean;
  areaId: string;
  area?: {
    nome: string;
  };
  createdOn: string;
}

export type CreateAplicacaoRequest = {
  nome: string;
  descricao: string;
  versao: string;
  ativo: boolean;
  areaId: string;
};

export interface CreateAplicacaoDTO {
  id: string;
  nome: string;
  descricao: string;
  versao: string;
  ativo: boolean;
  areaId: string;
}

export interface UpdateAplicacaoDTO {
  nome: string;
  descricao: string;
  versao: string;
  ativo: boolean;
  areaId: string;
}

export interface CreateAreaDTO {
  id: string;
  nome: string;
}

export interface BloqueioLicenca {
  motivoBloqueio: string;
}

export interface Cliente {
  id: string;
  nome: string;
  sigla: string;
  dadosExternos?: boolean;
  dadosUrl?: string;
  ativo?: boolean;
  nif?: string;
}

export interface Funcionalidade {
  id: string;
  nome: string;
  descricao: string;
  moduloId: string;
  ativo?: boolean;
}

export interface FuncionalidadePerfil {
  id: string;
  moduloId: string;
  nome: string;
}

export interface LicencaModulo {
  licencaId: string;
  moduloId: string;
}

export interface Licenca {
  id: string;
  nome: string;
  dataInicio?: Date;
  dataFim?: Date;
  numeroUtilizadores: number;
  ativo?: boolean;
  aplicacaoId: string;
  bloqueada?: boolean;
  dataBloqueio?: Date;
  motivoBloqueio?: string;
  nomeCliente?: string;
  nomeAplicacao?: string;
  aplicacao?: {
    nome: string;
  };
  cliente?: {
    nome: string;
  };
  clienteId: string;
  licencasFuncionalidades?: LicencaFuncionalidade[];
  licencasModulos?: LicencaModulo[];
}

export interface LicencaFuncionalidade {
  licencaId: string;
  funcionalidadeId: string;
}

export interface LicencaUtilizador {
  utilizadorId: string;
  utilizador?: User;
  ativo: boolean;
}

export interface Modulo {
  id: string;
  nome: string;
  descricao: string;
  ativo?: boolean;
  aplicacaoId?: string;
  funcionalidades?: Funcionalidade[];
}

export interface ModuloPerfil {
  id: string;
  nome: string;
}

export interface Perfil {
  id?: string;
  nome: string;
  ativo: boolean;
  clienteId?: string;
  licencaId?: string;
}

export interface PerfilFuncionalidade {
  perfilId?: string;
  funcionalidadeId?: string;
  authVer: boolean;
  authAdd: boolean;
  authChg: boolean;
  authDel: boolean;
  authPrt: boolean;
}

export interface UpdateModulosFuncionalidadesRequest {
  FuncionalidadeId: string;
  ModuloId: string;
}

export interface SaveReport {
  filename: string;
  content: string;
}

export interface Permission {
  funcionalidadeId: string;
  permissao: number;
}

export interface DynamicPermission {
  [key: string]: number;
}

export interface PermissaoFuncionalidade {
  AuthVer: boolean;
  AuthAdd: boolean;
  AuthChg: boolean;
  AuthDel: boolean;
  AuthPrt: boolean;
}
