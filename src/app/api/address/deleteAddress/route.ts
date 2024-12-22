import { connect } from "@/config/dbconfig";
import Address from "@/models/address";
import { getuserFromToken } from "@/utils/middleware";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

export async function DELETE(req:NextRequest){
    try{
        const user = await getuserFromToken(req);
        if(!user){
            return NextResponse.json({
                success:false,
                message:"user not found"
            }, {status: 404});
        }
        
        const {addressId} = await req.json();
        console.log("address id at route ===???", addressId);

        if(!addressId){
            return NextResponse.json({
                success: false,
                message: "address id required"
            }, {status: 403});
        }

        await connect();
        const deleteAddress = await Address.findByIdAndDelete({_id:addressId});

        console.log("delete address ", deleteAddress);

        await User.findByIdAndUpdate(user.id, {$pull:{addresses:deleteAddress._id}});

        if(!deleteAddress){
            return NextResponse.json({
                success:false,
                message: "successfully delete address"
            },{status: 403});
        }

        return NextResponse.json({
            success: true,
            message: "delete address successfully",
            DeletedAdderss: deleteAddress
        })
    }catch(error:any){
        return NextResponse.json({
            success: false,
            message: "error while delete address"
        },{status:401});
    }
}