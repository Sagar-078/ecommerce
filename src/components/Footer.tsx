"use client"
import { footerData } from "@/assets/footerData/footerData";
import Link from "next/link";
import { RiFacebookCircleLine } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";
import { PiStorefront, PiYoutubeLogoLight } from "react-icons/pi";
import { PiGift } from "react-icons/pi";
import { BiHelpCircle } from "react-icons/bi";
import paymentImage from "@/assets/images/payment-methods.svg"
import Image from "next/image";

function Footer(){
    return(
        <div className="bg-neutral-800 mt-8 ">
            <div className=" flex p-12">
                <div className=" flex flex-row  text-white  w-[55%] justify-between">
                    {
                        footerData.slice(0, 4).map((data:any, i:any) => {
                            return(
                                <div key={i} className=" flex gap-2 flex-col">
                                    <h1 className=" text-neutral-500 text-sm">{data?.sectionName}</h1>
                                    <div className=" flex flex-col gap-1">
                                        {data?.sectionAttributes.map((attrName:any, i:any) => {
                                            return(
                                                <Link key={i} href={attrName?.link} className=" font-semibold text-xs hover:underline">
                                                    {attrName?.Name}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className=" bg-neutral-600 w-0.5 mx-16"/>

                <div className=" flex flex-col text-white w-[40%]">
                    <div className=" flex flex-row   justify-between">
                        {
                            footerData.slice(4, 6).map((data:any, i:any) => {
                                return(
                                    <div key={i} className=" flex gap-2 flex-col">
                                        <h1 className=" text-neutral-500 text-sm">{data?.sectionName}</h1>
                                        <div className=" flex flex-col gap-1">
                                            {data?.sectionAttributes.map((attrName:any, i:any) => {
                                                return(
                                                    <div key={i} className=" font-semibold text-xs">
                                                        {attrName?.Name}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-neutral-500 text-sm">Social :</h1>
                        <div className=" flex text-2xl gap-4">
                            <RiFacebookCircleLine />
                            <FaXTwitter />
                            <PiYoutubeLogoLight />
                        </div>
                    </div>
                </div>
            </div>
            <div className=" bg-neutral-600 w-full h-0.5"/>
            <div className="flex py-4 justify-around">
                <div className="flex gap-2 items-center">
                    <PiStorefront className=" text-yellow-400"/>
                    <h1 className=" text-white text-sm">Become a seller</h1>
                </div>
                <div className="flex gap-2 items-center">
                    <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/advertise-image-866c0b.svg" alt=""/>
                    <h1 className=" text-white text-sm">Advertise</h1>
                </div>
                <div className="flex gap-2 items-center">
                    <PiGift className=" text-yellow-400"/>
                    <h1 className=" text-white text-sm">Gift Cards</h1>
                </div>
                <div className="flex gap-2 items-center">
                    <BiHelpCircle className=" text-yellow-400"/>
                    <h1 className=" text-white text-sm">Help Center</h1>
                </div>
                <div className="flex gap-2 items-center text-white text-sm">
                    <h1>© 2007-2024</h1>
                    <h1>Flipkart.com</h1>
                </div>

                <div className="flex gap-2 items-center">
                    <Image src={paymentImage} alt=""/>
                </div>

            </div>
        </div>
    )
}
export default Footer;