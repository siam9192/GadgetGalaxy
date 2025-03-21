import { TSortOrder } from "./util.interface";

export interface IPaginationOptions {
  page?: string | number;
  limit?: number;
  sortOrder?: TSortOrder;
  orderBy?: string;
}

enum OrderBy {}
// ASC = ''
