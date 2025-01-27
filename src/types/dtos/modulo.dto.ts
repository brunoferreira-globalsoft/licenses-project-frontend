import { FuncionalidadeDTO } from './funcionalidade.dto';

export interface CreateModuloDTO {
  nome: string;
  descricao: string;
  ativo?: boolean;
  aplicacaoId?: string;
}

export interface UpdateModuloDTO extends CreateModuloDTO {
  id: string;
}

export interface ModuloDTO {
  id: string;
  nome: string;
  descricao: string;
  ativo?: boolean;
  aplicacaoId?: string;
  funcionalidades?: FuncionalidadeDTO[];
  aplicacao?: {
    nome: string;
  };
  createdOn: string;
}

export interface ModuloPerfilDTO {
  id: string;
  nome: string;
}
