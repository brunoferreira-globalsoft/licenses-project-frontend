import { z } from 'zod';

const searchParamsSchema = z
  .object({
    nome: z.string().nullable().optional(),
    descricao: z.string().nullable().optional(),
    ativo: z
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
