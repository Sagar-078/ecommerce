import { NextResponse } from "next/server";


export async function GET(){
    try{
        const response = await NextResponse.json({
            message: "Logout handler",
            success: true
        }, {status: 200});
        response.cookies.set("token", "", {httpOnly: true, expires: new Date(0)});

        return response;
    }catch(err:any){
        console.log('error while logout ', err);
        return NextResponse.json({
            success: false,
            message: "logout successfully"
        }, {status: 500});
    }
}