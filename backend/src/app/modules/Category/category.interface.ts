export interface ICreateCategoryPayload {
  parentId?: number;
  name: string;
  imageUrl?: string;
  isFeatured: boolean;
  isVisible?: boolean;
  children: {
    name: string;
    isFeatured: boolean;
    imageUrl?:string
  }[];
}

export interface ICategoryFilterRequest {
  searchTerm?: string;
  parentId?: string | number;
}

export interface IUpdateCategoryPayload {
  name?: string;
  imageUrl?: string;
  isFeatured: boolean;
  isVisible?: boolean;
}
