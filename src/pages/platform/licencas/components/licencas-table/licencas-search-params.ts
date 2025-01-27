import { z } from 'zod';

const searchParamsSchema = z
  .object({
    nome: z.string().nullable().optional(),
    clienteId: z.string().nullable().optional(),
    aplicacaoId: z.string().nullable().optional(),
    ativo: z
      .string()
      .transform((val) => val === 'true')
      .nullable()
      .optional(),
    bloqueada: z
      .string()
      .transform((val) => val === 'true')
      .nullable()
      .optional()
  })
  .partial();

export const searchParamsCache = {
  parse: (searchParams: { [key: string]: string | string[] | undefined }) => {
    return searchParamsSchema.parse(
      Object.fromEntries(
        Object.entries(searchParams).map(([key, value]) => [
          key,
          Array.isArray(value) ? value[0] : value
        ])
      )
    );
  }
};
