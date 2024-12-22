"use client"
import { RootState } from '@/redux/store/store'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const PaymentOptions = ({supercoinsused, setsupercoinsused, buynowHandler}:any) => {
  const {stapeOfPayment} = useSelector((state:RootState) => state.payment);
  const {token} = useSelector((state:RootState) => state.authToken);
  const {user} = useSelector((state:RootState) => state.authUser);
  console.log("user at payment option ", user);
  // const [loading, setLoading] = useState<boolean>(false);
  const [supercoins, setSupercoins] = useState<any>();

  async function getSuperCoin(){
      try{
        const response = await axios.get("/api/getSupercoins", {
          headers:{
              Authorization:`Bearer ${token}`
          } 
        });
        console.log("response of supercoin ", response);
        setSupercoins(response?.data?.superCoins?.supercoins);
      }catch(err:any){
        console.log("error while get supercoins ", err);
      }
  }

  // const [superCoin, setSuperCoin] = useState<number>(0);

  // async function getSuperCoin(){
  //   try{
  //     const response:any = await axios.post('/api/getSupercoins', {
  //       headers:{
  //         Authorization:`Bearer ${token}`
  //       }  
  //     })
  //     console.log('response of get super coins ', response);
  //     // if(response.status === 200){
  //     //   setSuperCoin()
  //     // }

  //   }catch(error:any){
  //     console.log("error while get super coin ", error);
  //   }
  // }

  useEffect(() => {
    getSuperCoin();
  }, [])

  return (
    <div className=' w-full bg-white rounded-sm shadow-md'>
        {
          stapeOfPayment === 4 ? 
          (
            <div>
              <div className=' flex bg-blue-500 py-3 items-center w-full rounded-sm px-6 gap-4'>
                <div className=' px-2 bg-white text-sm text-blue-600 h-fit rounded-sm'>3</div>
                <h1 className=' text-white font-semibold'>ORDER SUMMARY</h1>
              </div>

              <div className='p-3 flex flex-col gap-2'>
                {
                  supercoins > 0 &&
                  (
                    <div className=' flex gap-2 '>
                      <input checked={supercoinsused} onChange={(e)=>setsupercoinsused(e.target.checked)} type='checkbox'/>
                      <h1 className=' font-bold text-yellow-500 '>Use Supercoins to pay upto {supercoins}</h1>
                    </div>
                  ) 
                }
              
                <div className=' w-full flex justify-between  items-center'>
                  <h1>Complete your payment</h1>
                  <button className=' px-10 py-3 bg-orange-500 font-semibold rounded-sm text-white'
                    onClick={buynowHandler}
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            </div>
          ) 
          : 
          (
            <div className=' flex bg-white py-3 items-center w-full rounded-sm px-6 gap-4'>
              <div className=' px-2 bg-slate-200 h-fit text-sm text-blue-600 rounded-sm'>4</div>
              <h1 className='  font-semibold text-gray-400'>PAYMENT OPTIONS</h1>
            </div>
          )
        }
    </div>
  )
}

export default PaymentOptions