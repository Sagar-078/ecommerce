"use client"
import Emailinfo from "@/components/Emailinfo";
import { setUser } from "@/redux/slices/user";
import { AppDispatch, RootState } from "@/redux/store/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function dashboard(){

    const {user} = useSelector((state: RootState) => state.authUser);
    const {token} = useSelector((state:any) => state.authToken);
    console.log("user at profile page ", user);
    const [editmode, setEditmode] = useState(false);
    const {register, handleSubmit, setValue, formState:{errors}} = useForm();
    const [gender, setGender] = useState();
    const dispatch:AppDispatch = useDispatch();

    const faqsdata = [
        {
            question: "What happens when I update my email address (or mobile number)?",
            ans: "Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number)."
        },
        {
            question: "When will my Flipkart account be updated with the new email address (or mobile number)?",
            ans: "It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes."
        },
        {
            question: "What happens to my existing Flipkart account when I update my email address (or mobile number)?",
            ans: "Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your Order history, saved information and personal details."
        },
        {
            question: "Does my Seller account get affected when I update my email address?",
            ans: "Flipkart has a 'single sign-on' policy. Any changes will reflect in your Seller account also."
        }
    ]

    function handleGender(e:any){
        if(editmode){
            setGender(e.target.value);
            setValue("gender", e.target.value);
        }
    }

    async function updateProfile(data:any){
        console.log("data at update profile ", data);
        const loading = toast.loading("Please wait updating profile ...");
        try{
            const response = await axios.post("/api/userProfile", {...data}, {
                headers: {
                    Authorization:`Bearer ${token}`
                }
            });

            console.log("response of update profile", response);
            if(response.status === 200){
                toast.success("Profile update successfully", {position: "bottom-center"});
                dispatch(setUser(response?.data?.UpdatedUser));
            }

        }catch(err:any){
            console.log("error while update profile", err);
            toast.error("Error while profile update", {position: "bottom-center"});
            
        }finally{
            toast.dismiss(loading);
        }
    }
   
    async function submitHandler(data:any){
        console.log("data at submit handler ", data);
        if(editmode){
            if(gender){
                data.gender = gender
            }
            updateProfile(data);
        }
    } 
    
    useEffect(() => {
        setValue("firstName", user?.firstName);
        setValue("lastName", user?.lastName);
        setGender(user?.gender);
    }, []);

    return(
        <div className=" w-full h-full p-7 flex flex-col gap-10">
            <div className="flex flex-col gap-7">
                <div className=" flex gap-6 ">
                    <h1 className=" font-bold text-lg">Personal Information</h1>
                    {
                        !editmode ? 
                            (<button className=" text-sm font-semibold text-blue-600" onClick={() => setEditmode(true)}>Edit</button>) 
                            : 
                            (<button className=" text-sm font-semibold text-blue-600" onClick={() => setEditmode(false)}>Cancel</button>)
                    }
                </div>
                <div className=" flex gap-5">
                    <div className=" outline-none">
                        <input type="text" placeholder="First Name" readOnly={!editmode} className=" outline-none border border-gray-200 p-3 w-[270px] rounded-md text-gray-500"
                            {
                                ...register("firstName", {
                                    required: true
                                })
                            }
                        />
                        {
                            errors.firstName && <p>First Name is required</p>
                        }
                    </div>  

                    <div>
                        <input type="text" placeholder="last Name" readOnly={!editmode} className=" outline-none border border-gray-200 p-3 w-[270px] rounded-md text-gray-500"
                            {
                                ...register("lastName", {
                                    required: true
                                })
                            }
                        />
                        {
                            errors.lastName && <p>Last Name is required</p>
                        }
                    </div>

                    {
                        editmode && (
                            <button onClick={handleSubmit(submitHandler)} className=" bg-blue-600 px-6 rounded-md text-white">
                                SAVE
                            </button>
                        )
                    }

                </div>
                <div className=" flex flex-col gap-3">
                    <h1 className=" text-sm">Your Gender</h1>
                    <div className="flex gap-6">
                        <div className="flex gap-2">
                            <input onChange={handleGender} type="radio" value="male" checked={gender === 'male'}/>
                            <h1 className=" text-gray-400">Male</h1>
                        </div>
                        <div className="flex gap-2">
                            <input type="radio" onChange={handleGender} value="Female" checked={gender === 'Female'}/>
                            <h1 className=" text-gray-400">Female</h1>
                        </div>
                    </div>
                </div>
            </div>

            <Emailinfo updateProfile={updateProfile}/>

            <div className="flex flex-col gap-5">
                <h1 className="font-semibold text-lg">FAQs</h1>
                <div className=" flex flex-col gap-4">
                    {
                        faqsdata.map((data, i) => {
                            return(
                                <div key={i} className=" flex flex-col gap-2">
                                    <h1 className=" font-semibold text-sm">{data.question}</h1>
                                    <p className=" text-sm">{data.ans}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

        </div>
    )
}
export default dashboard;