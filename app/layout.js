import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
// import DynamicTitle from "@/app/components/DynamicTitle";

import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://py-cash.online"),
  title: "Pay Emily on Cash App",
  description: "Pay Emily on Cash App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <>
          {/* <DynamicTitle /> */}
          {children}
          <ToastContainer />
        </>
      </body>
    </html>
  );
}
