"use client";

import Input from "@/lib/components/Input";
import PageCard from "@/lib/components/PageCard";
import { RiSearch2Line } from "@remixicon/react";
import { useState } from "react";

export default function Page() {
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");

  return (
    <div className="flex flex-col gap-5 mx-20 py-8">
      <h1 className="text-6xl font-normal">Portfolio Dashboard</h1>
      <div className="flex flex-row gap-5 w-full items-stretch">
        <PageCard className="w-[74%]">
          <div className="flex flex-col h-full p-4">
            <h2 className="font-bold text-xl/tight">Your Portfolio</h2>
            <div className="flex flex-row justify-between items-center">
              <span className="text-[#8B8B8B] font-bold text-[40px]">
                $10,000.00
              </span>
              <span className="text-[#A7E183] font-semibold text-[30px]">
                +24.1% past month
              </span>
            </div>
            <div className="w-full grow h-[1px] bg-accent"></div>
          </div>
        </PageCard>
        <PageCard className="w-[26%] h-auto">
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-row">
              <button
                onClick={() => setOrderType("buy")}
                className={`flex flex-row hover:cursor-pointer justify-center items-center grow border-b-2 ${
                  orderType == "buy" ? "border-b-[#000000]" : "border-b-[#C5C5C5]"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setOrderType("sell")}
                className={`flex flex-row hover:cursor-pointer justify-center items-center grow border-b-2 ${
                  orderType == "sell" ? "border-b-[#000000]" : "border-b-[#C5C5C5]"
                }`}
              >
                Sell
              </button>
            </div>
            <form className="flex flex-col gap-2">
              <Input
                prefixContent={<RiSearch2Line size={24} color="#8B8B8B" />}
                placeholder="Browse Tickers"
              />
              <p>Market Price: $[ ]</p>
              <Input placeholder="Your bid price: $[ ]" type="number" />
              <Input placeholder="Quantity" type="number" />
              <p>Estimated Cost: $[ ]</p>
              <button className="bg-accent text-white font-bold text-[20px] w-full py-3 rounded-[20px]">
                Review Order
              </button>
            </form>
          </div>
        </PageCard>
      </div>
      <div className="flex flex-row gap-5 w-full items-stretch">
        <PageCard className="w-[32%] aspect-square"> {/* TODO: aspect square is temp  */}
          <div className="flex flex-col gap-4 p-4">
            <h2 className="font-bold text-xl/tight">Your Diversification</h2>
          </div>
        </PageCard>
        <PageCard className="w-[68%] h-auto">
          <div className="flex flex-col gap-4 p-4">
            <h2 className="font-bold text-xl/tight">Something else</h2>
          </div>
        </PageCard>
      </div>
    </div>
  );
}
