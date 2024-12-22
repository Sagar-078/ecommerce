// "use client"
// import Loading from '@/components/Loading';
// import axios from 'axios';
// import { useParams } from 'next/navigation';
// import React, { useEffect, useState } from 'react'
// import { productUrl } from '@/services/sellerUrl';
// import Image from 'next/image';
// import errorImage from "@/assets/images/error-no-search-results_2353c5.png";
// import SearchedProducts from '@/components/SearchedProducts';

// const page = () => {

//   const [loading, setLoading] = useState<boolean>(true);
//   const [products, setProducts] = useState<any[]>([]);
//   let {keyword}:any = useParams();
//   console.log("key word is ", keyword);
//   console.log("product is ???? => ", products);

//   async function getSeachedProduct(){
//     keyword=keyword.replace(/%20/g," ");
//     try{
//       const response = await axios.post(productUrl.getSeachedProduct, {keyword: keyword});
//       console.log("response of get seached product ", response);
//       if(response.status === 200){
//         setProducts(response.data.Products);
//       }
//     }catch(error:any){
//       console.log("error while get searched product ", error);
//     }finally{
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     getSeachedProduct();
//   }, [keyword]);

//   return (
//     <div className='h-[90vh]'>
//       {
//         loading ? (<Loading/>) : (
//           <div className=' h-full w-full mt-3 px-5 flex bg-white'>
//             {
//               products.length === 0 ? 
//               (
//                 <div className='w-full flex flex-col justify-center items-center gap-5'>
//                   <Image src={errorImage} alt='' className='h-[23%] w-[18%]'/>
//                   <h1 className=' text-2xl font-semibold'>Sorry, no results found!</h1>
//                   <h1 className=' text-xl opacity-40'>Please check the spelling or try searching for something else</h1>
//                 </div>
//               ) 
//               : 
//               (
//                 <div>
//                   <div>
//                     <h1>Showing results for <span>{keyword}</span></h1>
//                   </div>
//                   <div>
//                     {
//                       products.map((product, i) => {
//                         return (
//                           <div key={i}>
//                             <SearchedProducts product={product} keyword={keyword}/>
//                           </div>
//                         )
//                       })
//                     }
//                   </div>
//                 </div>
//               )
//             }
//           </div>
//         )
//       }
//     </div>
//   )
// }

// export default page

"use client"
import Loading from '@/components/loaders/Loading';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { productUrl } from '@/services/sellerUrl';
import Image from 'next/image';
import errorImage from "@/assets/images/error-no-search-results_2353c5.png";
import SearchedProducts from '@/components/SearchedProducts';
import Link from 'next/link';
import { FcLikePlaceholder } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { FcLike } from "react-icons/fc";
import {removefromwishlist, setWishlistitem} from "@/redux/slices/wishlistItem";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from '@/redux/store/store';


const Page = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { keyword: rawKeyword }:any = useParams();
  const [formattedKeyword, setFormattedKeyword] = useState('');


  const {wishlist} = useSelector((state:RootState) => state.wishlistitem);

    const dispatch:AppDispatch = useDispatch();

    function handleAddwishlist (product:any){
        dispatch(setWishlistitem({...product}));
        toast.success("added to wishlist", {position: "bottom-center"});
    }
 
    function handleRemovewishlist (productId:any) {
        dispatch(removefromwishlist(productId));
        toast.info("removed from wishlist", {position: "bottom-center"});
    }


  useEffect(() => {
    // Format the keyword once when the component mounts or when rawKeyword changes
    if (rawKeyword) {
      setFormattedKeyword(rawKeyword.replace(/%20/g, ' '));
    }
  }, [rawKeyword]);

  const getSearchedProduct = async () => {
    try {
      const response = await axios.post(productUrl.getSeachedProduct, { keyword: formattedKeyword });
      if (response.status === 200) {
        setProducts(response.data.Products);
      }
    } catch (error) {
      console.log("Error fetching searched products: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formattedKeyword) {
      getSearchedProduct();
    }
  }, [formattedKeyword]);

  return (
    <div className="h-[90vh]">
      {loading ? (
        <Loading />
      ) : (
        <div className="h-full w-full mt-3 px-5 flex bg-white">
          {products.length === 0 ? (
            <div className="w-full flex flex-col justify-center items-center gap-5">
              <Image src={errorImage} alt="" className="h-[23%] w-[18%]" />
              <h1 className="text-2xl font-semibold">Sorry, no results found!</h1>
              <h1 className="text-xl opacity-40">Please check the spelling or try searching for something else</h1>
            </div>
          ) : (
            <div className=' h-full w-full flex flex-col p-5 gap-10'>
              <h1 className=' text-lg font-medium'>Showing results for <span className=''>"{formattedKeyword}"</span></h1>
              <div className=' w-full h-full flex flex-wrap overflow-y-scroll sidebar'>
                {products.map((product:any, i) => (
                  <div className=' flex flex-col h-[400px]  hover:border hover:shadow-lg rounded-md'>
                    <div className=' flex justify-between'>
                      <div>
                        {

                        }
                      </div>
                      <div className=' p-2'>
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

                    <Link href={`/product/${product._id}`} key={i} className=' '>
                      <SearchedProducts product={product} keyword={formattedKeyword} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;