"use client"
import { RootState } from '@/redux/store/store';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import assuredimg from '@/assets/images/assured_image.png';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import {decreaseQuantityProduct, increaseQuantityProduct, removeProduct, setStepOfPayment} from '@/redux/slices/payment'
import { FaCheck } from 'react-icons/fa6';

const OrderSummaryCheckOut = () => {
  const {buyingProduct} = useSelector((state:RootState) => state.payment);
  console.log("buying product is --->>>>??? ", buyingProduct);
  const {stapeOfPayment} = useSelector((state: RootState) => state.payment);
  const dispatch = useDispatch();
  const router = useRouter();
  const [orderConfirm, setOrderConfirm] = useState<boolean>(false);

  function handleRemove(item:any){
    dispatch(removeProduct(item._id));
    toast.info("Removed item", {position: "bottom-center"});
  }

  useEffect(() => {
    if(buyingProduct.length === 0){
      toast.dark('choose at list one product ', {position: "bottom-center"});
      router.push('/');
    }
  }, []);

  return (
    <div className=' rounded-sm shadow-md'>
      {
        stapeOfPayment === 3 ? 
        (
          <div className=' flex flex-col  sidebar h-[87%] rounded-sm'>
            <div className=' flex bg-blue-500 py-3 items-center w-full rounded-sm px-6 gap-4'>
              <div className=' px-2 bg-white text-sm text-blue-600 h-fit rounded-sm'>3</div>
              <h1 className=' text-white font-semibold'>ORDER SUMMARY</h1>
            </div>
            {
              buyingProduct.length === 0 ? 
              (
                <div className='flex bg-white py-3 items-center w-full rounded-sm px-6 gap-4'>
                  <Link href={'/'} className='text-blue-600 text-sm font-medium underline'>Please select a product atlist</Link>
                </div>
              ) 
              : 
              (
                <div className=' flex flex-col gap-3'>
                  <div className=' bg-white rounded-sm shadow-md overflow-y-scroll sidebar'>
                    {
                      buyingProduct.map((item:any, i:any) => {
                        console.log("item at buying product -->> ", item);
                        return(
                          <div key={i} className={` flex w-full justify-between p-5 ${buyingProduct.length -1 !== i ? ' border-b border-gray-300' : ''}`}>
                            <div className='flex flex-col items-center gap-3'>
                              <img src={`${item?.images[0]}`} alt='' className=' h-24 w-20'/>

                              <div className=' flex gap-4 items-center'>
                                <button className=' border px-2 rounded-full' disabled={item.quantity===1} onClick={() => dispatch(decreaseQuantityProduct(item._id))} > - </button>
                                <div className=' border px-4'>{item.quantity}</div>
                                <button className=' border px-2 rounded-full' onClick={() => dispatch(increaseQuantityProduct(item._id))} > + </button>
                              </div>
                            </div>
                            <div className=' w-[60%] flex flex-col gap-3'>
                              <h1 className=' capitalize'>{item?.productName.substring(0, 50)}...</h1>
                              <div className=' flex items-center gap-3'>
                                <h1 className='text-sm opacity-60 capitalize'>Seller: {item?.seller?.businessName}</h1>
                                <Image src={assuredimg} alt='' className=' h-4 w-14'/>
                              </div>
                              <div className=' flex gap-3 items-center'>
                                <h1 className='text-sm line-through text-slate-500 font-medium'>₹{item?.originalPrice}</h1>
                                <h1 className=' font-semibold'>₹{item?.sellPrice}</h1>
                                <h1 className='text-xs font-medium text-green-600'>{item?.discount}% Off</h1>
                              </div>
                              <div className=' flex gap-5 font-semibold'>
                                <button onClick={() => handleRemove(item)}>REMOVE</button>
                              </div>
                            </div>
                            <div>
                              <h1 className=' text-sm'>Delivery in 2 days</h1>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                  <div className=' bg-white rounded-sm flex justify-between items-center px-3 py-3'>
                    <p className=' text-sm'>
                      Order Confirmation
                    </p> 
                    <button className=' px-10 py-3 bg-orange-500 font-semibold rounded-sm text-white'
                      onClick={() => {dispatch(setStepOfPayment(4)), setOrderConfirm(true)}}
                    >
                      CONTINUE
                    </button>
                  </div>
                </div>
                
              )
            }
            
          </div>
        ) 
        : 
        (
          <div>
            {
              orderConfirm ? 
              (
                <div className=' w-full flex justify-between bg-white items-center rounded-sm py-3 px-3'>
                  <div className=' flex flex-col gap-2 px-2'>
                    <div className=' flex items-center w-full rounded-sm gap-4'>
                      <div className=' px-2 bg-slate-200 text-blue-600 h-fit text-sm rounded-sm'>3</div>
                      <h1 className='  font-semibold text-gray-400'>ORDER SUMMARY</h1>
                      <FaCheck className=' text-blue-600' />
                    </div>
                    <h1 className=' font-semibold pl-12 text-sm' >{buyingProduct.length} item</h1>
                  </div>
                  <button onClick={() => dispatch(setStepOfPayment(3))} className=' border px-9 py-3 h-fit flex justify-center items-center rounded-sm text-sm font-semibold text-blue-600 border-gray-300'>
                    CHANGE
                  </button>
                </div>
              ) 
              : 
              (
                <div className=' w-full '>
                  <div className=' flex bg-white py-3 items-center w-full rounded-sm px-6 gap-4'>
                    <div className=' px-2 bg-slate-200 text-blue-600 h-fit text-sm rounded-sm'>3</div>
                    <h1 className='  font-semibold text-gray-400'>ORDER SUMMARY</h1>
                  </div>
                </div>
              )
            }
          </div>
        )
      }
    </div>
    
  )
}

export default OrderSummaryCheckOut