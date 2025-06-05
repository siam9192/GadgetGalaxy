export interface IResponse<T> {
  data: T;
  meta: TMeta;
  error?: TError;
  success: boolean;
  message: string;
  status: number;
}

export type TError = {
  data: {
    message: string;
    stack: string;
    success: boolean;
  };
  status: number;
};

export type TMeta = {
  limit: number;
  page: number;
  totalResult: number;
  total: number;
};

export type TParma = {
  name: string;
  value: string | number | null | undefined;
};
