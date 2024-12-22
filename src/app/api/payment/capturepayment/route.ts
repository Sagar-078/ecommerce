import { connect } from "@/config/dbconfig";
import { productUrl } from "@/services/sellerUrl";
import { getuserFromToken } from "@/utils/middleware";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import User from '@/models/user'
import Address from "@/models/address";
import { instance } from "@/config/razorpay";

export async function POST(req:NextRequest){
    try{
        console.log("called for capture payment..");
        const {buyingProduct, address, supercoinsused, platFormFee, deliveryCharge} = await req.json();
        console.log("at capture payment buying product ---->>>>> ", buyingProduct);
        console.log("at capture payment address ---->>>>> ", address);
        console.log("at capture payment super coin used ---->>>>> ", supercoinsused);

        if(!buyingProduct || !address || buyingProduct.length === 0){
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            }, {status: 400});
        }

        const user = await getuserFromToken(req);
        if(!user){
            return NextResponse.json({
                success: false,
                message: "Unauthrized request"
            }, {status: 400});
        }

        await connect();

        const buyingProductId = buyingProduct.map((product:any) => product._id);
        const productsonSeller = await axios.post(productUrl.getProductsById, {productsid: buyingProductId});
        console.log("products on seller =-=>-", productsonSeller);
        const productsFromsellerData = productsonSeller?.data?.Products
        console.log("products from seller data ---===??..>>> ", productsFromsellerData);

        if(!productsFromsellerData || productsFromsellerData?.length === 0){
            return NextResponse.json({
                success: false,
                message: 'No Products found'
            }, {status: 400});
        }

        let totalAmount=0;
        let supercoinsearned=0;

        for(const product of productsFromsellerData){
            console.log("product at for loop ---===>>> ", product);
            if(product?.numberOfProducts ===0){
                return NextResponse.json({
                    Success:false,
                    Message:`${product?.productname} is out of stock`
                },{status:400})
            }

            const buyingProductFromUser = buyingProduct.find((buyingProductFromUser:any) => buyingProductFromUser._id === product._id)
            console.log("buying product from user --==>> ", buyingProductFromUser);
            if(buyingProductFromUser?.quantity > product?.numberOfProducts){
                return NextResponse.json({
                    success: false,
                    message: "Out of stock"
                }, {status: 400});
            }
            
            totalAmount += buyingProductFromUser?.quantity * product.sellPrice + platFormFee + deliveryCharge;
            console.log("super coind earned calculate --==>>> ", `${buyingProductFromUser?.quantity}`,'*', `${product?.sellPrice}`, '*', 2/100);
            console.log("process.....>>>> ", `${(buyingProductFromUser?.quantity * product?.sellPrice * 2)/100}`);
            supercoinsearned += Math.floor((buyingProductFromUser?.quantity * product?.sellPrice * 2)/100)<=200 ? Math.floor((buyingProductFromUser?.quantity * product?.sellPrice * 2)/100):200;
            console.log("super coins earned --==::>> ", supercoinsearned);

        }

        const buyer=await User.findById(user.id,{supercoins:1,addresses:1});

        console.log('buyer is ---====--|>|> ', buyer);
        if(!buyer){
            return NextResponse.json({
                success: false,
                message: "buyer is not found"
            }, {status: 400});
        }

        const buyersAddress = await Address.findById(address, {user: -1});
        console.log('buyers address ---===++__--?? ', buyersAddress);

        if(!buyersAddress){
            return NextResponse.json({
                success: false,
                message: "buyersaddress not found "
            }, {status: 400});
        }

        let supercoinsUsedFromUser = 0;
        if(supercoinsused){
            supercoinsUsedFromUser = buyer?.supercoins > totalAmount ? totalAmount : buyer?.supercoins;
            totalAmount -= buyer.supercoins;
        }

        const currency = "INR";

        const instanceresponse=await instance.orders.create({
            amount: `${totalAmount>0?totalAmount*100:100}`,
            currency,
            receipt: `${Date.now().toString()}`,
        })

        console.log("response of instanceresponse ", instanceresponse);

        if(!instanceresponse){
            return NextResponse.json({
                success: false,
                message: "error at instance response"
            }, {status: 500});
        }

        return NextResponse.json({
            success: true,
            message: "payment captured successfully",
            data: {
                orderid: instanceresponse.id,
                amount: instanceresponse.amount,
                currency: instanceresponse.currency,
                address: buyersAddress,
                supercoinsearnd: supercoinsearned,
                supercoinsused : supercoinsUsedFromUser

            }
        }, {status: 200});

    }catch(error:any){
        console.log("error while capture payment ", error);
        return NextResponse.json({
            success: false,
            message: "error while capture payment"
        }, {status: 500})
    }
}