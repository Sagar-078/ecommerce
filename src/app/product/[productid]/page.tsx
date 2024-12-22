"use client"
import { productUrl } from '@/services/sellerUrl';
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { MdStar } from 'react-icons/md';
import { MdLocalOffer } from "react-icons/md";
import { BsDot } from "react-icons/bs";
import { PiShoppingCartFill } from "react-icons/pi";
import { BsFillLightningFill } from "react-icons/bs";
import assured_image from "@/assets/images/assured_image.png"
import Image from 'next/image';
import { GoQuestion } from "react-icons/go";
import Loading from '@/components/loaders/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store/store';
import { toast } from 'react-toastify';
import { addToCartItem } from '@/redux/slices/cart';
import { useRouter } from 'next/navigation';
import { setBuyingProduct } from '@/redux/slices/payment';

const page = () => {

  const {productid} = useParams();
  const dispatch:AppDispatch = useDispatch();
  const [product, setProduct] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const {cart} = useSelector((state:RootState) => state.cartitem);
  const {token} = useSelector((state:RootState) => state.authToken);
  const router = useRouter();

  console.log("cart items are =????.>>> ", cart);

  // console.log("Cart items array length:", cart.length);
  // console.log("Cart items content:", cart.filter((item:any) => item));

  const addToCartHandler = () => {
    console.log("Product before adding to cart:", product);
    dispatch(addToCartItem(product)); 
    toast.success("Added to cart", { position: "bottom-center" });
  }

  async function getProduct(){
    try{
      const response = await axios.get(`${productUrl.getProduct}/${productid}`);
      console.log("response of get product ", response);
      if(response.status === 200){
        setProduct(response?.data?.Product);
        setLoading(false);
      }
      // setProductImage(response?.data?.Product?.images);
    }catch(error:any){
      console.log("error while get product ", error);
    } finally{
      setLoading(false);
    }
  }

  function wayToPaymentPath(){
    if(!token){
      router.push('/signin');
      toast.info('Please signin first', {position: "bottom-center"});
    }else{
      dispatch(setBuyingProduct(Array.isArray(product) ? product : [product]));
      router.push('/payment');
    } 
  }

  useEffect(() => {
    getProduct();
  }, [])

  return (
    <>
      {
        loading ? (<Loading/>) 
        : 
        (
          <div className='w-[85vw] h-[95vh] flex mx-auto mt-1 pt-6 px-8 bg-white justify-between gap-10'>
            <div className=' flex gap-4'>
              <div className=' flex flex-col gap-3'>
                {
                  product?.images.map((image:any, i:any) => {
                    return(
                      <img src={image} alt='pro img'
                        onClick={() => setCurrentImage(i)}
                        className={`h-20 w-24 rounded-md object-contain border p-1 ${currentImage === i ? (' border-blue-600 border-[1px]') : ('border-gray-300')}`} key={i} 
                      />
                    )
                  })
                }
              </div>

              <div className=' h-[500px] w-[500px]'>
                <div className=' h-full w-full bg-white flex flex-col items-center justify-center border-[0.5px] border-gray-300 rounded-sm'>
                  <img src={product?.images[currentImage]} alt='' className=' w-[400px] h-[450px] object-contain'/>
                </div>

                {
                  product?.numberOfProducts === 0 ? 
                  (
                    <div className=' text-red-400 mt-8 text-base text-center font-medium'>
                      Currently this product out of stock
                    </div>
                  ) 
                  : 
                  (
                    <div className=' w-full mt-8 flex justify-between'>
                      {
                        cart.find((item:any) => item._id === productid) ? 
                        (
                          <button onClick={() => {router.push("/cart")}} className=' w-[48%] bg-amber-500 py-4 rounded-sm flex gap-1 items-center justify-center text-white font-semibold'>
                            <PiShoppingCartFill />Go To Cart
                          </button>
                        ) 
                        : 
                        (
                          <button className=' w-[48%] bg-amber-500 py-4 rounded-sm flex gap-1 items-center justify-center text-white font-semibold'
                            onClick={addToCartHandler}
                          ><PiShoppingCartFill /> ADD TO CART</button>
                        )
                      }
                  
                      <button onClick={wayToPaymentPath}
                        className=' w-[48%] bg-orange-500 py-4 rounded-sm flex gap-1 items-center justify-center text-white font-semibold'>
                        <BsFillLightningFill /> BUY NOW
                      </button>
                    </div>
                  )
                }

              </div>

            </div>

            <div className=' flex flex-col pt-3 gap-4 overflow-y-scroll sidebar pb-10'>
              <h1 className=' text-xl font-bold'>{product?.productName}</h1>

              <div className=' flex gap-3 items-center'>
                <div className='flex gap-1 items-center bg-green-600 text-sm px-1 rounded-[3px] text-white'>
                  {
                    product?.averageRating ? (product?.averageRating) : (3.2)
                  }
                  <MdStar />
                </div>
                <h1 className=' opacity-60'>{`( ${product?.ratings.length ? (product?.ratings.length) : (1)} ) Ratings`}</h1>
                
                <Image src={assured_image} alt='' className=' h-5 w-20'/>
              
              </div>
        
              <div className=' flex gap-3 items-baseline'>
                <p className=' font-bold text-3xl'>₹{product?.sellPrice}</p>
                <p className=' opacity-60 line-through'>₹{product?.originalPrice}</p>
                <p className=' font-semibold text-sm text-green-600'>{product?.discount}% off</p>
              </div>

              <div className=' flex flex-col gap-2'>
                <h1 className=' font-semibold text-lg'>Available offers</h1>
                <div className=' flex flex-col gap-2'>
                  <p className=' flex items-center gap-2 text-sm'><MdLocalOffer className='text-green-600 text-lg' />Bank Offer5% Unlimited Cashback on Flipkart Axis Bank Credit Card</p>
                  <p className=' flex gap-2 text-sm'><MdLocalOffer className='text-green-600 text-lg'/>Bank Offer10% off up to ₹1,500 on Axis Bank Credit Card (incl. migrated ones) on orders of ₹4,990 and above</p>
                  <p className=' flex gap-2 text-sm'><MdLocalOffer className='text-green-600 text-lg'/>Bank Offer10% off up to ₹1,750 on Axis Bank Credit EMI (incl. migrated ones) on orders of ₹4,990 and above</p>
                  <p className=' flex gap-2 text-sm'><MdLocalOffer className='text-green-600 text-lg'/>Partner OfferMake a purchase and enjoy a surprise cashback/ coupon that you can redeem later!</p>
                  <p className=' flex gap-2 text-sm'><MdLocalOffer className='text-green-600 text-lg'/>Bank Offer10% off up to ₹1,500 on BOBCARD Transactions, on orders of ₹4,990 and above</p>
                  <p className=' flex gap-2 text-sm'><MdLocalOffer className='text-green-600 text-lg'/>Bank Offer10% off up to ₹1,750 on BOBCARD EMI Transactions, on orders of ₹4,990 and above</p>
                  <p className=' flex gap-2 text-sm'><MdLocalOffer className='text-green-600 text-lg'/>Bank Offer10% off up to ₹1,500 on RBL Bank Credit Card Transactions, on orders of ₹4,990 and above</p>
                  <p className=' flex gap-2 text-sm'><MdLocalOffer className='text-green-600 text-lg'/>Bank Offer10% off up to ₹1,750 on RBL Bank Credit Card EMI Transactions, on orders of ₹4,990 and above</p>
                  <p className=' flex gap-2 text-sm'><MdLocalOffer className='text-green-600 text-lg'/>Bank Offer10% off up to ₹1,500 on YesBank Credit Card Transactions, on orders of ₹4,990 and above</p>
                  <p className=' flex gap-2 text-sm'><MdLocalOffer className='text-green-600 text-lg'/>Bank Offer10% off up to ₹1,750 on YesBank Credit Card EMI Transactions, on orders of ₹4,990 and above</p>
                </div>
              </div>

              <div className=' flex gap-4 mt-2'>
                <h1 className=' opacity-50 font-semibold'>Highlights</h1>
                <div className=' w-[300px] mt-2 flex flex-col justify-center'>
                  {
                    product?.highlights.map((highlight:any, i:any) => {
                      return(
                        <p className='flex gap-2 text-sm' key={i}><BsDot className='text-2xl opacity-40 font-bold'/> {highlight}</p>
                      )
                    })
                  }
                </div>
              </div>
        
              <div className='flex gap-6'>
                <h1 className=' opacity-50 font-semibold'>Seller</h1>
                <div className=' flex flex-col gap-5'>
                  <h1 className=' font-semibold text-blue-600 capitalize flex gap-4'>
                    {product?.seller?.businessName}
                    <div className=' flex p-1 px-2 items-center justify-center gap-1 rounded-xl bg-blue-600 text-white text-xs '>
                      3.9 <MdStar />
                    </div>
                  </h1>
                  <p className='flex gap-2 text-sm items-center'><BsDot className='text-2xl opacity-40 font-bold'/> 7 Days Replacement Policy <GoQuestion  className=' text-sm opacity-30'/></p>
                </div>
              </div>

              <div className=' flex gap-4'>
                <h1 className=' opacity-50 font-semibold'>Description</h1>
                <p className='text-sm'>
                  {
                    product?.description
                  }
                </p>
              </div>

              {
                product?.ratings.length !== 0 && (

                  <div className='flex gap-4 mt-4'>
                    <h1 className=' opacity-50 font-semibold'>Ratings and Reviews</h1>
                    <div className=' mt-8 flex flex-col gap-3 w-[40%] rounded-md '>
                      {
                        product?.ratings.map((rating:any, i:any) => {
                          return(
                            <div key={i} className=' flex items-start px-3 py-2 rounded-md bg-slate-200 gap-4'>
                              <img src={rating?.userProfile} alt='' height={40} width={40}/>
                              <div className=' flex flex-col mt-3 gap-1'>
                                <p className=' font-semibold text-sm'>{rating?.userName}</p>
                                <div className=' flex items-center gap-2'>
                                  <p className=' text-sm'>{rating?.rating}</p>
                                  <MdStar className=' text-yellow-800' />
                                </div>
                                <p className=' text-xs'>{rating?.review}</p>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>

                )
              }

            </div>
          </div>
        )
      }
    </>
    
  )
}

export default page