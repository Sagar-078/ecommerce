import { connect } from "@/config/dbconfig";
import Orderhistry from "@/models/orderhistry";
import OrderHistry from "@/models/orderhistry";
import { orderdUrl } from "@/services/sellerUrl";
import { getuserFromToken } from "@/utils/middleware";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import User from '@/models/user';

////
export async function GET(req: NextRequest){
    try{

        const orderid=req.nextUrl.pathname.split("/")[4];
        console.log("order id is ---===:::>>> ", orderid);

        if(!orderid){
            return NextResponse.json({
                success: false,
                message:"orderid is required"
            }, {status: 401});
        }

        const user = await getuserFromToken(req);

        if(!user){
            return NextResponse.json({
                success: false,
                message: "user not found"
            }, {status: 404});
        }
        await connect();
        const orderDetail = await Orderhistry.findOne({_id:orderid, user: user.id});

        if(!orderDetail){
            return NextResponse.json({
                success: false,
                message: "order details not found "
            }, {status: 404});
        }

        if(orderDetail){
            return NextResponse.json({
                success: true,
                message: "order details successfully fetched",
                OrderDetails: orderDetail
            }, {status: 200});
        }

    }catch(error:any){
        console.log("error while get order detils --==>> ", error);
        return NextResponse.json({
            success: false,
            message: "error while get order details "
        }, {status: 500});
    }
}

///
export async function PUT(req:NextRequest){
    try{

        const orderid=req.nextUrl.pathname.split("/")[4];
        const {productid} = await req.json();
        console.log("order id and product id on this api ---==>> ", orderid, productid);
        if(!orderid || !productid){
            return NextResponse.json({
                success: false,
                message: "these fields are required"
            }, {status: 403});
        }

        const user = await getuserFromToken(req);
        console.log("user at cancel order token --==>> ", user);
        if(!user){
            return NextResponse.json({
                success: false,
                message: "user not found"
            }, {status: 401});
        }

        const response = await axios.post(orderdUrl.cancelOrder, {orderId: orderid, productId: productid});

        console.log("response of cancel order ", response);

        if(response.status !== 200){
            return NextResponse.json({
                success: false,
                message: "error while cancel order"
            }, {status: 402});
        }

        await connect();
        const orderHistory = await OrderHistry.findOneAndUpdate({"_id": orderid, "products._id": productid}, 
            {$set: {
                "products.$.status": "cancelled",
                "products.$.lastupdatedon": new Date().toISOString(),
            }}
        ) 
        console.log("order history is ---->>> ", orderHistory);

        const deleteProduct = orderHistory.products.find((data:any) => data.get('_id') === productid);
        console.log('delete Product is --->=>> ', deleteProduct);
        await User.updateOne({_id:user.id},{$inc:{supercoins:(deleteProduct.get('supercoinsused'))}});
        // await User.updateOne({_id:user.id},{$inc: {supercoins:(-deleteProduct.get('supercoinsearnd'))}});

        return NextResponse.json({
            success: true,
            message: "successfully cancel order"
        }, {status: 200});

    }catch(error:any){
        console.log("error while cancel order ", error);
        return NextResponse.json({
            success: false,
            message: "error while cancel order"
        }, {status: 500});
    }
}
