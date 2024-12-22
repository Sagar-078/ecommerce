"use client";
import CategoryProductSection from '@/components/CategoryProductSection';
import Loading from '@/components/loaders/Loading';
import SideBar from '@/components/SideBar';
import { categoryUrl } from '@/services/sellerUrl';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const page = () => {
  const { categoryproductsid } = useParams();
  const [loading, setLoading] = useState(true);
  const [sidebarData, setSidebarData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [bestSellingProduct, setBestSellingProduct] = useState<any[]>([]);

  async function getCategoryProductsData() {
    try {
      const response = await axios.post(categoryUrl.getCategoryProducts, { categoryId: categoryproductsid });
      setSidebarData(response?.data?.FilterData?.categoryAttributes);
      setProductData(response?.data?.Products);
      const bestSellingProducts = response?.data?.bestSellingProduct.map((product: any) => product._id);
      setBestSellingProduct(bestSellingProducts);
    } catch (error: any) {
      console.log("Error while getting category products data", error);
    } finally {
      setLoading(false);
    }
  }

  async function applyFilters(filters: any) {
    console.log("filter is applied ...");
    try {
      const response = await axios.post(categoryUrl.getFilteredProducts, { categoryId: categoryproductsid, filters });
      console.log("response of filtered applied ", response);
      setProductData(response?.data?.FilterProduct);
    } catch (error: any) {
      console.log("Error while applying filters", error);
    }
  }

  async function resetFilters() {
    getCategoryProductsData(); // Reset to initial data
  }

  useEffect(() => {
    getCategoryProductsData();
  }, []);

  return (
    <div className='h-full w-full'>
      {loading ? (
        <Loading />
      ) : (
        <div className='flex w-full h-[93vh] justify-between pt-6 px-6'>
          <SideBar sidebarData={sidebarData} applyFilters={applyFilters} resetFilters={resetFilters} />
          <CategoryProductSection productData={productData} bestSellingProduct={bestSellingProduct} />
        </div>
      )}
    </div>
  );
};

export default page;