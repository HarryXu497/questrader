import Navbar from "@/lib/components/Navbar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="h-full bg-linear-to-b from-[#FFFFFF] via-[#E0FFFE] via-76% to-[#AEFFFE]">
        {children}
      </main>
    </>
  );
}
