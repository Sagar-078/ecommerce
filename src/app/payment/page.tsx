"use client"
import Loading from '@/components/loaders/Loading'
import DeliveryAddrCheckOut from '@/components/paymentComponent/DeliveryAddrCheckOut'
import LoginCheckOut from '@/components/paymentComponent/LoginCheckOut'
import OrderSummaryCheckOut from '@/components/paymentComponent/OrderSummaryCheckOut'
import PaymentOptions from '@/components/paymentComponent/PaymentOptions'
import { setStepOfPayment } from '@/redux/slices/payment'
import { RootState } from '@/redux/store/store'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import securepaymentimg from '@/assets/images/shield_b33c0c.svg'
import {capturePayment} from '@/services/paymentSurvices'

const page = () => {
  const {token} = useSelector((state:RootState) => state.authToken);
  const {user} = useSelector((state:RootState) => state.authUser);
  const {buyingProduct} = useSelector((state:RootState) => state.payment);
  console.log("buying product is =====> ", buyingProduct);
  const router= useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState([]);
  const [btnLoading, btnSetLoading] = useState<boolean>(false);
  const [deliveryAddrs, setDeliveryAddrs] = useState('');

  async function getAddress(){
    try{
      const response = await axios.get("/api/address/getAddress", {
        headers: {
          Authorization:`Bearer ${token}`
        }
      })
      console.log("response at get address ", response);
      setAddress(response.data.Address);
    }catch(error:any){
      console.log("error while get address ", error);
    }finally{
      setLoading(false);
    }
  }

  function getPrice(){
    const price = buyingProduct.reduce((acc:any, item:any) => {
      return acc + parseInt(item.sellPrice) * item.quantity
    }, 0)
    return price;
  }

  function getDiscount(){
    const discount = buyingProduct.reduce((acc:any, item:any) => {
      return acc += (parseInt(item.originalPrice) - parseInt(item.sellPrice)) * item.quantity;
    }, 0)
    return discount;
  }

  function getPlatFormFee(){
    const platFormFee = buyingProduct.length * 1 
    return platFormFee;
  }

  function getOriginalDeliveryCharge(){
    // const originalDeliveryCharge = cart.reduce((acc:any, item:any) => {
    //   return acc += (parseInt(item.deliverycharge) * item.quantity) + 30
    // }, 0)
    // return originalDeliveryCharge;
    const deliveryCharge = getDeliveryCharge();
    const originalDeliveryCharge = deliveryCharge + 200
    return originalDeliveryCharge;
  }

  function getDeliveryCharge(){
    const deliveryCharge = buyingProduct.reduce((acc:any, item:any) => {
      return acc += (parseInt(item.deliverycharge) * item.quantity) - 5
    }, 0)
    return deliveryCharge < 0 ? 0 : deliveryCharge;
  }

  function getTotalPrice() {
    const price = getPrice();
    const platformFee = getPlatFormFee();
    const deliveryCharge = getDeliveryCharge();
    const totalPrice = price + platformFee + deliveryCharge;
    return totalPrice;
  }

  function getTotalSave(){
    const discount = getDiscount();
    const platformFee = getPlatFormFee();
    const deliverycharge = getDeliveryCharge();
    console.log("discount, platformfee, deliverycharge =...>>", discount, platformFee, deliverycharge);
    const charges = platformFee + deliverycharge;
    console.log("charges is --->>", charges);
    const totalSave = discount - charges;
    return totalSave;
  }

  function buynowHandler(){
    if(!buyingProduct || !deliveryAddrs || buyingProduct.length=== 0){
      return toast.error('Invalid request');
    }

    capturePayment(buyingProduct, deliveryAddrs, platFormFee, deliveryCharge, supercoinsused, token, user, router, dispatch);

  }

  useEffect(() => {
    if(!token || !user || buyingProduct.length === 0){
      toast.error("This is a Protected rout", {position: "bottom-center"});
      router.push('/');
    }else{
      getAddress();
      dispatch(setStepOfPayment(2));
    }
  }, []);
  const price = useMemo(() => getPrice(), [buyingProduct]);
  const platFormFee = useMemo(() => getPlatFormFee(), [buyingProduct]);
  const originalDeliveryCharge = useMemo(() => getOriginalDeliveryCharge(), [buyingProduct]);
  const deliveryCharge = useMemo(() => getDeliveryCharge(), [buyingProduct]);
  const totalPrice = useMemo(() => getTotalPrice(), [buyingProduct]);
  const totalSave = useMemo(() => getTotalSave(), [buyingProduct]);
  const [supercoinsused, setsupercoinsused] = useState<boolean>(false);

  return (
    <>
      {
        loading ? 
        (
          <Loading/>
        ) 
        : 
        (
          <div className='w-[80%] flex mx-auto mt-6 justify-between'>
            <div className=' w-[70%] flex flex-col gap-3'>
              <LoginCheckOut btnLoading={btnLoading} address={address}/>
              <DeliveryAddrCheckOut address={address} getAddress={getAddress} deliveryAddrs={deliveryAddrs} setDeliveryAddrs={setDeliveryAddrs} />
              <OrderSummaryCheckOut />
              <PaymentOptions supercoinsused={supercoinsused} setsupercoinsused={setsupercoinsused} buynowHandler={buynowHandler} />
            </div>
            <div className=' w-[29%] h-[45%] '>
              <div className=' w-full h-full bg-white rounded-sm shadow-md'>
                <h1 className='p-3 border-b font-semibold text-gray-500 opacity-80'>PRICE DETAILS</h1>
                <div className='flex flex-col p-3 gap-4'>
                  <div className=' flex justify-between'>
                    <h1>Price ({buyingProduct.length} items)</h1>
                    <h1>₹{price.toLocaleString()}</h1>
                  </div>
                  {/* <div className=' flex justify-between'>
                    <h1>Discount</h1>
                    <h1 className=' font-medium text-green-600'>- ₹{discount.toLocaleString()}</h1>
                  </div> */}
                  <div className=' flex justify-between'>
                    <h1>Platform Fee</h1>
                    <h1>₹{platFormFee.toLocaleString()}</h1>
                  </div>
                  <div className=' flex justify-between border-b border-gray-300 border-dashed pb-4'>
                    <h1>Delivery Charges</h1>
                    <div className=' flex gap-2 items-center'>
                      <h1 className=' text-sm line-through'>₹{originalDeliveryCharge.toLocaleString()}</h1>
                      <h1>{deliveryCharge <= 0 ? (<span className='text-green-600 font-medium'>Free</span>) : (`₹${deliveryCharge.toLocaleString()}`)}</h1>
                    </div>
                  </div>
                  <div className=' flex justify-between border-b border-gray-300 border-dashed pb-4'>
                    <h1 className=' text-lg font-semibold'>Total Payable</h1>
                    <h1 className=' text-lg font-semibold'>₹{totalPrice.toLocaleString()}</h1>
                  </div>
                  <h1 className=' font-medium text-base text-green-600'>You will save ₹{totalSave.toLocaleString()} on this order</h1>
                </div>
              </div>
                
              <div className=' flex items-center gap-2 w-full pt-6 p-2'>
                <Image src={securepaymentimg} alt='' className='h-8 w-8'/>
                <h1 className=' text-sm font-semibold opacity-50'>
                  Safe and Secure Payments.Easy returns.100% Authentic products.
                </h1>
              </div>

            </div>
          </div>
        )
      }
    </>
  )
}

export default page