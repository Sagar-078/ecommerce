"use client"
import Loading from "@/components/loaders/Loading";
import { RootState } from "@/redux/store/store";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import date from 'date-and-time'
import { AiFillStar } from "react-icons/ai";

const page = () => {

    const [orderHistory, setOrderHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const {token} = useSelector((state:RootState) => state.authToken);

    // console.log("order history ---===>>>::: ", orderHistory);

    async function getOrderHistory(){
        try{

            const response = await axios.get('/api/order/findOrderHistory', {
                headers: {
                    Authorization:`Bearer ${token}`
                }
            });

            console.log("response of find order history ", response);

            if(response.status === 200){
                setOrderHistory(response?.data?.OrderHistory);
            }

        }catch(error:any){
            console.log("error while find order history ", error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        getOrderHistory();
    }, []);

    return(
        <div className=" h-full bg-white">

            {
                loading ? (<Loading/>) 
                : 
                (
                    <div className=" h-full bg-slate-200">
                        {
                            orderHistory.length === 0 ? 
                            (
                                <div className=" h-full bg-white flex items-center justify-center">
                                    <h1>No Order Found</h1>
                                </div>
                            ) 
                            : 
                            (
                                <div className=" h-full flex flex-col overflow-y-scroll sidebar">
                                    {
                                        orderHistory.map((data:any, i:any) => {
                                            // console.log("data after map orderhistory :::===>>> ||>>", data);
                                            return(
                                                <div key={i} className=" flex flex-col">
                                                    {
                                                        data.products.map((product:any, j:any) => {
                                                            return(
                                                                <Link href={`/orders/${data._id}?productid=${product._id}`} key={j} className=" mb-2 flex p-2 rounded-sm justify-between bg-white ">
                                                                    <img src={`${product?.images[0]}`} alt="" height={80} width={80} className="p-2"/>
                                                                    <div className=" w-[40%]">
                                                                        <h1>{product?.productName}</h1>
                                                                        <div className="flex flex-col gap-2">
                                                                            <p>Price: {product?.sellPrice}</p>
                                                                            <p>Quantity: {product?.quantity}</p>
                                                                        </div>
                                                                        
                                                                    </div>

                                                                    <div className=" w-[300px] text-slate-500 font-semibold flex flex-col gap-2">
                                                                        {
                                                                            product?.status==="Pending" && (
                                                                                <>
                                                                                
                                                                                <h1>Waiting for the seller to ship the product</h1>
                                                                                <h1>Order status: {"PENDING"}</h1>
                                                                                <h1>Order date: {date.format(new Date(product?.lastupdatedon), 'YYYY/MM/DD HH:mm')}</h1>
                                                                                </>
                                                                            )
                                                                        }
                                                                        {
                                                                            product?.status==="shipped" && (
                                                                                <>
                                                                
                                                                                <h1 className="  text-green-700">Waiting for the delivery of product</h1>
                                                                                <h1>Order status: {"SHIPPED"}</h1>
                                                                                <h1>Order date: {date.format(new Date(product?.lastupdatedon), 'YYYY/MM/DD HH:MM')}</h1>
                                                                                </>
                                                                            )
                                                                        }
                                                                        {
                                                                            product?.status==="delivered" && (
                                                                                <>
                                                                                    <h1>Order status: {"DELIVERED"}</h1>
                                                                                    <h1>Delivered on : {date.format(new Date(product?.lastupdatedon), 'YYYY/MM/DD HH:MM')}</h1>
                                                                                    <Link href={`/ratingAndReviews/${data._id}?productid=${product._id}`} className=" flex gap-2 text-blue-600 items-center"><AiFillStar/> Rate & Review Product</Link>
                                                                                </>
                                                                            )
                                                                        }
                                                                        {
                                                                            product?.status==="cancelled" && (
                                                                                <>
                                                                                <h1>Order status: {product?.status}</h1>
                                                                                <h1>Order date: {date.format(new Date(product?.lastupdatedon), 'YYYY/MM/DD HH:MM')}</h1>
                                                                                </>
                                                                            )
                                                                        }
                                                
                                                                    </div>

                                                                </Link>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            )
                                        })
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

export default page;