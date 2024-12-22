"use client";
import Loading from "@/components/loaders/Loading";
import { productUrl } from "@/services/sellerUrl";
import axios from "axios";
import { useEffect, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import ProductSection from "@/components/ProductSection";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store/store";
import { setToken } from "@/redux/slices/auth";
import { setUser } from "@/redux/slices/user";
import { toast } from "react-toastify";
import { signOut, useSession } from "next-auth/react";
import jwt from "jsonwebtoken"
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const {token} = useSelector((state:any) => state.authToken);
  const dispatch:AppDispatch = useDispatch();
  const session = useSession();

  const imageData = [
    "https://rukminim2.flixcart.com/fk-p-flap/1000/170/image/47756118b7ebd061.jpg?q=80",
    "https://rukminim2.flixcart.com/fk-p-flap/1000/170/image/4d5aeab03ca1fa7f.jpg?q=80",
    "https://rukminim2.flixcart.com/fk-p-flap/1000/170/image/61775218f4487fe8.jpg?q=80",
    "https://rukminim2.flixcart.com/fk-p-flap/1000/170/image/d9290fb51138d286.png?q=80",
    "https://res.cloudinary.com/djq1vmvy4/image/upload/v1691358015/banner3_g82zfl.webp",
    "https://res.cloudinary.com/djq1vmvy4/image/upload/v1691358015/banner4_hgzv7z.webp",
  ];

  async function getProductDetails() {
    try {
      const response = await axios.get(productUrl.getProductDetails);
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (err: any) {
      console.log("error while get product details", err);
    } 
  }

  async function logoutHandler(){
    const loading = toast.loading("Please wait... ", {position: "bottom-center"});
    try{
      const response = await axios.get('/api/auth/logout');

      if(response.status === 200){
        dispatch(setToken(null));
        dispatch(setUser(null));
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

  async function isTokenvalid(){
    if(token !== null){
      const payload: any = jwt.decode(token);
      if(payload?.exp * 1000 < Date.now()){
        await logoutHandler();
        return toast.error("Session expired please login again", {position: "bottom-center"});
      }
    }
  }

  async function initialLoad() {
    await getProductDetails();
  }
  
  async function init(){
    try{
      await isTokenvalid();
      if (data === null) {
        await initialLoad();
      }
      // await initialLoad();
    }catch(err:any){
      console.log("error while ", err);
    }finally{
      setLoading(false);
    }
  }


  useEffect(() => {
     init();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : data ? (
        <div>
          <div className=" bg-white mt-3 ml-3 mr-3">
            <div className=" flex w-[80%] mx-auto items-center justify-between p-3">
              {data?.Categories.map((category: any, i: any) => (
                <Link href={`/categoryproducts/${category._id}`} key={i} className=" flex flex-col items-center gap-2">
                  <img
                    src={category?.categaryPicture}
                    alt="categoryimg"
                    className="h-16"
                  />
                  <h1>{category?.categaryName}</h1>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-3 mx-4 bg-white p-1">
            <Swiper
              loop={true}
              pagination={true}
              modules={[Autoplay, Navigation, Pagination]}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={true}
              slidesPerView={1}
            >
              {imageData.map((item: any, i: any) => (
                <SwiperSlide key={i}>
                  <img src={item} alt="bannerimg" className="h-full w-full" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="">

            <div className=" mt-4 ml-4 mr-4 bg-white rounded-sm pb-3">
              <div className=" flex items-center justify-between py-2 px-2">
                <h1 className=" text-xl font-semibold">Deals On Smartphones</h1>
                <Link href={`/categoryproducts/${data?.Categories[1]?._id}`} className=" text-blue-700 text-3xl">
                  <IoIosArrowDroprightCircle />
                </Link>
              </div>
              
              <ProductSection products={data?.Categories[1]?.relatedProduct}/>

            </div>

            <div className=" mt-4 ml-4 mr-4 bg-white rounded-sm pb-3">
              <div className=" flex items-center justify-between py-2 px-2">
                <h1 className=" text-xl font-semibold">Best on Fashion</h1>
                <Link href={`/categoryproducts/${data?.Categories[2]?._id}`} className=" text-blue-700 text-3xl">
                  <IoIosArrowDroprightCircle />
                </Link>
              </div>
              
              <ProductSection products={data?.Categories[2]?.relatedProduct}/>

            </div>

            <div className=" mt-4 ml-4 mr-4 bg-white rounded-sm pb-3">
              <div className=" flex items-center justify-between py-2 px-2">
                <h1 className=" text-xl font-semibold">Top Discount Products</h1>
                <div className=" text-blue-700 text-3xl cursor-pointer">
                  <IoIosArrowDroprightCircle />
                </div>
              </div>
              
              <ProductSection products={data?.TopDiscountProduct}/>

            </div>

            <div className=" mt-4 ml-4 mr-4 bg-white rounded-sm pb-3">
              <div className=" flex items-center justify-between py-2 px-2">
                <h1 className=" text-xl font-semibold">New Product</h1>
                <div className=" text-blue-700 text-3xl cursor-pointer">
                  <IoIosArrowDroprightCircle />
                </div>
              </div>
              
              <ProductSection products={data?.NewProduct}/>

            </div>

            <div className=" mt-4 ml-4 mr-4 bg-white rounded-sm pb-3">
              <div className=" flex items-center justify-between py-2 px-2">
                <h1 className=" text-xl font-semibold">Best Selling Product</h1>
                <div className=" text-blue-700 text-3xl cursor-pointer">
                  <IoIosArrowDroprightCircle />
                </div>
              </div>
              
              <ProductSection products={data?.BestSellingProduct}/>

            </div>

          </div>

        </div>
      ) : (
        <p>Failed to load data, please try again later.</p>
      )}
    </>
  );
}