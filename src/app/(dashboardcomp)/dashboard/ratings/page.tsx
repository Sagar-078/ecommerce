"use client"
import Loading from '@/components/loaders/Loading';
import { RootState } from '@/redux/store/store';
import { ratingReviewsUrl } from '@/services/sellerUrl';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { MdStar } from 'react-icons/md';
import { useSelector } from 'react-redux';

const page = () => {
    const {user} = useSelector((state:RootState) => state.authUser);
    const [ratedProduct, setRatedProduct] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    console.log(" rated product is -==:>> ", ratedProduct);

    // console.log("user at ratings -=>>::: ", user);

    async function getRatings(){
        try{

            const response:any = await axios.post(ratingReviewsUrl.findRatings, {
                userId: user._id
            })

            console.log("response of get ratings -=-=>>> ", response);
            setRatedProduct(response?.data?.Ratings)

        }catch(error:any){
            console.log("error while get ratings -=>> ", error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        getRatings();
    }, []);

  return (
    <div className='h-full bg-white'>
        {
           loading ? (<Loading/>) 
           : 
            (
                <div className=' h-full bg-slate-200 flex flex-col gap-4'>
                    {
                        ratedProduct.map((product:any, i:any) => {
                            return(
                                <div className='flex justify-between p-4 bg-white rounded-md' key={i}>
                                    <img src={product?.product?.images[0]} height={100} width={100}/>
                                    <div className=' flex flex-col w-[80%] gap-1'>

                                        <h1 className=' text-lg font-semibold'>{product?.product?.productName}</h1>

                                        <div className=' flex gap-4'>
                                            <div className=' flex gap-2'>
                                                <p>Average rating :</p>

                                                <div className='flex gap-1 items-center bg-green-600 w-fit text-sm px-1 rounded-[3px] text-white'>
                                                    {
                                                        product?.product?.averageRating
                                                    }
                                                    <MdStar />
                                                </div>
                                            </div>

                                            <h1 className=' opacity-60'>({product?.product?.numberOfRatings}) number of ratings</h1>

                                        </div>

                                        <div className=' flex flex-col gap-3'>

                                            <div className=' flex gap-2'>
                                                <p>Your Rating & review :</p>
                                                <div className=' gap-0.5 flex items-center text-sm rounded-sm text-white font-semibold bg-yellow-500 w-fit px-2'>
                                                    {product?.rating}
                                                    <MdStar className='text-lg' />
                                                </div>
                                            </div>
                                            <div className=' w-[50%] pl-3 font-semibold text-base text-gray-400'>
                                                {product?.review}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>
            ) 
        }
    </div>
  )
}

export default page