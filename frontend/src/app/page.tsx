import Navbar from "@/lib/components/Navbar";
import auth from "@/lib/firebase/auth";
import Image from "next/image";

export default function Home() {
    auth
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="h-[calc(100vh_-_5.375rem)] bg-linear-to-b from-[#FFFFFF] via-[#E0FFFE] via-76% to-[#AEFFFE]">
            <div className="h-full flex flex-col m-auto items-center justify-center pb-12 gap-4">
                <Image
                  width={600}
                  height={144}
                  src="/images/logo.svg"
                  alt="Questrader"
                />
                <p className="text-[20px] font-extralight">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
      </main>
    </>
  );
}
