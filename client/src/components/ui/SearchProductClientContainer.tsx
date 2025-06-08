'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react'
import Container from '../container/Container';
import SearchPageHeader from '../sections/search/SearchPageHeader';
import SearchPageFilterBox from './SearchPageFilterBox';
import ShowSearchProducts from '../sections/search/ShowSearchProducts';
import ProductsPagination from './ProductsPagination';
import { useGetSearchProductsQuery } from '@/redux/features/product/product.api';


function SearchProductClientContainer() {
  
  const searchParams = useSearchParams()

 const params = Array.from(searchParams.entries()).map(([name, value]) => ({
  name,
  value,
}));

  const {data,error,isLoading} = useGetSearchProductsQuery(params) 
  const products = data?.data || [];
  const meta = data?.meta;
  return (
    <div>
{/* <Container className="mt-3">
      {data?.meta && <SearchPageHeader meta={data?.meta} />}
      <div className="lg:grid grid-cols-7 gap-5 min-h-screen ">
        <div className="col-span-2 lg:block hidden">
          <SearchPageFilterBox />
        </div>
        <div className="col-span-5  ">
          {meta  || !isLoading ? (
            <div className="bg-blue-100 md:p-5 p-2">
              <ShowSearchProducts isLoading = {isLoading} products={products} searchParams={ Object.fromEntries(searchParams.entries())}/>
              <ProductsPagination meta={meta!} />
            </div>
          ) : (
            <div className="min-h-60 p-2">
              <img
                className="mx-auto"
                src="https://cdni.iconscout.com/illustration/premium/thumb/no-product-illustration-download-in-svg-png-gif-file-formats--ecommerce-package-empty-box-online-shopping-pack-e-commerce-illustrations-6632286.png?f=webp"
                alt=""
              />
              <h1 className="text-center text-black font-medium mt-4">No Products found</h1>
            </div>
          )}
        </div>
      </div>
    </Container> */}
    </div>
  )
}

export default SearchProductClientContainer