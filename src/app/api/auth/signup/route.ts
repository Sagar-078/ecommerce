import { connect } from "@/config/dbconfig";
import Otp from "@/models/otp";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(req:NextRequest){
    try{

        await connect();

        const {firstName, lastName, email, password, confirmPassword} = await req.json();
        if(!firstName || !lastName || !email || !password || !confirmPassword ){
            return NextResponse.json({
                success: false,
                message: "all fields are required"
            }, {status: 401});
        }

        if(password !== confirmPassword){
            return NextResponse.json({
                success: false,
                message: "password doesn't metch"
            }, {status: 401})
        }

        const existingUser = await User.findOne({email: email});
        if(existingUser){
            return NextResponse.json({
                success: false,
                message: "user alrady exist"
            }, {status: 400})
        }

        // const recentOtp = await Otp.find({email: email}).sort({createdAt:-1}).limit(1)
        // console.log("recent otp ", recentOtp);
        // if(recentOtp.length === 0 || Date.now()>recentOtp[0].createdAt+5*60*1000){
        //     return NextResponse.json({
        //         success: false,
        //         message: "otp expired"
        //     }, {status: 401})
        // }else if(otp !== recentOtp[0].otp){
        //     return NextResponse.json({
        //         success: false,
        //         message: "Invalid otp"
        //     }, {status: 400});
        // }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashPassword,
            profilePhoto: 'https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg'
        })

        return NextResponse.json({
            success: true,
            User:user,
            message:"account created successfully"
        }, {status: 200})

    }catch(error:any){

        console.log("error while signup ", error);
        return NextResponse.json({
            success: false,
            message: "error while signup"
        });
    }
}