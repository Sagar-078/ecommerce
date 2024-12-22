"use client"
import Link from 'next/link';
import { useState } from 'react';
import OTPInput from 'react-otp-input'
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaRedo } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';

function OtpVerifyField({submitHandler, email, setUserDetailsField}:any){

    const [otp, setOtp] = useState<string>("");

    async function handleSubmit(e:any){
        try{
            e.preventDefault();
            const response = await axios.post('/api/auth/verifyOtp', {otp, email});
            console.log("response of verify otp ", response);
            if(response.status === 200){
                toast.success(response?.data?.message, {position: "bottom-center"});
                setUserDetailsField(true);
            }

        }catch(err:any){
            console.log("error while verify otp ", err);
            toast.error(err?.response?.data?.message, {position: "bottom-center"});
        }
    }

    return(
        <div className=' flex flex-col gap-6'>
            <form className='flex flex-col justify-center items-center gap-y-9'
                onSubmit={handleSubmit}
            >
    
                <OTPInput numInputs={6} value={otp}  onChange={setOtp}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => 
                    <input {...props}
                    style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }} 
                    className="w-[36px] lg:w-[44px] border-0 bg-slate-300 rounded-[0.5rem] text-black aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-300"/>}
                    containerStyle={{
                    justifyContent: "space-between",
                        gap: "0 6px",
                    }}
    
                />
    
              <button type='submit'  className="font-bold w-full py-3 bg-orange-500 rounded-sm text-white">
                Verify Email
              </button>
    
            </form>

            <div className='flex flex-row justify-between'>
                <Link href={"/"} className=' flex items-center gap-2 text-sm'>
                    <IoMdArrowRoundBack />
                    Back to home page
                </Link>

                <button className='flex items-center gap-2 text-sm font-normal text-blue-600'
                    onClick={() => {setOtp(""), submitHandler()}}
                >
                    <FaRedo />
                    Resend otp
                </button>

            </div>
            
        </div>
    )
}
export default OtpVerifyField;