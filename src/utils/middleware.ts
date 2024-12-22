import { NextRequest } from "next/server";
import JWT from "jsonwebtoken";

export const getuserFromToken = async(req:NextRequest) => {
    try{
        let token = req.headers.get("Authorization")?.replace("Bearer ", "") || req.cookies.get('token')?.value;

        console.log("token at middleware ", token);
        if(token){
            const decodedToken:any = JWT.verify(token, process.env.JWT_SECREAT!);
            return decodedToken;
        }else{
            return null;
        }

    }catch(error:any){
        console.log("error while middleware ", error);
    }
}