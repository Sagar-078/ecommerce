import { getuserFromToken } from "@/utils/middleware";
import { NextRequest, NextResponse } from "next/server";
import Address from "@/models/address";

export async function PUT(req: NextRequest){
    try{

        const user = await getuserFromToken(req);

        if(!user){
            return NextResponse.json({
                success: false,
                message: "user not found"
            }, {status: 404});
        }

        const {addressId, fullName, mobileNumber, pincode, locality, address, district, state, landmark, altranativePhoneNo, addressType} =await req.json();
        console.log("all fields are ->>>>", addressId, fullName, mobileNumber, pincode, locality, address, district, state, landmark, altranativePhoneNo, addressType)
        if(!addressId && !fullName && !mobileNumber && !pincode && !locality && !address && !district && !state && !landmark && !altranativePhoneNo && !addressType){
            return NextResponse.json({
                success: false,
                message: "all fields are required"
            }, {status: 402});
        }

        const fieldToUpdate:any = {};

        if(fullName){
            fieldToUpdate.fullName = fullName;
        }
        if(mobileNumber){
            fieldToUpdate.mobileNumber = mobileNumber;
        }
        if(pincode){
            fieldToUpdate.pincode = pincode;
        }
        if(locality){
            fieldToUpdate.locality = locality;
        }
        if(address){
            fieldToUpdate.address = address;
        }
        if(district){
            fieldToUpdate.district = district;
        }
        if(state){
            fieldToUpdate.state = state;
        }
        if(landmark){
            fieldToUpdate.landmark = landmark;
        }
        if(altranativePhoneNo){
            fieldToUpdate.altranativePhoneNo = altranativePhoneNo;
        }
        if(addressType){
            fieldToUpdate.addressType = addressType;
        }

        const upadatedAddress = await Address.findByIdAndUpdate(addressId, fieldToUpdate, {new:true});
        console.log("updated address is ===", upadatedAddress);
        if(!upadatedAddress){
            return NextResponse.json({
                success:false,
                message: "There no any change field"
            }, {status: 403});
        }
        return NextResponse.json({
            success:true,
            message: "Address update successfully"
        }, {status: 200});
    }catch(err:any){
        console.log("error while update address ", err);
        return NextResponse.json({
            success:false,
            message: "error while update address"
        }, {status: 500});
    }
}