import { connect } from "@/config/dbconfig";
import { getuserFromToken } from "@/utils/middleware";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user"

export async function POST(req: NextRequest){
    try{

        const {firstName, lastName, email, gender, profilePhoto} = await req.json();
        console.log("data at user profile ", firstName, lastName, email, gender, profilePhoto);
        if(!firstName && !lastName && !email && !gender && !profilePhoto){
            return NextResponse.json({
                success: false,
                message: "all fields are required"
            }, {status:401});
        }

        const user = await getuserFromToken(req);
        console.log("user at user profile ", user);
        if(!user){
            return NextResponse.json({
                success: false,
                message: "user not found"
            }, {status: 404});
        }

        await connect();

        let updateField = {};
        if(firstName){
            updateField={...updateField, firstName}
        }
        if(lastName){
            updateField={...updateField, lastName}
        }
        if(email){
            updateField={...updateField, email}
        }
        if(gender){
            updateField={...updateField, gender}
        }
        if(profilePhoto){
            updateField={...updateField, profilePhoto}
        }

        const updatedUser = await User.findByIdAndUpdate(user.id,updateField, {new: true});

        return NextResponse.json({
            success: true,
            message: "user profile update successfully",
            UpdatedUser: updatedUser
        }, {status: 200});

    }catch(err:any){

        console.log("error while update profile ", err);
        
    }
}