"use client"
import Loading from '@/components/loaders/Loading';
import { RootState } from '@/redux/store/store';
import axios from 'axios';
import Image from 'next/image';
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import coin from '@/assets/images/b24f2613-b89e-4e0a-8140-1316ad11f394.webp'
import axisimg from '@/assets/images/download.svg';
import lockin from '@/assets/images/lockinEarlyAccess_e0bd6e.png';
import { AiOutlineQuestionCircle } from "react-icons/ai";
import date from 'date-and-time'
import OrderProgressBar from '@/components/OrderProgressBar';
import { toast } from 'react-toastify';
import { NextResponse } from 'next/server';

const page = () => {
  const {token} = useSelector((state:RootState) => state.authToken);
  const pathname = usePathname();
  const productid = useSearchParams().get("productid");
  console.log("product id is ---===:::>>> ", productid);
  const orderid = pathname.split("/")[2];
  console.log("order id is ---====>>> ", orderid);
  const [loading, setLoading] = useState<boolean>(true);
  const [orderdetails, setOrderdetails] = useState<any>();
  console.log("order details --==>> ", orderdetails);
  const [indexOfproductdetails, setIndexOfProductDetails] = useState(0)
  console.log("exact index of product details is ===:::>>>> ", indexOfproductdetails);

  async function getOrderDetails (){
    try{
      const response = await axios.get(`/api/order/getOrderDetails/${orderid}`, {
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      console.log("response of get order detils ", response);
      if(response.status === 200){
        setOrderdetails(response?.data?.OrderDetails);
        setIndexOfProductDetails(response?.data?.products.findIndex((i:any) => i._id === productid));
      }

    }catch(error:any){
      console.log("error while get order details --==>> ", error);
    }finally{
      setLoading(false);
    }
  }

  async function cancelhandler() {
    const loading = toast.loading('Please wait your request in process...', {position: "bottom-center"});
    try{
      console.log("product id and order id before call api --=>", productid, orderid);
      const response = await axios.put(`/api/order/getOrderDetails/${orderid}`, {productid:productid},{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      console.log("response of cancel handler ", response);
      if(response.status === 200){
        toast.success('Order cancelled successfully', {position: "bottom-center"});
        getOrderDetails();
      }

    }catch(error:any){
      console.log("error while cancel order ", error);
      toast.error('Error while cancel order', {position: 'bottom-center'});
    }finally{
      toast.dismiss(loading);
    }
  }

  useEffect(() => {
    getOrderDetails()
  }, []);

  return (

    <>
      {
        loading ? (<Loading/>) 
        : 
        (
          <div className=' h-full w-full'>
            <div className=' w-[95%] mx-auto rounded-md p-6 gap-10 bg-white shadow-xl flex mt-8'>
              <div className=' w-[30%] flex flex-col gap-1 border-r-[2px]'>
                <div className=' flex flex-col gap-1'>
                  <h1 className=' text-lg font-semibold'>Delivery Address</h1>
                  <h1 className=' font-semibold capitalize'>{orderdetails?.deliveryAddress?.fullName}</h1>
                </div>
                <div>
                  {orderdetails?.deliveryAddress?.address}, {orderdetails?.deliveryAddress?.landmark},{orderdetails?.deliveryAddress?.state}-{orderdetails?.deliveryAddress?.pincode}, {orderdetails?.deliveryAddress?.district}
                </div>
                <h1 className=' flex gap-2 items-center text-sm'><span className=' font-semibold'>Phone number </span> {orderdetails?.deliveryAddress?.mobileNumber}</h1>
              </div>
              <div>
                {
                  orderdetails?.products[indexOfproductdetails].status === "cancelled" ? 
                  (
                    <div className=' flex flex-col gap-3'>
                      <h1 className=' font-semibold'>Your Rewords</h1>
                      <div className='flex items-center gap-3'>
                        <Image src={lockin} alt='' height={30} width={30}/>
                        <div className=' flex flex-col gap-1'>
                          <h1 className=' text-sm'>Early Access to this Sale</h1>
                          <h1 className=' text-xs opacity-60'>For Flipkart Plus Members</h1>
                        </div>
                      </div>
                    </div>
                  ) 
                  : 
                  (
                    <div className=' flex flex-col gap-3'>
                      <h1 className=' font-semibold'>Your Rewords</h1>
                      <div className=' flex flex-col gap-3'>
                        <div className='flex items-center gap-3'>
                          <Image src={coin} alt='' height={30} width={30}/>
                          <div className=' flex flex-col gap-1'>
                            <h1 className=' text-sm'>{orderdetails?.supercoinsearned} SuperCoins Cashback</h1>
                            <h1 className=' text-xs opacity-60'>Use it to save on your next order</h1>
                          </div>
                        </div>
                        <div className='flex items-center gap-3'>
                          <Image src={axisimg} alt='' height={30} width={30}/>
                          <div className=' flex flex-col'>
                            <h1 className=' text-sm'>5% Cashback on Flipkart Axis Bank Card</h1>
                            <h1 className=' text-xs opacity-60'>To be adjusted in your June statement</h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>

            <div className=' w-[95%] mx-auto rounded-md p-8 mt-8 bg-white shadow-xl flex gap-10 items-center'>
              <img src={orderdetails?.products[indexOfproductdetails]?.images[0]} alt='' height={100} width={90}/>
              <div className=' flex flex-col gap-2 w-[30%]'>
                <h1 className='font-medium'>{orderdetails?.products[indexOfproductdetails]?.productName}</h1>
                <h1 className=' text-sm opacity-40'>seller: {orderdetails?.products[indexOfproductdetails]?.seller?.businessName}</h1>
                <div className=' flex items-center gap-3'>
                  <h1 className=' font-semibold'>₹{orderdetails?.products[indexOfproductdetails]?.sellPrice.toLocaleString()}</h1>
                  <p className=' flex items-center gap-2 text-sm font-medium text-green-600'>4 Offers Applied <AiOutlineQuestionCircle /></p>
                </div>
              </div>
              <div>

              <div>
                <OrderProgressBar lastupdated= {orderdetails?.products[indexOfproductdetails]?.lastupdatedon} 
                createdon={orderdetails?.createdAt} status={orderdetails?.products[indexOfproductdetails].status.toUpperCase()} cancelhandler={() => cancelhandler()}/>
              </div>

                {/* {
                  orderdetails?.products[indexOfproductdetails].status === "cancelled" ?
                  (
                    <div>
                      <h1>
                        Order cancelled on {date.format(new Date(orderdetails?.products[indexOfproductdetails]?.lastupdatedon), 'YYYY/MM/DD HH:MM')}
                      </h1>
                    </div>
                  ) 
                  : 
                  (
                    <div>
                      <OrderProgressBar lastupdated= {orderdetails?.products[indexOfproductdetails]?.lastupdatedon} 
                      createdon={orderdetails?.createdAt} status={orderdetails?.products[indexOfproductdetails].status.toUpperCase()} cancelhandler={() => cancelhandler()}/>
                    </div>
                  )
                } */}
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

export default page