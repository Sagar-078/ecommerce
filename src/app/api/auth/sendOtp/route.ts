import { connect } from "@/config/dbconfig";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import otpGenerater from "otp-generator";
import Otp from "@/models/otp";

export async function POST(req: NextRequest){

    try{
        const {email} = await req.json();
        if(!email) {
            return NextResponse.json({
                success: false,
                message: "email is not found"
            }, {status: 404});
        }

        await connect();

        const userFound = await User.findOne({email:email});
        if(userFound){
            return NextResponse.json({
                success: false,
                message: "user alrady exist"
            }, {status: 404});
        }

        const otp = otpGenerater.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        console.log("otp at generate otp ", otp);
        await Otp.create({'email':email, 'otp': otp});

        return NextResponse.json({
            success: true,
            message: "otp sent successfully check your email",
            otp
        }, {status: 200});
    }catch(error: any){
        console.log("error while otp sent", error);
        return NextResponse.json({
            success: false,
            message: "error while sent otp"
        }, {status: 500});
    }
}