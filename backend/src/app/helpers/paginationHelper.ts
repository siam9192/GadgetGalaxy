import { IPaginationOptions } from "../interfaces/pagination";

interface IOptionsResult {
  page: number;
  limit: number;
  skip: number;
  sortOrder: string;
  orderBy: string;
}
export const calculatePagination = (
  options: IPaginationOptions,
): IOptionsResult => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 12;
  const sortOrder = options.orderBy || "desc";
  const orderBy = options.sortOrder || "createdAt";
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    sortOrder,
    orderBy,
  };
};
