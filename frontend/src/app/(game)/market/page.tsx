"use client";

import Card from "@/lib/components/Card";
import HiloOpenClose from "@/lib/components/HiloGraph/HiloGraph";
import Input from "@/lib/components/Input";
import PageCard from "@/lib/components/PageCard";
import db from "@/lib/firebase/firestore";
import { useWebSocket } from "@/lib/hooks/useWebSocket";
import dayToDate from "@/lib/utils/dayToDate";
import formatDateTime from "@/lib/utils/formatDateime";
import { RiSearch2Line } from "@remixicon/react";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Page() {
  const startDate = new Date(2024, 0, 1);
  const [stockData, setStockData] = useState<StockData[] | null>(null);
  const [ticker, setTicker] = useState<string>("AAPL");
  const [tickers, setTickers] = useState<string[] | null>(null);
  useEffect(() => {
    const docRef = doc(db, "level", "1");

    getDoc(docRef).then((document) => {
      const tickers = document.get("tickers") as string[];

      setTickers(tickers);
    });
  }, []);

  const { isConnected, isReconnecting, sendMessage } = useWebSocket(
    "ws://127.0.0.1:8000/ws/market",
    {
      onOpen: () => console.log("WebSocket connected"),
      onMessage: (event) => {
        const parsed: StockData[] = JSON.parse(event.data).map((obj: any) => ({
          ...obj,
          period: new Date(obj.x),
        }));
        setStockData(parsed);
      },
      onClose: () => console.log("WebSocket disconnected"),
      onError: (event) => console.error("WebSocket error:", event),
    }
  );

  useEffect(() => {
    if (isConnected) {
      sendMessage(
        JSON.stringify({
          start_date: formatDateTime(startDate),
          end_date: formatDateTime(new Date(Date.now())),
          ticker: ticker,
        })
      );
    }
  }, [isConnected, ticker]);

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
    <div className="h-[calc(100vh_-_5.375rem)] py-12">
      <section className="max-w-[72rem] min-w-[16rem] w-[80%] mx-auto h-full flex flex-row gap-5">
        <div className="h-full w-[68%]">
          <PageCard className="h-full">
            <HiloOpenClose data={stockData!} title={ticker!} />
          </PageCard>
        </div>
        <div className="h-full flex flex-col gap-5 w-[32%]">
          <Card className="overflow-visible">
            <div className="bg-white border-accent border-1 px-4 py-3 rounded-[20px] gap-4 flex flex-col justify-between">
              <Input
                prefixContent={<RiSearch2Line size={24} color="#8B8B8B" />}
                onChange={(e) => {
                  if (tickers && tickers.includes(e.target.value)) {
                    setTicker(e.target.value);
                  }
                }}
                placeholder="Browse Tickers"
              />
            </div>
          </Card>
          <PageCard>
            <div className="flex flex-col justify-start gap-4 grow-1 h-full overflow-scroll"></div>
          </PageCard>
        </div>
      </section>
    </div>
  );
}
