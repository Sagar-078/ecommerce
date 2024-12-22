import { connect } from "@/config/dbconfig";
import { getuserFromToken } from "@/utils/middleware";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto'
import User from '@/models/user'
import OrderHistory from "@/models/orderhistry";
import axios from "axios";
import {orderdUrl} from '@/services/sellerUrl'; 


// async function createorderhistory(user:any, buyingProduct:any, paymentid:any, supercoinsused:any, supercoinsearnd:any, amount:any, address:any){
//     console.log("all fields are at create order history --->>> ", user, buyingProduct, paymentid, supercoinsused, supercoinsearnd, amount, address);
//     buyingProduct = buyingProduct.map((product:any)=>{
//         return {...product,status:"Pending",lastupdatedon:Date.now()}
//     })
//     console.log("buying product is ---++???>> ", buyingProduct);
//     const orderhistory=await OrderHistory.create({
//         user:user.id,
//         products:buyingProduct,
//         paymentId:paymentid,
//         supercoinsused:supercoinsused,
//         supercoinsearned:supercoinsearnd,
//         deliveryAddress:address,
//         totalPayment:amount
//     })
//     console.log("order history -->>> ", orderhistory);
//     return orderhistory;
// }


async function createorderhistory(user:any, buyingProduct:any, paymentid:any, supercoinsused:any, supercoinsearnd:any, amount:any, address:any) {
    console.log("Creating order history with data:", {
        user: user.id,
        buyingProduct,
        paymentid,
        supercoinsused,
        supercoinsearnd,
        amount,
        address
    });

    try {
        buyingProduct = buyingProduct.map((product:any) => ({
            ...product,
            status: "Pending",
            lastupdatedon: Date.now()
        }));

        console.log('details before create orderhistory--==>> ', supercoinsearnd, supercoinsused);
        const orderhistory = await OrderHistory.create({
            user: user.id,
            products: buyingProduct,
            paymentId: paymentid,
            supercoinsused,
            supercoinsearned: supercoinsearnd,
            deliveryAddress: address,
            totalPayment: amount
        });

        console.log("Order history created successfully:", orderhistory);
        return orderhistory;
    } catch (error) {
        console.error("Error while creating order history:", error);
        throw new Error("Failed to create order history");
    }
}


export async function POST(req:NextRequest){
    try{

        const {razorpay_payment_id,razorpay_order_id,razorpay_signature, buyingProduct, address, supercoinsused, supercoinsearnd, amount}=await req.json();

        console.log("all fields at razorpay --==??>> ", razorpay_payment_id,razorpay_order_id,razorpay_signature, buyingProduct, address, supercoinsused, supercoinsearnd, amount);

        if(!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !buyingProduct || !address  || !amount ){
            return NextResponse.json({
                Success:false,
                message:"Invalid request"
            },{status:400})
        }

        const user=await getuserFromToken(req);

        if(!user){
            return NextResponse.json({
                Success:false,
                message:"User not found"
            },{status:404})
        }

        await connect();

        // This line uses the Node.js crypto library to create an HMAC (Hash-based Message Authentication Code) using the SHA-256 hashing algorithm.

        let body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAYKEY_SECRET!)
            .update(body.toString())
            .digest("hex");
            if(expectedSignature !== razorpay_signature) {
                return NextResponse.json({
                Success:false,
                message:"Unauthorized payment request"
            },{status:400})

        }

        const myuser = await User.findByIdAndUpdate(user.id,{$inc:{supercoins:-supercoinsused}});
        const myUser = await User.findByIdAndUpdate(user.id, {$inc: {supercoins: supercoinsearnd}});

        if(!myuser || !myUser){
            return NextResponse.json({
                Success:false,
                message:"Something went wrong while creating order"
            },{status:500})
        }

        let sellerdata=[];

        for(let i=0; i<buyingProduct.length; i++){
            const currentproduct= buyingProduct[i];
            console.log("current product at loop ..??..>> ", currentproduct);
            // currentproduct.supercoinsearnd = Math.floor(sellPrice * 0.02 >= 200 ? 200 : sellPrice * 0.02) * quantity;
            currentproduct.supercoinsearnd=(Math.floor(currentproduct.sellPrice*0.02)>=200?200:Math.floor(currentproduct.sellPrice*0.02))*currentproduct.quantity;
            console.log("super coin earned on current product ---===::>>:: ", supercoinsearnd);
            console.log("super coin earned on current product 2 ---===::>>:: ", currentproduct.supercoinsearnd);
            const supercoinsusedinthis=Math.floor(((supercoinsused/100)/((amount+supercoinsused)/100))*currentproduct.sellPrice*currentproduct.quantity);
            console.log("super coin used on this product ---====:::>>>::: ", supercoinsusedinthis);
            currentproduct.supercoinsused=supercoinsusedinthis;
            console.log("super coin used on this product 2 ---====:::>>>::: ", currentproduct.supercoinsused);
            sellerdata.push({
                sellerOfProductId:currentproduct.seller._id,
                sellPrice:currentproduct.sellPrice,
                originalprice:currentproduct.originalPrice,
                ordedProductId:currentproduct._id,
                quantity:currentproduct.quantity,
                deliveryAddress:address,
                customerEmail:myuser.email,
                customerName:myuser.firstName+" "+myuser.lastName,
                // clientOrderId: myuser._id
            })
    
        }

        // sellerid:currentproduct.seller._id,
        //         sellprice:currentproduct.sellprice,
        //         originalprice:currentproduct.originalprice,
        //         productid:currentproduct._id,
        //         quantity:currentproduct.quantity,
        //         deliveryadress:address,
        //         customeremail:myuser.email,
        //         customername:myuser.firstname+" "+myuser.lastname,

        console.log("seller data at verify payment route ---:::??>>", sellerdata);
        console.log("super coin earned and super coin used before create order history :::>>> ", supercoinsearnd, supercoinsused);
        console.log("buying product before call create order history --???::>>> ", buyingProduct);
        const orderhistory=await createorderhistory(user, buyingProduct, razorpay_payment_id, supercoinsused, supercoinsearnd, amount, address);
        console.log("order history after create order history --===>>> ", orderhistory);
        if(!orderhistory){
            return NextResponse.json({
                Success:false,
                message:"Something went wrong while creating order"
            }, {status: 400})
        }

        sellerdata = sellerdata.map((data:any) => {
            return {...data, clientOrderId: orderhistory._id}
        })
        console.log("seller data before create order history in seller ---++???>>> ", sellerdata);
        const response = await axios.post(orderdUrl.createOrderinseller, {data: sellerdata});
        console.log("response of create order in seller ---===+++>>> ", response);
        if(!response.data.success){
            return NextResponse.json({
                success: false,
                message: "something error while creating order"
            }, {status: 500});
        }

        return NextResponse.json({
            success: true,
            message: "order created successfully",
            supercoinsearnd: supercoinsearnd
        }, {status: 200});

    }catch(error:any){
        console.log("error while verify payment ", error);
        return NextResponse.json({
            success: false,
            message: "error while creating order"
        }, {status: 500});
    }
}