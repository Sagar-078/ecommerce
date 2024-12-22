import { connect } from "@/config/dbconfig";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req:NextRequest){
    try{

        const {email, password} = await req.json();
        if(!email || !password){
            return NextResponse.json({
                success: false,
                message: "all field required"
            }, {status: 401});
        }

        await connect();

        const user = await User.findOne({email:email});
        if(!user){
            return NextResponse.json({
                success: false,
                message: 'user not registered'
            }, {status: 401});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return NextResponse.json({
                success: false,
                message: "invalid password"
            }, {status: 403});
        }

        const payload = {
            email: user.email,
            id: user._id
        }
        const token = jwt.sign(payload, process.env.JWT_SECREAT!, {expiresIn: "30d"});

        const response = NextResponse.json({
            success: true,
            message: "Login successfully",
            Token: token,
            User: user
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: true
        });

        return response;

    }catch(err:any){
        console.log("error while login ", err);
        return NextResponse.json({
            success: false,
            message: "error while login"
        }, {status: 500});
    }
}