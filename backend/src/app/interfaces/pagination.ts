export interface IPaginationOptions {
  page?: string | number;
  limit?: number;
  sortOrder?: string | undefined;
  orderBy?: string;
}

enum OrderBy {}
// ASC = ''
