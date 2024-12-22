"use client"
import DashboardSidebar from "@/components/DashboardSidebar";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux"

export default function dashboardLayout({children} : {children: React.ReactNode} ){

    const {user} = useSelector((state:RootState) => state.authUser);
    console.log("user at layout ", user);

    return(
        <div className="flex w-full h-[95vh] gap-5 mx-auto justify-center mt-4">
            <div className="w-[20%] ">
                <DashboardSidebar user={user}/>
            </div>
            <main className="w-[70%] h-full bg-white">
                {children}
            </main>
        </div>
    )
}