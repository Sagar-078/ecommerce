"use client"
import React from 'react'
import { MdStar } from 'react-icons/md';

const SearchedProducts = ({product}:any) => {
    console.log("product is =>>> ", product);

  return (
    <div className=' w-[300px] p-2'>
        <div className=' flex flex-col items-center w-full h-full gap-3 justify-around'>
            <img src={product?.images[0]} className=' h-[200px] w-[170px] object-contain'/>
            <div className=' flex flex-col gap-2'>
                <h1 className=' text-sm'>{product?.productName.substring(0, 50)}</h1>
                <div className=' flex gap-3'>
                    <div className='flex gap-1 items-center bg-green-600 text-xs px-1 rounded-[3px] text-white'>
                        {
                        product?.averageRating ? (product?.averageRating) : (3.2)
                        }
                        <MdStar />
                    </div>
                    <h1 className=' opacity-60 text-sm'>{`( ${product?.ratings.length ? (product?.ratings.length) : (1)} ) Ratings`}</h1>
                </div>
                <div className=' flex gap-3 items-center'>
                    <p className=' font-semibold text-lg'>{`₹${product?.sellPrice}`}</p>
                    <p className=' opacity-60 line-through text-sm'>{`₹${product?.originalPrice}`}</p>
                    <p className=' text-xs font-semibold text-green-700'>{`${product?.discount}% off`}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SearchedProducts