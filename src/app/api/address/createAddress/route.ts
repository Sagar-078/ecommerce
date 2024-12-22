import { getuserFromToken } from "@/utils/middleware";
import { NextRequest, NextResponse } from "next/server";
import Address from "@/models/address";
import User from "@/models/user";

export async function POST(req:NextRequest){
    try{
        const user = await getuserFromToken(req);
        console.log("user at create addr ", user);
        if(!user){
            return NextResponse.json({
                success: false,
                message: "user not found"
            }, {status: 401});
        }

        const {fullName, mobileNumber, pincode, locality, address, district, state, landmark, altranativePhoneNo, addressType} =await req.json();
        console.log("data is ", fullName, mobileNumber, pincode, locality, address, district, state, landmark, altranativePhoneNo, addressType);

        if(!fullName || !mobileNumber || !pincode || !locality || !address || !district || !state || !landmark || !altranativePhoneNo || !addressType){
            return NextResponse.json({
                success: false,
                message: "all fields are required"
            }, {status: 403});
        }

        const existAddress = await Address.find({user: user.id});
        console.log("exist address ", existAddress);

        const isSameAddressDetails = existAddress.find((addrDetails) => 
            addrDetails.fullName === fullName && addrDetails.mobileNumber === mobileNumber &&
            addrDetails.pincode === pincode && addrDetails.locality === locality && 
            addrDetails.address === address && addrDetails.district === district && 
            addrDetails.state === state && addrDetails.landmark === landmark && 
            addrDetails.altranativePhoneNo === altranativePhoneNo &&
            addrDetails.addressType === addressType
        );

        if(isSameAddressDetails){
            return NextResponse.json({
                success: false,
                message: "Existing address"
            }, {status: 401});
        }

        const newAddress = await Address.create({
            user: user.id,
            fullName, 
            mobileNumber,
            pincode,
            locality,
            address,
            district,
            state,
            landmark,
            altranativePhoneNo:altranativePhoneNo?altranativePhoneNo:"",
            addressType:addressType?addressType:""
        });
        
        console.log("new address ", newAddress);

        await User.findByIdAndUpdate(user.id, {$push:{addresses:address._id}});

        return NextResponse.json({
            success: true,
            message: "successfully created address",
            NewAddress: newAddress
        }, {status: 200});

    }catch(error:any){
        return NextResponse.json({
            success: false,
            message: "error while create address"
        }, {status: 500});
    }
}