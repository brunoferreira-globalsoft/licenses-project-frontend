type SearchParams = {
  nome?: string;
};

export const searchParamsCache = {
  parse: (params: {
    [key: string]: string | string[] | undefined;
  }): SearchParams => {
    return {
      nome: params.nome?.toString()
    };
  }
};
