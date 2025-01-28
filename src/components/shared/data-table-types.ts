export type DataTableFilterField<TData> = {
  label: string;
  value: keyof TData | string;
  order?: number;
};
