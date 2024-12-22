"use client"
import Image from 'next/image';
import React from 'react'
import { BsDot } from "react-icons/bs";
import assured_image from "@/assets/images/assured_image.png"
import { MdStar } from "react-icons/md";
import Link from 'next/link';

const ProductCard = ({product, bestSellingProduct}: any) => {
    console.log("product at product card ", product);
    console.log("best selling product ", bestSellingProduct);
  return (
    <div className={`flex pt-4 pb-6 justify-between p-4 ${product.length ? ("") : ("border-b-[1px] border-slate-300")}`}>
      <div className=' relative h-[200px] w-[200px]'>
        <img src={product?.images[0]} className={" max-h-[100%] max-w-[100%] absolute overflow-clip mx-auto my-auto top-0 bottom-0 right-0 left-0 hover:scale-105 duration-300"} />

        {
          bestSellingProduct[product._id] && (
            <div className=' absolute'>
              <p>Bestseller</p>
            </div>
          )
        }

      </div>

      <div className=' w-[350px] flex flex-col gap-3'>
        <h1 className=' font-semibold text-xl'>{product?.productName.substring(0, 60)}</h1>
        <div className=' flex gap-3'>
          <div className='flex gap-1 items-center bg-green-600 text-sm px-1 rounded-[3px] text-white'>
            {
              product?.averageRating ? (product?.averageRating) : (3.2)
            }
            <MdStar />
          </div>
          <h1 className=' opacity-60'>{`( ${product?.ratings.length ? (product?.ratings.length) : (1)} ) Ratings`}</h1>
        </div>

        <div className=' flex flex-col'>
          {
            product?.highlights.map((p:any, i:any) => {
              return(
                <p key={i} className=' flex gap-2 text-sm opacity-60'>
                  <BsDot />
                  {p}
                </p>
              )
            })
          }
        </div>
      </div>

      <div className=' flex flex-col gap-2 pr-9'>
        <div className='flex gap-3 items-center'>
          <h1 className=' font-semibold text-2xl'>{`₹${product?.sellPrice}`}</h1>
          <Image src={assured_image} alt='' className=' h-5 w-20'/>
        </div>
        <div className=' flex gap-3 items-center'>
          <p className=' opacity-60 line-through'>{`₹${product?.originalPrice}`}</p>
          <p className=' text-xs font-semibold text-green-700'>{`${product?.discount}% off`}</p>
        </div>
        <p className=' text-xs'>Bank offer</p>
        <p className=' text-xs font-semibold text-green-700'>Save extra with combo offers</p>
      </div>
    </div>
  )
}

export default ProductCard