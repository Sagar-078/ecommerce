"use client"
import React from 'react'
import ProductCard from './ProductCard';
import Link from 'next/link';

const CategoryProductSection = ({productData, bestSellingProduct}:any) => {

  console.log("product data ", productData);

  return (
    <div className=' w-[79%] h-full bg-white rounded-md'>
      {
        productData.length > 0 ? 
        (
          <div className=' flex flex-col h-full overflow-y-scroll'>
            {
              productData.map((product:any, i:any) => {
                return(
                  <Link href={`/product/${product._id}`} key={i}>
                    <ProductCard product={product} bestSellingProduct={bestSellingProduct} />
                  </Link>
                )
              })
            }
          </div>
        ) 
        : 
        (
          <div className=' flex w-full h-full justify-center items-center'>No Product Is There</div>
        )
      }
    </div>
  )
}

export default CategoryProductSection