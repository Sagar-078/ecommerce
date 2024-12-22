"use client"
import { RootState } from '@/redux/store/store';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck } from "react-icons/fa6";
import { setStepOfPayment } from '@/redux/slices/payment';
import { FaTruck } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import { toast } from 'react-toastify';
import axios from 'axios';
import { setToken } from '@/redux/slices/auth';
import { setUser } from '@/redux/slices/user';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import BtnLoading from '../loaders/BtnLoading';

const LoginCheckOut = ({btnLoading}:any) => {
  const {token} = useSelector((state:RootState) => state.authToken);
  const {user} = useSelector((state:RootState) => state.authUser);
  const {stapeOfPayment} = useSelector((state: RootState) => state.payment);
  const session = useSession();
  const dispatch = useDispatch();
  const router = useRouter()
  console.log("user at login check ", user);

  async function logoutHandler(){
    const loading = toast.loading("Please wait... ", {position: "bottom-center"});
    try{
      const response = await axios.get('/api/auth/logout');

      if(response.status === 200){
        dispatch(setToken(null));
        dispatch(setUser(null));
        router.push('/');
        toast.success("Logout successfully", {position: "bottom-center"});
        console.log(session.status);
        if(session.status === 'authenticated'){
          signOut();
        }
      }

    }catch(err:any){
      console.log("error while logout handler ", err);
      toast.error("error while logout", {position: "bottom-center"});
    }finally{
      toast.dismiss(loading);
    }
  }

  return (
    <div className=' w-full bg-white rounded-sm shadow-md'>
      {
        token && (
          <div className=' w-full '>
            {
              stapeOfPayment === 1 ? 
              (
                <div className=' w-full'>
                  <div className=' flex bg-blue-500 py-3 items-center w-full rounded-sm px-6 gap-4'>
                    <div className=' px-2 bg-white text-sm text-blue-600 h-fit rounded-sm'>1</div>
                    <h1 className=' text-white font-semibold'>LOGIN</h1>
                  </div>
                  
                  <div className=' flex mx-auto w-full py-6 justify-around'>
                    <div className=' flex flex-col gap-3 w-[40%]'>
                      <div className=' flex gap-5'>
                        <h1 className=' text-sm opacity-50'>Name</h1>
                        <h1 className=' text-sm font-semibold capitalize'>{user?.firstName} {user?.lastName}</h1>
                      </div>
                      <div className=' flex gap-5'>
                        <h1 className=' text-sm opacity-50'>Email</h1>
                        <h1 className=' text-sm font-semibold capitalize'>{user?.email}</h1>
                      </div>
                      <p className=' text-sm font-semibold text-blue-600 cursor-pointer'
                        onClick={logoutHandler}
                      >Logout & Signin in to another account</p>
                      <button className='w-full bg-orange-500 py-3 rounded-sm font-semibold text-white'
                        onClick={() => {dispatch(setStepOfPayment(2))}}
                      >
                        {
                          btnLoading ? (<BtnLoading/>) : ("CONTINUE CHECKOUT")
                        }
                      </button>
                    </div>
                    <div className=' w-[40%] flex flex-col gap-4'>
                      <h1 className='text-sm opacity-50'>Advantages of our secure login</h1>
                      <div className=' flex flex-col gap-3'>
                        <p className=' flex items-center gap-3 text-sm'> <FaTruck className='text-lg text-blue-600' /> Easily Track Orders, Hassle free Returns</p>
                        <p className=' flex items-center gap-3 text-sm'><FaBell className='text-lg text-blue-600'/> Get Relevant Alerts and Recommedation</p>
                        <p className=' flex items-center gap-3 text-sm'><IoIosStar className='text-lg text-blue-600'/> Wishlist, Reviews, Ratings and more.</p>
                      </div>
                    </div>
                  </div>
                  <h1 className=' px-10 pb-5 text-sm opacity-50'>Please note that upon clicking "Logout" you will lose all items in cart and will be redirected to Flipkart home page.</h1>
                </div>
              ) 
              : 
              (
                <div className='w-full flex p-3 pl-5 justify-between items-center'>
                  <div className='flex gap-4'>
                    <div className=' px-2 bg-slate-200 h-fit text-sm text-blue-600 rounded-sm'>1</div>
                    <div className=' flex flex-col gap-2'>
                      <div className=' flex items-center gap-3'>
                        <h1 className=' font-semibold text-gray-400'>LOGIN</h1>
                        <FaCheck className=' text-blue-600' />
                      </div>
                      <div className=' flex gap-3'>
                        <h1 className=' capitalize font-semibold text-sm'>{user?.firstName} {user?.lastName}</h1>
                        <h1 className=' text-sm'>{user?.email}</h1>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => dispatch(setStepOfPayment(1))} className=' border px-9 py-3 h-fit flex justify-center items-center rounded-sm text-sm font-semibold text-blue-600 border-gray-300'>
                    CHANGE
                  </button>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
}

export default LoginCheckOut