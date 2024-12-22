import mongoose from "mongoose";
import { NextResponse } from "next/server";
import {otpTemplate} from "@/templates/verificationemail";
import {mailsender} from "@/utils/mailSender"

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    otp: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 60*5
    }

});

    async function sendVerificationEmail(email:any, otp:any){
        try{

            console.log("mail sender function ", mailsender);
            const mailResponse = await mailsender(email, 
                'Verification email from Flipkart',
                otpTemplate(otp)
            )

            console.log("otp sent successfully ", mailResponse);

        }catch(error:any){
            console.log("error while send verification email ", error);
            NextResponse.json({
                success:false,
                message: "error while send verification email"
            }, {status: 500});
        }
    }

    otpSchema.pre("save", async function(next){
        if(this.isNew){
            await sendVerificationEmail(this.email, this.otp);
        }

        next();

    })

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);