import { Shop } from "@prisma/client";

interface ICreateShopData {
  name: string;
  logo: string;
  description: string;
}

export interface IShopFilterData {
  searchTerm?: string;
}

export type IUpdateShopData = Partial<Shop>;
