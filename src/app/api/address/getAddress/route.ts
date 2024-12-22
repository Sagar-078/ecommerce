import { connect } from "@/config/dbconfig";
import Address from "@/models/address";
import { getuserFromToken } from "@/utils/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try{
        const user = await getuserFromToken(req);
        if(!user){
            return NextResponse.json({
                success: false,
                message: "user not found"
            }, {status: 401});
        }

        await connect();

        const getAddress = await Address.find({user: user.id});
        if(!getAddress){
            return NextResponse.json({
                success: false,
                message: "user address not found "
            }, {status: 404});
        }

        return NextResponse.json({
            success: true,
            message: "sucessfully fetched user address",
            Address:getAddress
        }, {status: 200});
    }catch(error:any){
        return NextResponse.json({
            success: false,
            message: "error while get address"
        }, {status: 500});
    }
}