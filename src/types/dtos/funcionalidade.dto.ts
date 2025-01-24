export interface CreateFuncionalidadeDTO {
  nome: string;
  descricao: string;
  moduloId: string;
  ativo: boolean;
}

export interface UpdateFuncionalidadeDTO extends CreateFuncionalidadeDTO {
  id: string;
}

export interface FuncionalidadeDTO {
  id: string;
  nome: string;
  descricao: string;
  moduloId: string;
  ativo?: boolean;
}

export interface FuncionalidadePerfilDTO {
  id: string;
  moduloId: string;
  nome: string;
}
