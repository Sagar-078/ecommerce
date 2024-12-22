"use client"
import Loading from '@/components/loaders/Loading';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { FiPlus } from "react-icons/fi";
import { useSelector } from 'react-redux';
import addressImage from "@/assets/images/myaddresses-empty_3b40af.png";
import AddressForm from '@/components/AddressForm';
import { toast } from 'react-toastify';
import { BsThreeDotsVertical } from "react-icons/bs";

const page = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const {token} = useSelector((state:any) => state.authToken);
  const [loading, setLoading] = useState<boolean>(true);
  const [address, setAddress] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [indivisualAddress, setIndivisualAddressId] = useState();
  console.log("address at add ", address);

  async function getAddress(){
    try{
      const response = await axios.get("/api/address/getAddress", {
        headers: {
          Authorization:`Bearer ${token}`
        }
      })
      console.log("response at get address ", response);
      setAddress(response.data.Address);
    }catch(error:any){
      console.log("error while get address ", error);
    }finally{
      setLoading(false);
    }
  }

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

  async function deleteAddress(addressId:string){
    console.log("address id is =>>", addressId);
    const loading = toast.loading("Deleting address...");
    try{
      const response = await axios.delete('/api/address/deleteAddress',{
        headers: {
          "Authorization": `Bearer ${token}`
        },
        data: {addressId}
      });
      console.log( "response of delete address",response);
      if(response.status === 200){
        await getAddress();
        toast.success("Address deleted successfully");
      }
    }catch(error:any){
      console.log("error while delete address ", error);
    }finally{
      toast.dismiss(loading);
    }
  }

  async function editHandler(addr:any){
    setIndivisualAddressId(addr);
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

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <div className=' h-full w-full'>
      {
        loading ? 
        (
          <Loading/>
        ) 
        : 
        (
          <div className=' h-full w-full'>
            {
              (address.length === 0 && !showForm)  ? 
              (
                <div className=' h-full w-full flex flex-col justify-center items-center gap-7'>
                  <Image src={addressImage} alt='' height={200} width={200}/>
                  <div className=' flex flex-col items-center gap-2'>
                    <h1 className=' font-semibold text-xl'>No Addresses found in your account!</h1>
                    <h1 className=' text-xs'>Add a delivery address.</h1>
                    <button onClick={() => setShowForm(true)} className=' bg-blue-600 px-10 py-3 rounded-sm font-semibold mt-3 text-white'>
                      Add ADDRESSES
                    </button>
                  </div>
                </div>
              ) 
              : 
              (
                <div className=' flex flex-col h-full w-full p-7 gap-5'>

                  <h1 className=' font-semibold text-lg'>Manage Addresses</h1>

                  {
                    showForm && (
                      <AddressForm indivisualAddress={indivisualAddress} 
                        createAddress={createAddress} setShowForm={setShowForm} 
                        editMode={editMode} setEditMode={setEditMode}
                        editAddress={editAddress}  
                      />
                    )
                  }
                  {
                    !showForm && (
                      <div className=' flex flex-col pt-3'>
                        <button className=' flex gap-3 items-center text-blue-600 font-medium text-base border p-3 rounded-md' onClick={() => setShowForm(true)}>
                          <FiPlus /> ADD A NEW ADDRESS 
                        </button>

                        <div className=' mt-6 flex flex-col max-h-[600px] sidebar overflow-y-scroll'>
                          {
                            address.map((addr:any, i) => {
                              return(
                                <div key={i} className=' flex justify-between border p-6 rounded-sm'>
                                  <div  className=' flex flex-col gap-2'>
                                    <h1 className=' text-xs capitalize opacity-50 py-1 px-2 rounded-sm bg-gray-200 w-fit'>{addr?.addressType}</h1>
                                    <div className=' flex gap-3 items-center'>
                                      <h1 className=' font-semibold capitalize'>{addr?.fullName}</h1>
                                      <h1 className=' font-semibold text-sm'>{addr?.mobileNumber}</h1>
                                    </div>
                                    <div className=' flex gap-1 items-center'>
                                      <p className=' tex-sm font-light'>{addr?.address},, {addr?.locality}, {addr?.district}, {addr?.state}</p>
                                      -
                                      <p className=' text-sm'>{addr?.pincode}</p>
                                    </div>
                                  </div>
                                  {/* <button>
                                    <BsThreeDotsVertical />
                                  </button> */}

                                  <div className='  relative group h-fit'>
                                    <BsThreeDotsVertical />
                                    <div className=' invisible group-hover:visible flex flex-col gap-2 border  bg-white w-fit px-5 shadow-xl text-sm p-2 rounded-md  h-fit absolute top-[-5px] right-0 '>
                                      {/* {
                                          !data.defaultaddress && (
                                              <button onClick={makedefault} className=' hover:text-blue-700'>
                                              Mark As Deafult
                                            </button>
                                          )
                                      } */}
                                      <button className=' hover:text-blue-700 text-left'
                                        onClick={() => editHandler(addr)}
                                      >
                                        Edit
                                      </button>
                                      <button className=' hover:text-blue-700 text-left'
                                        onClick={() =>deleteAddress(addr._id)}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>

                                </div>
                              )
                            })
                          }
                        </div>

                      </div>
                    )
                  }
                </div>
                
              )
            }
          </div>
        )
      }
    </div>
  )
}

export default page