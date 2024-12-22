"use client"
import { AppDispatch, RootState } from "@/redux/store/store";
import { MdStar } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { removefromwishlist } from "@/redux/slices/wishlistItem";
import { toast } from "react-toastify";
import Link from "next/link";

function wishlist(){

    // const dispatch:AppDispatch= useDispatch();
    const {wishlist} = useSelector((state:RootState) => state.wishlistitem);
    const dispatch:AppDispatch = useDispatch();
    console.log("wishlist item is ", wishlist);

    function handleRemovewishlist (productId:any) {
        dispatch(removefromwishlist(productId));
        toast.info("removed from wishlist", {position: "bottom-center"});
    }

    return(
        <div className="h-full w-full">
            {
                wishlist.length !== 0 ? 
                (
                    <div className="w-full h-full">
                        <div className=" p-6 border-b">
                            <p className=" font-semibold text-lg">My Wishlist ({wishlist.length})</p>
                        </div>

                        <div className={` w-full h-[90%] sidebar overflow-y-scroll flex flex-col p-6 gap-6`}>
                            {
                                wishlist.map((list:any, i:any) => {
                                    return(
                                        <div key={i} className={`flex ${i !== wishlist.length-1 ? "border-b" : ""}  pb-4 justify-between w-full`}>
                                            <Link href={`/product/${list._id}`} className="flex gap-12 w-full">
                                                <img src={`${list?.images[0]}`} height={80} width={80}/>
                                                <div className=" w-[80%] flex flex-col gap-1">
                                                    <h1>{list.productName}</h1>
                                                    <div className="flex gap-3">
                                                        <div className='flex gap-1 items-center bg-green-600 text-sm px-1 w-fit rounded-[3px] text-white'>
                                                            {
                                                                list?.averageRating ? (list?.averageRating) : (3.2)
                                                            }
                                                            <MdStar />
                                                        </div>
                                                        <h1 className=' opacity-60'>{`( ${Array.isArray(list?.ratings) && list?.ratings.length !== 0 ? (list?.ratings.length) : (1)} ) Ratings`}</h1>
                                                    </div>

                                                    <div className=' flex gap-3 items-baseline'>
                                                        <p className=' font-bold text-xl'>₹{list?.sellPrice}</p>
                                                        <p className=' opacity-60 line-through'>₹{list?.originalPrice}</p>
                                                        <p className=' font-semibold text-sm text-green-600'>{list?.discount}% off</p>
                                                    </div>
                                                </div>
                                            </Link>
                                            <MdDelete className=" text-gray-300 text-xl cursor-pointer" onClick={() => handleRemovewishlist(list._id)}/>
                                        </div>
                                    )
                                })
                            }
                        </div>

                    </div>
                ) 
                : 
                (
                    <div className="w-full h-full flex items-center justify-center font-bold">
                        No Wishlist item Found
                    </div>
                )
            }
            
        </div>
    )
}

export default wishlist;