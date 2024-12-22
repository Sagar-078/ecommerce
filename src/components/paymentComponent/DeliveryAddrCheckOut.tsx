"use client"
import React, { useEffect, useState } from 'react'
import { setStepOfPayment } from '@/redux/slices/payment'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { FaCheck } from 'react-icons/fa6';
import { FaPlus } from "react-icons/fa6";
import AddressForm from '../AddressForm';
import { toast } from 'react-toastify';
import axios from 'axios';

const DeliveryAddrCheckOut = ({address, getAddress, checkHandler, setDeliveryAddrs, deliveryAddrs}:any) => {
  console.log("address are ---->>> ", address);
  console.log("delivery address is ----->> ", deliveryAddrs);
  const {stapeOfPayment} = useSelector((state: RootState) => state.payment);
  const {user} = useSelector((state:RootState) => state.authUser);
  const {token} = useSelector((state:RootState) => state.authToken);
  const [selectedAddress, setSelectedAddress] = useState<number>(0);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [indivisualAddress, setIndivisualAddressId] = useState();
  const [editMode, setEditMode] = useState(false);
  const [addrsConfirm, setAddrsConfirm] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleSelectAddress = (index: number) => {
    setSelectedAddress(index); // Set the selected address index
  };

  async function createAddress (data:any){
    const loading = toast.loading("Creating address...", {position: "bottom-center"});
    try{
      const response = await axios.post("/api/address/createAddress", data, {
        headers:{
          "Authorization":`Bearer ${token}`
        }
      })

      console.log("response of create address ", response);
      if(response.status === 200){
        await getAddress();
        toast.success("Address created successfully", {position: "bottom-center"});
      }
    }catch(error:any){
      console.log("error while creating address ", error);
      toast.error("something went wrong while create address", {position: "bottom-center"});
    }finally{
      toast.dismiss(loading);
    }
  }

  async function editHandler(addrs:any){
    setIndivisualAddressId(addrs);
    setEditMode(true);
    setShowForm(true);
  }

  async function editAddress(data:any){
    console.log("data at edit address ", data);
    const loading = toast.loading("Editing address...", {position: "bottom-center"});
    try{
      const response = await axios.put('/api/address/updateAddress', data, {
      headers: {
        "Authorization": `Bearer ${token}`
      }});
      console.log("response of edit address ", response);
      if(response.status === 200){
        await getAddress();
        toast.success("Address updated successfully");
      }
    }catch(err:any){
      console.log("error while edit address ", err);
    }finally{
      toast.dismiss(loading);
    }
  }

  return (
    <div className=' w-full rounded-sm shadow-md'>
      {
        stapeOfPayment === 2 ? 
        (
          <div className=' w-full flex flex-col gap-3'>
            <div className=' w-full bg-white'>
              <div className=' flex bg-blue-500 py-3 items-center w-full rounded-sm px-6 gap-4'>
                <div className=' px-2 bg-white text-sm text-blue-600 h-fit rounded-sm'>2</div>
                <h1 className=' text-white font-semibold'>DELIVERY ADDRESS</h1>
              </div>
              <div w-full>
                {
                  address.map((addrs:any, i:any) => {
                    return(
                      <div key={i} className=' flex p-6 justify-between w-full'>
                        <div className=' flex gap-6 items-baseline w-full'>
                          <div className=' text-blue-600'>
                            <input type='radio' value="" name='' checked={selectedAddress === i}   onChange={() => handleSelectAddress(i)}
                            className=' radio-custom text-2xl focus:ring-blue-500 text-blue-500 border-blue-600 font-extrabold'
                            />
                          </div>
                          <div className=' flex flex-col gap-3 w-[90%] items-start'>
                            <div className=' flex gap-3 items-center'>
                              <h1 className=' capitalize text-sm font-semibold'>{addrs?.fullName}</h1>
                              <div className=' text-xs uppercase opacity-50 p-1 rounded-sm bg-slate-200'>{addrs?.addressType}</div>
                              <h1 className=' text-sm font-semibold'>{addrs?.mobileNumber}</h1>
                            </div>
                            <div>
                              <p className=' text-sm capitalize'>{addrs?.address},, {addrs?.locality}, {addrs?.district}, {addrs?.state} - {addrs?.pincode}</p>
                            </div>
                            {selectedAddress === i && ( 
                              <button onClick={() => {setDeliveryAddrs(addrs), dispatch(setStepOfPayment(3)), setAddrsConfirm(true)}} 
                                className='w-[40%] bg-orange-500 py-3 text-sm items-center justify-center font-semibold text-white rounded-sm'>
                                DELIVER HERE
                              </button>
                            )}
                          </div>
                        </div>
                        <button onClick={() => editHandler(addrs)}
                          className=' font-semibold text-sm text-blue-600 cursor-pointer'>EDIT</button>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className='flex bg-white py-4 items-center w-full rounded-sm px-6 gap-4'>
              {
                showForm ? (
                  <AddressForm indivisualAddress={indivisualAddress} 
                  createAddress={createAddress} setShowForm={setShowForm} 
                  editMode={editMode} setEditMode={setEditMode}
                  editAddress={editAddress} />
                ): 
                (
                  <button onClick={() => setShowForm(true)} className=' flex items-center gap-3 text-blue-600 text-sm font-semibold'><FaPlus className=' text-lg' />  Add a new address</button>
                )
              }
              
            </div>
          </div>
        ) 
        : 
        (
          <div>
            {
              addrsConfirm ? 
              (
                <div className='w-full flex p-3 pl-5 justify-between items-center bg-white rounded-md'>
                  <div className='flex gap-4'>
                    <div className=' px-2 bg-slate-200 h-fit text-sm text-blue-600 rounded-sm'>2</div>
                    <div className=' flex flex-col gap-2'>
                      <div className=' flex items-center gap-3'>
                        <h1 className=' font-semibold text-gray-400'>DELIVERY ADDRESS</h1>
                        <FaCheck className=' text-blue-600' />
                      </div>
                      <div className=' flex gap-3'>
                        <h1 className=' capitalize font-semibold text-sm'>{deliveryAddrs?.fullName}</h1>
                        <h1 className=' text-sm'>{deliveryAddrs?.address},{deliveryAddrs?.locality},{deliveryAddrs?.district},{deliveryAddrs?.state}-<span className='font-semibold'>{deliveryAddrs?.pincode}</span></h1>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => dispatch(setStepOfPayment(2))} className=' border px-9 py-3 h-fit flex justify-center items-center rounded-sm text-sm font-semibold text-blue-600 border-gray-300'>
                    CHANGE
                  </button>
                </div>
              ) 
              : 
              (
                <div className=' flex bg-white py-3 items-center w-full rounded-sm px-6 gap-4'>
                  <div className=' px-2 bg-slate-200 h-fit text-sm text-blue-600 rounded-sm'>2</div>
                  <h1 className='  font-semibold text-gray-400'>DELIVERY ADDRESS</h1>
                </div>
              )
            }
          </div>
          
        )
      }
      
    </div>
  )
}

export default DeliveryAddrCheckOut