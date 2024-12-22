import { connect } from "@/config/dbconfig";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import Otp from "@/models/otp";

export async function POST(req: NextRequest){
    try{

        await connect();
        const {email, otp} = await req.json();
        console.log("email and otp ", email, otp);
        if(!email || !otp){
            return NextResponse.json({
                success: false,
                message:"this fields are required"
            }, {status: 404});
        }

        const existingUser = await User.findOne({email:email});
        if(existingUser){
            return NextResponse.json({
                success: false,
                message: "user alrady exist"
            }, {status: 401});
        }

        const recentOtp = await Otp.find({email: email}).sort({createdAt:-1}).limit(1)
        console.log("recent otp ", recentOtp);
        if(recentOtp.length === 0 || Date.now()>recentOtp[0].createdAt+5*60*1000){
            return NextResponse.json({
                success: false,
                message: "otp expired"
            }, {status: 401})
        }else if(otp !== recentOtp[0].otp){
            return NextResponse.json({
                success: false,
                message: "Invalid otp"
            }, {status: 400});
        }

        return NextResponse.json({
            success: true,
            message:"otp verify successfully"
        }, {status:200})

    }catch(error:any){
        console.log("error while verify otp ", error);
        return NextResponse.json({
            success: false,
            message: "error while verify otp"
        }, {status: 500});
    }
}