import { connect } from "@/config/dbconfig";
import Orderhistry from "@/models/orderhistry";
import { getuserFromToken } from "@/utils/middleware";
import { NextRequest, NextResponse } from "next/server";

////
export async function GET(req:NextRequest){
    try{

        const user = await getuserFromToken(req);

        if(!user){
            return NextResponse.json({
                success: false,
                message: "user not found"
            }, {status: 401});
        }

        await connect();

        const orderhistory = await Orderhistry.find({user:user.id}, {products:1}).sort(
            {createdAt:1}
        );

        console.log("order history ", orderhistory);

        return NextResponse.json({
            success: true,
            message: "successfully get order histry",
            OrderHistory: orderhistory
        }, {status: 200});

    }catch(error:any){

        console.log("error whille get order history ", error);

        return NextResponse.json({
            success: false,
            message: "error while get order history"
        }, {status: 500});

    }
}