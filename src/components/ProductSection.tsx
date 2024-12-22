"use client"
import { AppDispatch, RootState } from "@/redux/store/store";
import Link from "next/link";
import { FcLikePlaceholder } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { FcLike } from "react-icons/fc";
import {removefromwishlist, setWishlistitem} from "@/redux/slices/wishlistItem";
import { toast } from "react-toastify";

function ProductSection({products}:any){
    const {wishlist} = useSelector((state:RootState) => state.wishlistitem);
    console.log("wish list items ", wishlist);
    const dispatch:AppDispatch = useDispatch();

    function handleAddwishlist (product:any){
        dispatch(setWishlistitem({...product}));
        toast.success("added to wishlist", {position: "bottom-center"});
    }
 
    function handleRemovewishlist (productId:any) {
        dispatch(removefromwishlist(productId));
        toast.info("removed from wishlist", {position: "bottom-center"});
    }

    return(
        <div className="flex px-3 py-3 w-full justify-between">
            {
                products.slice(0, 6).map((product:any, i:any) => {
                    return(
                        <div key={i}  className=" w-[220px] flex flex-col items-center justify-center border-[1px] p-3 rounded-md">
                            <div className="flex justify-between w-full">
                                <div>
                                    {

                                    }
                                </div>
                                <div>
                                    {
                                        wishlist.findIndex((listitem:any) => listitem._id === product._id) === -1 ? 
                                        (
                                            <button onClick={() => handleAddwishlist(product)}>
                                                <FcLikePlaceholder />
                                            </button>
                                        ) : 
                                        (
                                            <button onClick={() => handleRemovewishlist(product._id)}>
                                                <FcLike />
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                            <Link href={`/product/${product._id}`} className="flex flex-col items-center gap-1">
                                <div className="">
                                    <img src={product?.images[0]} className="h-[150px] object-fill hover:scale-105 duration-300"/>
                                </div>
                                <h1>
                                    {product?.productName.substring(0, 20)}..
                                </h1>
                                <div className=" flex gap-3 items-center">
                                    <h1>₹<span className=" line-through">{product?.originalPrice}</span></h1>
                                    <h1>₹<span className="font-medium">{product?.sellPrice}</span></h1>
                                </div>
                                <h1 className=" font-semibold">{product?.discount}% off</h1>
                            </Link>
                        </div>
                    )
                })
            }         
        </div>
    )

}
export default ProductSection;