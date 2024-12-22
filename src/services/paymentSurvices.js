"use client"
import axios from "axios";
import { resolve } from "path";
import { toast } from "react-toastify"
import { setBuyingProduct } from "@/redux/slices/payment";
import { NextResponse } from "next/server";
import razpaylogo from '@/assets/images/razorpaylogo.png';

function loadScript(src){
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        }
        script.onerror = () => {
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

async function verifyPayment(response, buyingProduct, deliveryAddrs, supercoinsused, supercoinsearnd, token, router, amount, dispatch){
    const loading = toast.loading('Please wait...', {position: 'bottom-center'});
    try{

        const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = response;
        console.log("all are about razorpay ", razorpay_payment_id,razorpay_order_id,razorpay_signature);

        const result=await axios.post('/api/payment/verifypayment',{razorpay_payment_id:razorpay_payment_id,razorpay_order_id:razorpay_order_id,razorpay_signature:razorpay_signature,
            buyingProduct: buyingProduct, address:deliveryAddrs,supercoinsused:supercoinsused,
            supercoinsearnd:supercoinsearnd,amount:amount/100
            },{
                headers:{
                  Authorization:`Bearer ${token}`
                }
            }
        );

        console.log('result of verify payment ..>>>', result);

        if(result.status === 200){
            toast.success("Product purchased successfully", {position: 'bottom-center'});
            console.log("buying product before set buying product ", buyingProduct);
            dispatch(setBuyingProduct([]));
            console.log("buying product after set buying product ", buyingProduct);
            router.push('/dashboard/myorders');
        }

    }catch(error){
        console.log("error while verify payment ", error);
        toast.error('Error while verify payment', {position: 'bottom-center'});
        return NextResponse.json({
            success: false,
            message: "error while verify payment"
        }, {status: 500});
    }finally{
        toast.dismiss(loading);
    }
}


export const capturePayment = async (buyingProduct, deliveryAddrs,  platFormFee, deliveryCharge, supercoinsused, token, user, router, dispatch) => {
    const loadingToast = toast.loading('Please wait...', {position: 'bottom-center'});

    try{

        const response = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        console.log("response of load script -->> ", response);
        if(!response){{
            toast.error('razorpay faild to load', {position:'bottom-center'});
            return false;
        }}

        const orderResponse = await axios.post('/api/payment/capturepayment', {
            buyingProduct, address:deliveryAddrs, supercoinsused, platFormFee, deliveryCharge
          },{
            headers:{
              Authorization:`Bearer ${token}`
            }
        })
        console.log("order response at capture payment ", orderResponse);

        if(!orderResponse){
            toast.error('Payment initialization faild');
            return false;
        }

        const options = {
            key: process.env.RAZORPAYKEY_ID_CLIENT,
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id:orderResponse.data.data.orderid,
            name:"Flipkart Clone",
            description: "Thank you for shopping with us",
            image:razpaylogo,
            prefill: {
                name:`${user.firstName}`,
                email:user.email
            },
            handler: function(response){
                verifyPayment(response, buyingProduct, deliveryAddrs, orderResponse?.data?.data?.supercoinsused, orderResponse?.data?.data?.supercoinsearnd, token, router, orderResponse?.data?.data?.amount, dispatch);
            }
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function(response) {
            toast.error("oops, payment failed", {position: 'bottom-center'});
            console.log(response.error);
        })

    }catch(error){
        console.log("error while capture payment ", error);
        toast.error('error while capture payment', {position: 'bottom-center'});
    }
    toast.dismiss(loadingToast);

}