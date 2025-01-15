export interface ICreateCategoryPayload {
  parentId: string;
  name: string;
  isFeatured: boolean;
  children: {
    name: string;
    isFeatured: boolean;
  }[];
}

export interface ICategoryFilterRequest {
  searchTerm?: string;
  parentId?: string | number;
}

export interface IUpdateCategoryPayload {
  id: string;
  name: string;
  isFeatured: boolean;
}
