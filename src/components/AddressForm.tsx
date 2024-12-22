"use client"
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify';

const AddressForm = ({createAddress, editAddress, indivisualAddress, editMode, setShowForm,setEditMode }: {createAddress:any, setShowForm:any, editMode:any, setEditMode:any, indivisualAddress:any, editAddress:any}) => {

    console.log("indivisual address ", indivisualAddress);
    const {register, handleSubmit, setValue, getValues, reset, formState: {errors}} = useForm();
    const [typeOfAddress, setTypeOfAddress] = useState();

    function addressTypeHandler(e:any){
        setTypeOfAddress(e.target.value);
        setValue('typeOfAddress', e.target.value);
    }

    async function submitHandler(data:any){
        try{
            data.addressType = typeOfAddress
            if(!data.addressType){
                return(
                    toast.info("Please select address type !", {position:"bottom-center"})
                )
            }

            if(editMode){
                data.addressId = indivisualAddress._id
                await editAddress(data);
                setEditMode(false);
                setShowForm(false);
            }

            if(!editMode){
                await createAddress(data);
                setShowForm(false);
                reset(
                    {
                        fullName: "", 
                        mobileNumber: "", pincode: "", locality: "", 
                        address:"", district: "", state: "", landmark:"", 
                        altranativePhoneNo:"", addressType:""
                    }
                )
            }
        }catch(error:any){
            console.log("error while submit handler ", error);
        }
    }

    useEffect(() => {
        if(editMode){
            setValue('fullName', indivisualAddress?.fullName);
            setValue('mobileNumber', indivisualAddress?.mobileNumber);
            setValue('pincode', indivisualAddress?.pincode);
            setValue('locality', indivisualAddress?.locality);
            setValue('address', indivisualAddress?.address);
            setValue('district', indivisualAddress?.district);
            setValue('state', indivisualAddress?.state);
            setValue('landmark', indivisualAddress?.landmark);
            setValue('altranativePhoneNo', indivisualAddress?.altranativePhoneNo);
            setTypeOfAddress(indivisualAddress?.addressType);
        }
    }, []);

  return (
    <div className=' flex flex-col h-full w-full bg-blue-50 p-10'>
        <div className=' w-[80%]'>
            <h1 className=' font-semibold text-blue-600 text-sm'>ADD A NEW ADDRESS</h1>
            <form onSubmit={handleSubmit(submitHandler)} className=' pt-10 flex flex-col h-full w-full gap-3'>
                <div className=' flex gap-3'>
                    <input type='text' placeholder='Name' className=' border border-gray-200 outline-none p-3 rounded-sm w-[35%]'
                        {
                            ...register('fullName', {
                                required: true
                            })
                        }
                    />
                    {
                        errors.fullName && (
                            <p>Please enter your fullname</p>
                        )
                    }


                    <input type='text' className=' border border-gray-200 outline-none p-3 rounded-sm w-[35%]' placeholder='10-digit mobile number' 
                        {
                            ...register('mobileNumber', {
                                required: true
                            })
                        }
                    />
                    {
                        errors.mobileNumber && (
                            <p>Please enter your mobile Number</p>
                        )
                    }
                </div> 
                
                <div className=' flex gap-3'>
                    <input type='text' placeholder='Pincode' className=' border border-gray-200 outline-none p-3 rounded-sm w-[35%]'
                        {
                            ...register('pincode', {
                                required: true
                            })
                        }
                    />
                    {
                        errors.pincode && (
                            <p>Please enter your pincode</p>
                        )
                    }
                    
                    <input type='text' placeholder='Locality' className=' border border-gray-200 outline-none p-3 rounded-sm w-[35%]'
                        {
                            ...register('locality', {
                                required: true
                            })
                        }
                    />
                    {
                        errors.locality && (
                            <p>Please enter your locality</p>
                        )
                    }
                </div>

                <div className=' flex gap-3'>
                    <textarea placeholder='Address (Area and Street)' className=' border border-gray-200 outline-none p-3 rounded-sm w-[72%]'
                        {
                            ...register('address', {
                                required: true
                            })
                        }
                    />
                    {
                        errors.address && (
                            <p>Please enter area</p>
                        )
                    }
                </div>

                <div className=' flex gap-3'>
                    <input type='text' placeholder='City/District/Town' className=' border border-gray-200 outline-none p-3 rounded-sm w-[35%]'
                        {
                            ...register('district', {
                                required: true
                            })
                        }
                    />
                    {
                        errors.district && (
                            <p>Please enter your city</p>
                        )
                    }

                    <input type='text' placeholder='State' className=' border border-gray-200 outline-none p-3 rounded-sm w-[35%]'
                        {
                            ...register('state', {
                                required: true
                            })
                        }
                    />
                    {
                        errors.state && (
                            <p>Please enter your state</p>
                        )
                    }

                </div>

                <div className=' flex gap-3'>
                    <input type='text' placeholder='Landmark (Optional)' className=' border border-gray-200 outline-none p-3 rounded-sm w-[35%]'
                        {
                            ...register('landmark', {
                                required: false
                            })
                        }
                    />
                    {
                        errors.landmark && (
                            <p>Please enter your landmark</p>
                        )
                    }

                    <input type='text' placeholder='Alternate Phone (optional)' className=' border border-gray-200 outline-none p-3 rounded-sm w-[35%]'
                        {
                            ...register('altranativePhoneNo', {
                                required: false
                            })
                        }
                    />
                    {
                        errors.altranativePhoneNo && (
                            <p>Please enter your landmark</p>
                        )
                    }
                </div>

                <div className=' flex flex-col gap-2'>
                    <h1 className=' text-xs opacity-40'>Address Type</h1>
                    <div className=' flex gap-5'>
                        <div className=' flex gap-2 items-center'>
                            <input type='radio' value="home" className=' text-xl font-extrabold opacity-70' onChange={addressTypeHandler} checked={typeOfAddress === "home"}/>
                            <h1 className=' text-sm opacity-80'>Home</h1>
                        </div>
                        <div className=' flex gap-2 items-center'>
                            <input type='radio' value="work" className=' text-xl font-extrabold opacity-70' onChange={addressTypeHandler} checked={typeOfAddress === "work"}/>
                            <h1 className=' text-sm opacity-80'>Work</h1>
                        </div>
                    </div>
                </div>

                <div className=' flex gap-7 pt-6'>
                    <button className=' bg-blue-600 rounded-sm w-[25%] py-3 text-white text-sm font-semibold'>
                        SAVE
                    </button>
                    <button onClick={() => {setShowForm(false), setEditMode(false)}} className=' text-blue-600 font-semibold text-sm'>
                        CANCEL
                    </button>
                </div>

            </form>
        </div>
    </div>
  )
}

export default AddressForm