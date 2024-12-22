"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"
import { toast } from "react-toastify";

function UserDetailsField({email}:any){

    const {register,getValues, handleSubmit, formState:{errors}} = useForm();
    const router = useRouter();

    async function submitHandler(){
        const loading = toast.loading("Please wait....", {position: "bottom-center"});
        try{
            const {firstName, lastName, password, confirmPassword} = getValues();
            const response = await axios.post("/api/auth/signup", {email, firstName, lastName, password, confirmPassword});
            console.log("response of signup ", response);

            if(response.status === 200){
                toast.success(response?.data?.message, {position: "bottom-center"});
                router.push("/signin");
                toast.info("please login for security porpose", {position: "bottom-center"});
            }

        }catch(error:any){
            console.log("error while fetch signup api", error);
            toast.error(error?.response?.data?.message, {position: "bottom-center"});
        }finally{
            toast.dismiss(loading);
        }
    }

    return (
        
        <form className="flex w-full flex-col gap-6" onSubmit={handleSubmit(submitHandler)}>
            <input placeholder="Enter first name" type="text" id="firstName"
                className="w-full outline-none border-b border-gray-300 shadow-sm focus:border-blue-500"
                    {
                        ...register("firstName", {required: true})
                    }
            />
            {
                errors.firstName && (
                    <p className=" text-red-500">first name is required</p>
                )
            }

            <input placeholder="Enter last name" type="text" id="lastName"
                className="w-full outline-none border-b border-gray-300 shadow-sm focus:border-blue-500"
                    {
                        ...register("lastName", {required: true})
                    }
            />
            {
                errors.lastName && (
                    <p className=" text-red-500">last name is required</p>
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

            <input placeholder="Enter password again" type="password" id="confirmPassword"
                className="w-full outline-none border-b border-gray-300 shadow-sm focus:border-blue-500"
                    {
                        ...register("confirmPassword", {required: true})
                    }
            />
            {
                errors.confirmPassword && (
                    <p className=" text-red-500">please enter password again</p>
                )
            }

            <button type='submit'  className="font-bold w-full py-3 bg-orange-500 rounded-sm text-white">
                sign up
            </button>

        </form>
    )
}

export default UserDetailsField;