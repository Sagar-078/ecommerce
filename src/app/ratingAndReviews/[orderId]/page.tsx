"use client"
import Loading from '@/components/loaders/Loading'
import Ratings from '@/components/starRating'
import { RootState } from '@/redux/store/store'
import { ratingReviewsUrl } from '@/services/sellerUrl'
import axios from 'axios'
import { usePathname, useSearchParams } from 'next/navigation'
import { NextResponse } from 'next/server'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdStar } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const page = () => {
  const pathname = usePathname();
  const {user} = useSelector((state:RootState) => state.authUser);
  const productid = useSearchParams().get("productid");
  const orderid = pathname.split("/")[2];
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>('');
  const [existRating, setExistRating] = useState(false);
  const {register,handleSubmit,formState:{errors},setValue}=useForm();
  const [ratings, setRatings] = useState(0);
  console.log("product is ---===>>>>> ", product);
  console.log("user is -==>> ", user);

  async function getRatingandReviews(){
    try{
      const response = await axios.post(ratingReviewsUrl.getRatingAndReview, {userId: user._id, productId: productid, orderId: orderid});

      console.log("response of get rating and reviews =-==>> ", response);
      if(!response.data.success){
        console.log("response of product is --==0-0>>",response.data.Product);
        setProduct(response.data.Product);
      }
      else if(response.data.success){
        setProduct(response.data.Product);
        setExistRating(true);
        setRatings(response.data.Rating.rating);
        setValue('review', response.data.Rating.review);
      }

    }catch(error:any){
      console.log("error while get rating and reviews ==[=>> ", error);
    }finally{
      setLoading(false);
    }
  }

  async function createReview(data:any){
    const loading = toast.loading("Please wait...", {position: "bottom-center"});
    try{
      
      const response = await axios.post(ratingReviewsUrl.createRating, {
        userId:user._id, userName:user.firstName, userEmail:user.email, userProfile:user.profilePhoto, productId:product._id, rating:ratings, review:data.review
      });

      console.log("response of crate review -=> ", response);

      if(response.data.success){
        await getRatingandReviews();
        toast.success('successfully create rating & reviews', {position: "bottom-center"});
      }

    }catch(error:any){
      console.log("error while creating review --==> ", error);
    }finally{
      toast.dismiss(loading);
    }
  }

  useEffect(() => {
    getRatingandReviews();
  }, []);

  return (
    <div>
      {
        loading ? (<Loading/>) 
        : 
        (
          <div className=' w-full h-full mt-6 flex flex-col'>
            <div className=' flex w-[97%] mx-auto rounded-md shadow-lg justify-between bg-white p-4 items-center '>
              <h1 className=' font-semibold text-lg'>Ratings & Reviews</h1>
              <div className=' flex gap-6 p-2'>
                <img src={product?.images[0]} alt='' height={30} width={40}/>
                <div className=' flex flex-col gap-2'>
                  <h1 className=' text-sm font-semibold'>{product?.productName.substring(0, 30)}...</h1>
                  <div className=' flex gap-2'>
                    <div className='flex gap-1 items-center w-fit bg-green-600 text-sm px-1 rounded-[3px] text-white'>
                      {
                        product?.averageRating ? (product?.averageRating) : (3.2)
                      }
                      <MdStar />
                    </div>
                    <h1 className=' opacity-60'>{`( ${product?.ratings.length ? (product?.ratings.length) : (1)} ) Ratings`}</h1>
                  </div>
                </div>
              </div>
            </div>

            <div className=' w-[97%] mx-auto mt-8 flex justify-between'>
              <div className=' w-[30%] bg-white p-3 flex flex-col rounded-md shadow-lg'>
                <h1 className=' font-semibold text-lg mb-2'>What makes a good review</h1>
                <div className=' flex flex-col gap-1 border-[1.5px] rounded-sm p-2 py-2'>
                  <p className=' font-semibold'>Have you used this product?</p>
                  <p className=' text-sm'>Your review should be about your experience with the product</p>
                </div>
                <div className=' flex flex-col gap-1 border-[1.5px] rounded-sm p-2 py-2'>
                  <p className=' font-semibold'>Why review a product?</p>
                  <p className=' text-sm'>Your valuable feedback will help fellow shoppers decide!</p>
                </div>
                <div className=' flex flex-col gap-1 border-[1.5px] rounded-sm p-2 py-2'>
                  <p className=' font-semibold'>How to review a product?</p>
                  <p className=' text-sm'>Your review should include facts. An honest opinion is always appreciated. If you have an issue with the product or service please contact us from the help centre</p>
                </div>
              </div>
              <div className=' w-[69%] bg-white shadow-lg rounded-md p-4 flex flex-col gap-2'>
                <div className=" w-full flex flex-col">
                  <div className="pb-4 border-b-[1px] border-slate-400 w-full flex flex-col gap-3">
                    <h1 className=" font-bold ">{
                      existRating?"Your rating":"Rate this product"
                    }</h1>
                    <Ratings ratings={ratings} setRatings={setRatings}/>
                  </div>
                </div>
                <div className=" flex flex-col gap-3">
                  <h1 className=" font-bold">
                    {
                      existRating?"Your review":"Review this product"
                    }
                  </h1>
                  <textarea readOnly={existRating} rows={6} className=" border-[1px] border-slate-300 rounded-md p-3" placeholder="Write your review here..."
                    {
                      ...register("review",{required:true})
                    } 
                  ></textarea>
                  {
                    errors.review && <span className=" text-red-500">Review is required</span>
                  }
                </div>
                <div className=" flex  justify-end">
                  {
                    existRating?(<p className="text-green-800">Thank For your review</p>):(
                      <button  onClick={handleSubmit(createReview)} className=" px-5 py-2 bg-orange-500 text-white  rounded-md">SUBMIT</button>
                    )
                  }
                </div>


              </div>
            </div>

          </div>
        )
      }
    </div>
  )
}

export default page