"use client"
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { BsCart2, BsFillBagHeartFill } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { FaUserLarge } from "react-icons/fa6";
import { RiContactsBookFill } from "react-icons/ri";
import { usePathname } from 'next/navigation';

const DashboardSidebar = ({user}:{user:any}) => {
  console.log("user at dashboard sidebar ", user);
  const pathname = usePathname();
  const pathSegment = pathname.split("/").pop();

  const links = [
    {
      name:"ACCOUNT SETTINGS",
      icon:<FaUserLarge size={20} className=" inline-block" />,
      options:[
          {
            name:"Profile information",
            link:"/dashboard"
          },
          {
            name:"Manage address",
            link:"/dashboard/address"
          }
      ]
    },
    {
      name:"MY STUFF",
      icon:<RiContactsBookFill size={23} className=" inline-block" />,
      options:[
        {
          name:"My reviwes & ratings",
          link:"/dashboard/ratings"
        },
        {
          name:"My wishlist",
          link:"/dashboard/wishlist"
        },
        {
          name:"Supercoin zone",
          link:"/dashboard/supercoinzone"
        }
      ]
    }
  ]

  return (
    <div className='w-full h-full flex flex-col gap-6'>
      <div className='flex h-[70px] w-full shadow-lg bg-white items-center rounded-sm p-2 gap-5'>
        <Image alt='' height={50} width={50} src={`${user?.profilePhoto}`}/>
        <div className='flex flex-col'>
          <p className=' text-xs'>Hello,</p>
          <p className=' font-semibold capitalize'>{user?.firstName} {user?.lastName}</p>
        </div>
      </div>

      <div className=' bg-white h-full w-full rounded-sm shadow-lg'>
        <Link href={'/dashboard/myorders'} className={` p-5 group flex items-center w-full hover:text-blue-600 justify-between border-b pb-3 ${pathSegment === 'myorders' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className=' flex gap-3 justify-center'>
            <BsCart2 className=' text-lg font-semibold text-blue-600'/>
            <p className={` font-semibold text-lg  group-hover:text-blue-600`}>MY ORDERS</p>
          </div>
          <IoIosArrowForward />
        </Link>

        <div className=' flex flex-col mt-5 gap-5'>
          {
            links.map((link, i) => {
              return(
                <div key={i} className=' flex flex-col justify-center border-b'>
                  <div className=' flex items-center gap-3 p-3'>
                    <div className=' text-blue-600'>{link.icon}</div>
                    <h1 className='font-semibold text-lg text-gray-400'>{link.name}</h1>
                  </div>

                  <div className=' flex flex-col '>
                    {
                      link.options.map((option, i) => {
                        return(
                          <Link href={option?.link} key={i} className={` hover:text-blue-600 pl-8 p-2 ${option.link === pathname && " text-blue-600 w-full bg-blue-100"}`}>
                            <p>{option?.name}</p>
                          </Link>
                        )
                      })
                    }
                  </div>

                </div>
              )
            })
          }
        </div>

      </div>

    </div>
  )
}

export default DashboardSidebar