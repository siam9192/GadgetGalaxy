interface IBrand {
  id: number;
  name: string;
  description: string;
  logoUrl: string;
  origin: string;
  isPopular: boolean;
  isTop: boolean;
  isFeatured: boolean;
  _count: {
    products: number;
  };
  createdAt: string;
  updatedAt: string;
}
