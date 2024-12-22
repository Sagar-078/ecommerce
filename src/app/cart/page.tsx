"use client"
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import cartimage from '@/assets/images/cart_Image.webp'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store/store'
import assuredimg from '@/assets/images/assured_image.png';
import { increaseQuantity, decreaseQuantity, removeFromCartItem } from '@/redux/slices/cart'
import { setWishlistitem } from '@/redux/slices/wishlistItem'
import { toast } from 'react-toastify'
import Link from 'next/link'
import securepaymentimg from '@/assets/images/shield_b33c0c.svg'
import { useRouter } from 'next/navigation'
import { setBuyingProduct } from '@/redux/slices/payment'

const page = () => {
  const {cart} = useSelector((state:RootState) => state.cartitem);
  const {token} = useSelector((state:RootState) => state.authToken);
  console.log("cart is =???>>", cart);
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  // let price;

  // price += cart.map((item:any) => item.originalPrice);

  // console.log("price is .....???", price);

  function handleSavelater(item:any){
    dispatch(removeFromCartItem(item._id));
    dispatch(setWishlistitem(item));
    toast.success("successfully added to wishlist", {position: "bottom-center"});
  }

  function handleRemovefromCart(item:any){
    dispatch(removeFromCartItem(item._id));
    toast.info("Removed from cart", {position: "bottom-center"});
  }

  function getPrice(){
    const price = cart.reduce((acc:any, item:any) => {
      return acc + parseInt(item.originalPrice) * item.quantity
    }, 0)
    return price;
  }

  function getDiscount(){
    const discount = cart.reduce((acc:any, item:any) => {
      return acc += (parseInt(item.originalPrice) - parseInt(item.sellPrice)) * item.quantity;
    }, 0)
    return discount;
  }

  function getPlatFormFee(){
    const platFormFee = cart.length * 1 
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
    const deliveryCharge = cart.reduce((acc:any, item:any) => {
      return acc += (parseInt(item.deliverycharge) * item.quantity) - 5
    }, 0)
    return deliveryCharge < 0 ? 0 : deliveryCharge;
  }

  function getTotalPrice() {
    const price = getPrice();
    const discount = getDiscount();
    const platformFee = getPlatFormFee();
    const deliveryCharge = getDeliveryCharge();
    const totalPrice = price - discount + platformFee + deliveryCharge;
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

  const price = useMemo(() => getPrice(), [cart]);
  const discount = useMemo(() => getDiscount(), [cart]);
  const platFormFee = useMemo(() => getPlatFormFee(), [cart]);
  const originalDeliveryCharge = useMemo(() => getOriginalDeliveryCharge(), [cart]);
  const deliveryCharge = useMemo(() => getDeliveryCharge(), [cart]);
  const totalPrice = useMemo(() => getTotalPrice(), [cart]);
  const totalSave = useMemo(() => getTotalSave(), [cart]);

  function wayToPaymentPath(){
    if(!token){
      router.push('/signin');
      toast.info('Please signin first', {position: "bottom-center"});
    }else{
      dispatch(setBuyingProduct(cart));
      router.push('/payment');
    } 
  }

  useEffect(() => {
    setIsClient(true); 
  }, []);

  if (!isClient) return null;

  return (
    <div>
      {
        cart.length === 0 ? 
        (
          <div className='h-[60vh] w-[80%] bg-white flex flex-col gap-6 font-semibold text-pretty justify-center items-center mx-auto mt-6'>
            <Image src={cartimage} alt='' className='h-[30%] w-[20%]'/>
            <h1>Missing Cart items?</h1>
          </div>
        ) 
        :
        (
          <div className={` h-[90vh] w-[80%] mt-4 mx-auto flex justify-between`}>
            <div className=' w-[70%] h-full flex flex-col justify-between gap-0.2'>
              <div className=' flex flex-col overflow-y-scroll sidebar h-[87%] bg-white rounded-sm'>
                {
                  cart.map((item:any, i:any) => {
                    return(
                      <div key={i} className={` flex w-full justify-between p-5 ${cart.length -1 !== i ? ' border-b border-gray-300' : ''}`}>
                        <div className='flex flex-col items-center gap-3'>
                          <Link href={`/product/${item._id}`}>
                            <img src={`${item?.images[0]}`} alt='' className=' h-24 w-20'/>
                          </Link>
                          <div className=' flex gap-4 items-center'>
                            <button className=' border px-2 rounded-full' disabled={item.quantity===1} onClick={() => dispatch(decreaseQuantity(item._id))}> - </button>
                            <div className=' border px-4'>{item.quantity}</div>
                            <button className=' border px-2 rounded-full' onClick={() => dispatch(increaseQuantity(item._id))}> + </button>
                          </div>
                        </div>
                        <div className=' w-[60%] flex flex-col gap-3'>
                          <Link href={`/product/${item._id}`} className=' hover:text-blue-600'>
                            <h1 className=' capitalize'>{item?.productName.substring(0, 50)}...</h1>
                          </Link>
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
                            <button onClick={() => handleSavelater(item)}>SAVE FOR LATER</button>
                            <button onClick={() => handleRemovefromCart(item)}>REMOVE</button>
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
              <div className=' h-[13%] w-full flex items-center justify-end p-5 bg-white rounded-sm border-t-2 shadow-inner'>
                <button onClick={wayToPaymentPath}
                  className=' w-[30%] py-3 bg-orange-600 font-semibold text-white flex justify-center items-center rounded-sm'>
                  PLACE ORDER
                </button>
              </div>
            </div>
            
            <div className=' w-[29%] shadow-lg h-[45%] '>
              <div className=' w-full h-full bg-white rounded-sm'>
                <h1 className='p-3 border-b font-semibold text-gray-500 opacity-80'>PRICE DETAILS</h1>
                <div className='flex flex-col p-3 gap-4'>
                  <div className=' flex justify-between'>
                    <h1>Price ({cart.length} items)</h1>
                    <h1>₹{price.toLocaleString()}</h1>
                  </div>
                  <div className=' flex justify-between'>
                    <h1>Discount</h1>
                    <h1 className=' font-medium text-green-600'>- ₹{discount.toLocaleString()}</h1>
                  </div>
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
                    <h1 className=' text-lg font-semibold'>Total Amount</h1>
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
    </div>
  )
}

export default page