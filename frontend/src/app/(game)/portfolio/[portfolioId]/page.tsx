"use client";

import HiloGraph from "@/lib/components/HiloGraph/HiloGraph";
import Input from "@/lib/components/Input";
import PageCard from "@/lib/components/PageCard";
import PieChart from "@/lib/components/PieChart";
import StockModal from "@/lib/components/StockModal";
import Table from "@/lib/components/Table";
import db from "@/lib/firebase/firestore";
import { useWebSocket } from "@/lib/hooks/useWebSocket";
import dayToDate from "@/lib/utils/dayToDate";
import formatDateTime from "@/lib/utils/formatDateime";
import { RiSearch2Line } from "@remixicon/react";
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { use, useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ portfolioId: string }>;
}) {
  const { portfolioId } = use(params);
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [stockData, setStockData] = useState<StockData[] | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [tickers, setTickers] = useState<string[] | null>(null);
  const [marketPrice, setMarketPrice] = useState<number | null>(null);
  const [ticker, setTicker] = useState<string | null>("LULU");
  const [bidPrice, setBidPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  let estimatedCost = null;

  if (
    bidPrice !== undefined &&
    quantity !== undefined &&
    !isNaN(+bidPrice) &&
    !isNaN(+quantity) &&
    Number.isInteger(+quantity)
  ) {
    estimatedCost = +bidPrice * +quantity;
  }

  const { isConnected, isReconnecting, sendMessage } = useWebSocket(
    `ws://127.0.0.1:8000/ws/portfolio/${portfolioId}`,
    {
      onOpen: () => console.log("WebSocket connected"),
      onMessage: (event) => {
        const parsed: StockData[] = JSON.parse(event.data).map((obj: any) => ({
          ...obj,
          period: new Date(obj.x),
        }));

        if (parsed.length > 0) {
          setMarketPrice(parsed[parsed.length - 1].close);
          setBidPrice(parsed[parsed.length - 1].close.toFixed(2));
        }
        setStockData(parsed);
      },
      onClose: () => console.log("WebSocket disconnected"),
      onError: (event) => console.error("WebSocket error:", event),
    }
  );

  useEffect(() => {
    const docRef = doc(db, "level", portfolioId);

    getDoc(docRef).then((document) => {
      const startTimestamp = document.get("startDate") as Timestamp;
      const day = document.get("currentDay") as number;
      const tickers = document.get("tickers") as string[];
      setStartDate(startTimestamp.toDate());
      setDay(day);
      setTickers(tickers);
    });
  }, []);

  useEffect(() => {
    if (isConnected && startDate && day !== null && ticker !== null) {
      sendMessage(
        JSON.stringify({
          start_date: formatDateTime(startDate),
          end_date: formatDateTime(dayToDate(startDate, day)),
          ticker: ticker,
        })
      );
    }
  }, [isConnected, startDate, day, ticker]);

  useEffect(() => {
    if (stockData === null) {
        return;
    }

    setQuantity("");
    setBidPrice(stockData[stockData.length - 1].close.toFixed(2));
  }, [orderType])

  if (
    startDate === null ||
    stockData === null ||
    !isConnected ||
    isReconnecting
  ) {
    return (
      <div className="h-[calc(100vh_-_5.375rem)] py-12 animate-pulse"></div>
    );
  }

  return (
    <>
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
              <div className="w-full grow mt-4">
                <HiloGraph
                  data={stockData!}
                  title={ticker!}
                  titleStyle={{
                    fontWeight: "700",
                    size: "24px",
                    textAlignment: "Near",
                  }}
                />
              </div>
            </div>
          </PageCard>
          <PageCard className="w-[26%] h-auto">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex flex-row">
                <button
                  onClick={() => setOrderType("buy")}
                  className={`flex flex-row hover:cursor-pointer justify-center items-center grow border-b-2 ${
                    orderType == "buy"
                      ? "border-b-[#000000]"
                      : "border-b-[#C5C5C5]"
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setOrderType("sell")}
                  className={`flex flex-row hover:cursor-pointer justify-center items-center grow border-b-2 ${
                    orderType == "sell"
                      ? "border-b-[#000000]"
                      : "border-b-[#C5C5C5]"
                  }`}
                >
                  Sell
                </button>
              </div>
              <form
                className="flex flex-col gap-2"
                onSubmit={(e) => {
                  e.preventDefault();

                  if (estimatedCost !== null && !quantity && !bidPrice) {
                    setModalOpen(true);
                  }
                }}
              >
                <Input
                  prefixContent={<RiSearch2Line size={24} color="#8B8B8B" />}
                  onChange={(e) => {
                    if (tickers && tickers.includes(e.target.value)) {
                      setTicker(e.target.value);
                    }
                  }}
                  placeholder="Browse Tickers"
                />
                <p>
                  Market Price: ${marketPrice === null ? "" : marketPrice}
                </p>
                <Input
                  placeholder="Your bid price"
                  type="number"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                />
                <Input
                  placeholder="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <p>Estimated Cost: ${estimatedCost?.toFixed(2)}</p>
                <button className="bg-accent text-white font-bold text-[20px] w-full py-3 rounded-[20px]">
                  Review Order
                </button>
              </form>
            </div>
          </PageCard>
        </div>
        <div className="flex flex-row gap-5 w-full items-stretch">
          <PageCard className="w-[32%] aspect-square">
            {" "}
            <PieChart />
            <div className="flex flex-col gap-4 p-4">
              <h2 className="font-bold text-xl/tight">Your Diversification</h2>
            </div>
          </PageCard>
          <PageCard className="w-[68%] h-auto">
            <div className="flex flex-col gap-4 p-4">
              <h2 className="font-bold text-xl/tight">Your Assets</h2>
              <div className="w-full h-full">
                <Table />
              </div>
            </div>
          </PageCard>
        </div>
      </div>
      <s>
        <StockModal
          open={modalOpen}
          title={() => {
            if (ticker === null) {
              return;
            }
            return (
              <>
                <span className="capitalize">{orderType}</span> {ticker}?
              </>
            );
          }}
          content={() => {
            return (
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-1">
                  <span className="capitalize">{orderType}</span>{" "}
                  <span>{quantity}</span> shares of <span>{ticker}</span> at
                  <span>${bidPrice}</span>
                  each?
                </div>
              </div>
            );
          }}
          onAction={async () => {
            if (ticker === null || estimatedCost === null) {
              return;
            }
            if (orderType === "buy") {
              const docRef = doc(
                db,
                "level",
                portfolioId,
                "stocks",
                ticker.toUpperCase()
              );
              const snapshot = await getDoc(docRef);
              if (snapshot.exists()) {
                const shares = snapshot.get("shares") as number;
                await updateDoc(docRef, {
                  shares: shares + +quantity,
                });
              } else {
                await setDoc(docRef, {
                  shares: +quantity,
                });
              }
            } else {
              const docRef = doc(
                db,
                "level",
                portfolioId,
                "stocks",
                ticker.toUpperCase()
              );
              const snapshot = await getDoc(docRef);
              if (snapshot.exists()) {
                const shares = snapshot.get("shares") as number;
                await updateDoc(docRef, {
                  shares: shares - +quantity,
                });
              }
            }

            setModalOpen(false);
          }}
          onCancel={() => {
            setModalOpen(false);
          }}
        />
      </s>
    </>
  );
}
