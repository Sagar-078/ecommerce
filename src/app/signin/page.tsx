"use client"
import Image from "next/image";
import login_bg_image from "@/assets/images/login_bg_image.png"
import Link from "next/link";
import { useForm } from "react-hook-form"
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/redux/store/store";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/user";
import { setToken } from "@/redux/slices/auth";

function SignIn(){
    
    const {register,getValues, handleSubmit, formState:{errors}} = useForm();
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch();

    async function submitHandler(){
        const loading = toast.loading("Please wait....", {position: "bottom-center"});
        try{
            const {email, password} = getValues();

            const response = await axios.post("/api/auth/login", {email, password});
            console.log("response of login ", response);
            if(response.status === 200){
                toast.success(response?.data?.message, {position: "bottom-center"});
                dispatch(setUser(response?.data?.User));
                dispatch(setToken(response?.data?.Token));
                router.push("/");
            }

        }catch(err:any){
            console.log("error while login ", err);
            toast.error(err?.response?.data?.message);
        }finally{
            toast.dismiss(loading);
        }
    }

    return(
        <div className=" flex justify-center items-center mt-6 ">
            <div className=" h-[60vh] w-[55%] flex shadow-sm rounded-md">
                <div className="flex flex-col items-center py-9 px-11 justify-between w-[40%] bg-blue-500">
                    <div className=" flex flex-col gap-6">
                        <h1 className=" font-bold text-2xl text-white">Login</h1>
                        <p className=" text-base text-slate-100">Get access to your Orders,<br/> Wishlist and Recommendations</p>
                    </div>
                    <div>
                        <Image src={login_bg_image} alt=""/>
                    </div>
                </div>

                <div className=" bg-white flex flex-col items-center justify-between px-11 py-14 w-[55%]">
                    <form className=" flex gap-11 flex-col" onSubmit={handleSubmit(submitHandler)}>

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

                        <input placeholder="Enter password" type="password" id="password"
                            className="w-full outline-none border-b border-gray-300 shadow-sm focus:border-blue-500"
                            {
                                ...register("password", {required: true})
                            }
                        />
                            {
                                errors.password && (
                                    <p className=" text-red-500">please enter password</p>
                                )
                            }

                        <div className=" flex flex-col gap-4">
                            <p className="text-xs text-gray-500">By continuing, you agree to Flipkart's <Link href={""} className="text-blue-600">Terms of Use</Link> and <Link href={""} className="text-blue-600">Privacy Policy.</Link></p>
                            <button className=" font-bold w-full py-3 bg-orange-500 rounded-sm text-white">
                                Sign in
                            </button>
                        </div>
                    </form>
                    <Link href={"/signup"} className=" text-sm font-semibold text-blue-500">
                        New to Flipkart? Create an account
                    </Link>
                </div>

            </div>
        </div>
    )

}
export default SignIn;