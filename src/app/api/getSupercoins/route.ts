import { connect } from "@/config/dbconfig";
import { getuserFromToken } from "@/utils/middleware";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

export async function GET(req:NextRequest){
    try{

        const user = await getuserFromToken(req);
        if(!user){
            return NextResponse.json({
                success: false,
                message: "user not found"
            }, {status: 401})
        }

        await connect();
        
        const userDetails = await User.findById(user.id);
        console.log("user details at getsuper coin ", userDetails);
        if(!userDetails){
            return NextResponse.json({
                success: false,
                message: "user details not found"
            }, {status: 403});
        }

        return NextResponse.json({
            success: true,
            message: "successfully get super coins",
            superCoins: userDetails
        }, {status: 200});

    }catch(error:any){
        console.log("error while get super coins ", error);
        return NextResponse.json({
            success: false,
            message: "successfully get super coins"
        }, {status: 500});
    }
}