import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Providers } from "@/redux/provider/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ECOMMERCE",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={inter.className}>
          <Providers>
            <div className="bg-slate-200 w-[100vw]">
              <Navbar/>
              <div className="">
                <main>
                  <ToastContainer/>
                  {children}
                </main>
                <Footer/>
              </div>
            </div>
          </Providers>
        </body>
    </html>
  );
}
