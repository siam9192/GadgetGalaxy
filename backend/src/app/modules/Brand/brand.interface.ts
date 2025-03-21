export interface ICreateBrandPayload {
  name: string;
  description: string;
  logoUrl: string;
  origin?: string;
  isPopular?: boolean;
}

export interface IFilterBrands {
  searchTerm?: string;
  origin?: string;
}

export interface IUpdateBrandPayload {
  name?: string;
  description?: string;
  logoUrl: string;
  origin?: string;
  isPopular?: boolean;
}
