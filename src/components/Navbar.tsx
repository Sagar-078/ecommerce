"use client"
import Image from "next/image";
import flipkartLogo from "@/assets/images/fkheaderlogo_exploreplus-44005d_flipkart_logo.svg"
import { CiSearch } from "react-icons/ci";
import { VscAccount } from "react-icons/vsc";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { PiStorefront } from "react-icons/pi";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { BiCart, BiLogOut } from "react-icons/bi";
import { FcBusinessman, FcLike } from "react-icons/fc";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { setToken } from "@/redux/slices/auth";
import { setUser } from "@/redux/slices/user";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { resetCart } from "@/redux/slices/cart";
// import dynamic from "next/dynamic";

function Navbar(){

    const {user} = useSelector((state: RootState) => state.authUser);
    const {cart} = useSelector((state: RootState) => state.cartitem);
    console.log("user at navbar ", user);
    const [isClient, setIsClient] = useState<boolean>(false)
    const dispatch:AppDispatch = useDispatch();
    const session = useSession();
    const [keyword, setKeyword] = useState<string>("");
    const router = useRouter();

    async function logoutHandler(){
        const loading = toast.loading("Please wait... ", {position: "bottom-center"});
        try{
          const response = await axios.get('/api/auth/logout');
    
          if(response.status === 200){
            dispatch(setToken(null));
            dispatch(setUser(null));
            dispatch(resetCart());
            toast.success("Logout successfully", {position: "bottom-center"});
            console.log(session.status);
            if(session.status === 'authenticated'){
              signOut();
            }
          }
    
        }catch(err:any){
          console.log("error while logout handler ", err);
          toast.error("error while logout", {position: "bottom-center"});
        }finally{
          toast.dismiss(loading);
        }
    }

    // function searchKeyword (e:any){
    //     console.log("serach keyword ", e.target.value);
    //     setKeyWord(e.target.value);
    //     console.log("key word is ", keyWord);
    //     if(keyWord.length > 0 && e.key === 'Enter'){
    //         setKeyWord("");
    //         router.push(`/searchedProductPage/${keyWord}`);
    //     }
    // }

    typeof window !== 'undefined' && (window.onkeydown=(e:any) => {
        if(keyword.length > 0 && e.key === 'Enter'){
            setKeyword("");
            router.push(`/searchedProductPage/${keyword}`);
        }
    })

    useEffect(() => {
        setIsClient(true);
    }, [])

    return (

        <>
            {
                isClient ? 
                (
                    <nav className="flex w-full bg-white h-16 justify-around items-center">
                        <Link href={"/"}>
                            <Image src={flipkartLogo} alt="flipkart logo"/>
                        </Link>

                        <div className=" flex h-10 w-[50%] text-gray-900 bg-slate-200 rounded-md items-center gap-1">
                            <div className="p-2 text-2xl">
                                <CiSearch />
                            </div>
                            <input className="w-full h-full bg-transparent outline-none"
                                value={keyword} onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Search for Products, Brands and More" type="text"
                            />
                        </div>

                        <div className=" flex gap-9 items-center">
                            
                            {
                                user ? 
                                (
                                    <div className="  cursor-pointer group relative flex  gap-2 items-center">
                                        <img src={user?.profilePhoto} alt="profilephoto" className=" h-[30px] w-[30px] rounded-full"></img>
                                        <p>{user?.firstName}</p>
                                        <div className=" transition-all  duration-200 rounded-md invisible group-hover:visible  bg-slate-100 w-[50px] h-[50px]  rotate-45 absolute top-[120%] translate-y-1 left-[-5px]"></div>
                                        <div className=" text-slate-950  flex flex-col gap-2 items-start  transition-all z-50 duration-200 invisible group-hover:visible  bg-slate-200 p-4 w-[250px] rounded-lg absolute top-[150%] translate-x-[-100px] ">
                                            <Link href="/dashboard/myorders" className=" flex gap-2 items-center p-2 rounded-md w-full text-start hover:opacity-60 hover:bg-slate-500"><BiCart size={25} /> MY ORDERS</Link>
                                            <Link href="/dashboard" className=" flex gap-2 items-center p-2 rounded-md w-full text-start hover:opacity-60 hover:bg-slate-500"><FcBusinessman size={25} /> MY PROFILE</Link>
                                            <Link href="/dashboard/wishlist"   className=" flex gap-2 items-center p-2 rounded-md w-full text-start hover:opacity-60 hover:bg-slate-500"><FcLike size={25}/>  MY WISHLIST</Link>
                                            <button  onClick={logoutHandler} className=" flex gap-2 items-center p-2 rounded-md w-full text-start hover:opacity-60 hover:bg-slate-500"> <BiLogOut size={25}/>LOGOUT</button>
                                        </div>
                                    </div>

                                ) 
                                : 
                                (
                                    <Link href={"/signin"} className=" flex gap-2 items-center text-black text-lg">
                                        <VscAccount />
                                        Login
                                    </Link>
                                )
                            }
                            
                            <Link href={"/cart"} className="flex gap-2 items-center text-black text-lg">
                                <div className=" flex flex-col relative">
                                    {
                                        cart.length !== 0 ? 
                                        (
                                            <div className=" absolute bg-red-500 w-fit h-fit text-xs px-1 text-white font-semibold rounded-full -top-2 -right-0">
                                                {cart.length}
                                            </div>
                                        ) 
                                        : 
                                        (<div></div>)
                                    }
                                    <HiOutlineShoppingCart className="text-2xl" />
                                </div>
                                Cart
                            </Link>

                            <Link href={"https://ecommerce-seller-pi.vercel.app/"} className="flex gap-2 items-center text-black text-lg">
                                <PiStorefront />
                                Become a Seller
                            </Link>

                            <div className=" text-black text-xl font-extrabold">
                                <PiDotsThreeVerticalBold />
                            </div>
                        </div>

                    </nav>
                ) : (
                    <div >
                    </div>
                )
            }

        </>
        
    )
}

export default Navbar;
// export default dynamic (() => Promise.resolve(Navbar), {ssr: false})