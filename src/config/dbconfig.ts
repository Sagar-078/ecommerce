import mongoose from "mongoose";

export async function connect(){
    try{

        await mongoose.connect(process.env.MONGOOSE_URL!);

        console.log("db connected successfully lets go");

        return true;

    }catch(error:any){
        console.log("error while connecting mongoose ", error);
        return false;
    }
}