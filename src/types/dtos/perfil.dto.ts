export interface CreatePerfilDTO {
  nome: string;
  ativo: boolean;
  clienteId?: string;
  licencaId?: string;
}

export interface UpdatePerfilDTO extends CreatePerfilDTO {
  id: string;
}

export interface PerfilDTO {
  id?: string;
  nome: string;
  ativo: boolean;
  clienteId?: string;
  licencaId?: string;
}

export interface PerfilFuncionalidadeDTO {
  perfilId?: string;
  funcionalidadeId?: string;
  authVer: boolean;
  authAdd: boolean;
  authChg: boolean;
  authDel: boolean;
  authPrt: boolean;
}
