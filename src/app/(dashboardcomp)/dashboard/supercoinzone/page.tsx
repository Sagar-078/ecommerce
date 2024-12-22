"use client"
import Loading from '@/components/loaders/Loading'
import React, { useEffect, useState } from 'react'
import supercoinzone from "@/assets/images/super_coin_icon_22X22.webp";
import bannerofsupercoin from '@/assets/images/01AvailExtra.webp';
import Image from 'next/image';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ReactPlayer from 'react-player';

const page = () => {

    const {token} = useSelector((state:any) => state.authToken);
    const [loading, setLoading] = useState(true);
    const [supercoins, setSupercoins] = useState();

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
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        getSuperCoin();
    }, []);

  return (
    <div className=' h-full w-full flex '>
        {
            loading ? 
            (
                <Loading/>
            ) 
            : 
            (
                <div className=' w-full h-full flex flex-col p-10'>
                    <h1 className='flex gap-4 font-semibold text-xl capitalize items-center'>SuperCoin Balance 
                        <Image src={supercoinzone} alt='' className='h-5 w-5'/>
                        {supercoins}
                    </h1>
                    <div className=' mt-10 flex justify-center w-full'>
                        <Image src={bannerofsupercoin} alt='' className=' w-[80%]'/>
                    </div>

                    <div className=' flex mt-10 items-center justify-center'>
                    <ReactPlayer loop playing url='https://res.cloudinary.com/djq1vmvy4/video/upload/v1691047797/animated_medium20211108-27044-jnczo0_sd3wwl.mp4'   width='50%' height='100%'/>
                    <ReactPlayer loop playing url='https://res.cloudinary.com/djq1vmvy4/video/upload/v1691048768/animated_medium20211108-1718-186rt68_dvgphk.mp4'   width='50%' height='100%'/>
                    </div>

                </div>
            )
        }
    </div>
  )
}

export default page