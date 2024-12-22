import { connect } from "@/config/dbconfig";
import Address from "@/models/address";
import { getuserFromToken } from "@/utils/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{

        const user = await getuserFromToken(req);
        console.log("user ", user);

        if(!user){
            return NextResponse.json({
                success: false,
                message: "user not found"
            }, {status: 401});
        }

        const {userAddressId} = await req.json();
        console.log("user address id ", userAddressId);
        await connect();

        /// find previous default address and make this false default address 
        await Address.findOneAndUpdate({user:user.id, defaultAddress:true}, {defaultAddress: false});
        // find address id and make this default;
        const newDefaultAddress = await Address.findByIdAndUpdate(userAddressId, {defaultAddress: true});

        console.log("new default address ", newDefaultAddress);
        return NextResponse.json({
            success: true,
            message: "successfully make default address",
            newDefaultAddress: newDefaultAddress
        }, {status: 200});

    }catch(error:any){
        return NextResponse.json({
            success: false,
            message: "error while make default address"
        }, {status: 500});
    }
}