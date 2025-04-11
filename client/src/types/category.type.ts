export interface ICategory {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  description: string;
  parentId?: number;
  isFeatured: boolean;
  parent?: ICategory;
  children: ICategory[];
  isVisible: boolean;
  status: ECategory;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export enum ECategory {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
}
