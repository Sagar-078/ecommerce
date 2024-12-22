"use client"
import login_bg_image from "@/assets/images/login_bg_image.png"
import OtpVerifyField from "@/components/otpVerifyField";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { toast } from "react-toastify";
import UserDetailsField from "@/components/UserDetailsField";

function Signup(){

    const {register,getValues, handleSubmit, formState:{errors}} = useForm();
    const [showOtpField, setShowOtpField] = useState<boolean>(false);
    const [userDetailsField, setUserDetailsField] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");

    async function submitHandler(){
        const loading = toast.loading("Please wait....", {position: "bottom-center"});
        try{
            const {email} = getValues();
            console.log("email at get values ", email);
            setEmail(email);

            const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

            if(!regex.test(email)){
                return toast.error("please enter correct email", {position: "bottom-center"});
            }
            
            const response = await axios.post('/api/auth/sendOtp', {email});
            console.log("response of send otp ", response);

            if(response.status === 200){
                toast.success(response?.data?.message, {position: "bottom-center"});
                setShowOtpField(true);
            }

        }catch(err:any){
            console.log("error while send otp ", err);
            toast.error(err?.response?.data?.message, {position: "bottom-center"});
        }finally{
            toast.dismiss(loading);
        }
    }

    return(
        <div className=" flex justify-center items-center mt-6 ">
            <div className=" h-[60vh] w-[55%] flex shadow-sm rounded-md">
                <div className="flex flex-col items-center py-9 px-11 justify-between w-[40%] bg-blue-500">
                    <div className=" flex flex-col gap-6">
                        <h1 className=" font-bold text-2xl text-white">Looks like you're <br/> new here!</h1>
                        <p className=" text-base text-slate-100">Sign up with your mobile number to get started</p>
                    </div>
                    <div>
                        <Image src={login_bg_image} alt=""/>
                    </div>
                </div>

                <div className=" bg-white flex flex-col items-center justify-between px-11 py-14 w-[55%]">
                    {
                        showOtpField ? (

                            userDetailsField ? (<UserDetailsField email={email}/>) 
                            : 
                            (
                                <OtpVerifyField submitHandler={submitHandler} email={email} setUserDetailsField={setUserDetailsField}/>
                            )                           
                        ) : (
                            <form className=" flex gap-11 flex-col"
                                onSubmit={handleSubmit(submitHandler)}
                            >
                                <input placeholder="Enter Email" type="email" id="email"
                                    className="w-full outline-none border-b border-gray-300 shadow-sm focus:border-blue-500"
                                    {
                                        ...register("email", {required: true})
                                    }
                                />
                                {
                                errors.email && (
                                    <p className=" text-red-500">Email is required</p>
                                )
                                }
                                <div className=" flex flex-col gap-4">
                                    <p className="text-xs text-gray-500">By continuing, you agree to Flipkart's <Link href={""} className="text-blue-600">Terms of Use</Link> and <Link href={""} className="text-blue-600">Privacy Policy.</Link></p>
                                    <button className=" font-bold w-full py-3 bg-orange-500 rounded-sm text-white">
                                        CONTINUE
                                    </button>
                                    <Link href={"/signin"} className=" flex items-center justify-center w-full bg-white py-3 text-blue-700 font-medium shadow-lg border-t-[0.5px] rounded-md">
                                        Exisiting User?Log in
                                    </Link>
                                </div>
                            </form>
                        )
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default Signup;