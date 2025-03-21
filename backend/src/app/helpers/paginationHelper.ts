import { IPaginationOptions } from "../interfaces/pagination";
import { ESortOrder, TSortOrder } from "../interfaces/util.interface";

interface IOptionsResult {
  page: number;
  limit: number;
  skip: number;
  sortOrder: TSortOrder;
  orderBy: string;
}
export const calculatePagination = (
  options: IPaginationOptions,
): IOptionsResult => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 12;
  const sortOrder: ESortOrder = Object.values(ESortOrder).includes(
    options.sortOrder as ESortOrder,
  )
    ? (options.sortOrder as ESortOrder)
    : ESortOrder.DESC;
  const orderBy = options.orderBy || "createdAt";
  const skip = (page - 1) * limit;
  return {
    page,
    limit,
    skip,
    sortOrder,
    orderBy,
  };
};
