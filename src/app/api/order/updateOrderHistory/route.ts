import { connect } from "@/config/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import OrderHistry from "@/models/orderhistry";

export async function POST(req:NextRequest){
    try{
        console.log("called ------->>>>>>......................");
        const {orderId, productId, status} = await req.json();
        console.log('details at update order history --==>>> ', orderId, productId, status);
        
        if(!orderId || !productId || !status){
            return NextResponse.json({
                success: false,
                message: "all fields are required"
            }, {status: 401});
        }

        await connect();

        // const orderhistory = await Orderhistry.findOneAndUpdate({
        //     "_id": orderId, "products._id": productId
        // })

        // if(!orderhistory){
        //     return NextResponse.json({
        //         success: false,
        //         message: "updated order not found"
        //     }, {status: 403});
        // }

        // const product = orderhistory.products.find((product:any) => 
        //     product._id.toString() === productId
        // );

        // if(!product){
        //     return NextResponse.json({
        //         success: false,
        //         message: "product not found in order"
        //     }, {status: 400});
        // }

        // product.status = status;

        // await orderhistory.save();

        // const updateFields = {
        //     "products.$.lastupdatedon": new Date().toISOString(),
        // };
      
        // await Orderhistry.updateOne(
        //     { "_id": orderId, "products._id": productId },
        //     { $set: updateFields }
        // );
      
        //   // If status is "delivered", update user's supercoins
        // if (status === "delivered") {
        //     await User.findOneAndUpdate(
        //         { _id: orderhistory.user },
        //         { $inc: { supercoins: product.supercoinsearned } }
        //     );
        // }

        const orderHistory = await OrderHistry.findOneAndUpdate({"_id": orderId, "products._id": productId}, 
            {$set: {
                "products.$.status": status,
                "products.$.lastupdatedon": new Date().toISOString(),
            }}
        ) 

        console.log("order history is --===>>>> ", orderHistory);
        if(!orderHistory){
            return NextResponse.json({
                success: false,
                message: "order history not update"
            }, {status: 403});
        }

        if(status === 'delivered'){
            const updatedProduct = orderHistory.products.find((data:any) => data.get('_id') === productId);
            console.log('updated product --===>> ', updatedProduct);
            console.log("order history user --==>> ", orderHistory.user);
            await User.findOneAndUpdate({_id: orderHistory.user}, {$inc:{supercoins:updatedProduct.get('supercoinsearnd')}});
        }

        return NextResponse.json({
            Success: true,
            Message: "Order status updated successfully"
        }, { status: 200 });

    }catch(err:any){
        console.log("error while order update", err);
        return NextResponse.json({
            success: false,
            message: "error while order update"
        }, {status: 500});
    }
}