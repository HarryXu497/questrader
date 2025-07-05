"use client";

import Button from "@/lib/components/Button";
import Card from "@/lib/components/Card";
import FeedCard from "@/lib/components/FeedCard";
import HiloOpenClose from "@/lib/components/HiloGraph/HiloGraph";
import PageCard from "@/lib/components/PageCard";
import StockModal from "@/lib/components/StockModal";
import db from "@/lib/firebase/firestore";
import dateFormatter from "@/lib/utils/dateFormatter";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { use, useEffect, useRef, useState } from "react";

function dayToDate(startDate: Date, day: number) {
  return new Date(new Date(startDate).setDate(startDate.getDate() + day));
}

export default function Page({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = use(params);
  const [startDate, setStartDate] = useState<null | Date>(null);
  const [endDate, setEndDate] = useState<null | Date>(null);
  const [day, setDay] = useState(0);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [articles, setArticles] = useState<Article[] | null>([]);
  const [pushedArticles, setPushedArticles] = useState<Article[]>([]);
  const [stockOrder, setStockOrder] = useState<StockOrder | null>(null);

const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const collectionRef = collection(db, "level", levelId, "articles");

    getDocs(query(collectionRef, orderBy("day")))
      .then((snapshot) => snapshot.docs)
      .then((documents) =>
        documents.map(
          (document) =>
            ({
              id: document.id,
              title: document.get("title"),
              content: document.get("content"),
              day: document.get("day"),
              location: document.get("location"),
            } as Article)
        )
      )
      .then(setArticles);
  }, [startDate, day]);

  useEffect(() => {
    const docRef = doc(db, "level", levelId);

    getDoc(docRef).then((document) => {
      const startTimestamp = document.get("startDate") as Timestamp;
      const endTimestamp = document.get("endDate") as Timestamp;
      setStartDate(startTimestamp.toDate());
      setEndDate(endTimestamp.toDate())
    });
  }, []);

  useEffect(() => {
    if (!articles) {
      return;
    }

    if (currentArticleIndex >= articles.length) {
      return; // TODO idk maybe do something
    }

    let index = currentArticleIndex;
    const toBePushed: Article[] = [];

    while (index < articles.length && day >= articles[index].day) {
      const currentArticle = articles[index];
      toBePushed.unshift(currentArticle);

      index++;
    }

    setPushedArticles((currentArticles) => [...toBePushed, ...currentArticles]);
    setCurrentArticleIndex(index);
  }, [day, articles, currentArticleIndex]);

  useEffect(() => {
    timeoutRef.current = setInterval(() => setDay((d) => d + 7), 2000);

    return () => {
        if (timeoutRef.current) {
            clearInterval(timeoutRef.current)
        }
    };
  }, []);

  useEffect(() => {
    if (timeoutRef.current && startDate && endDate) {
        const currDate = dayToDate(startDate, day);

        if (currDate >= endDate) {
            clearInterval(timeoutRef.current);
            timeoutRef.current = null;
        }
    }
  }, [startDate, day, endDate])


  if (startDate == null) {
    // TODO: loading page
    return (
      <div className="h-[calc(100vh_-_5.125rem)] py-12 animate-pulse">
        <section className="max-w-[72rem] min-w-[16rem] w-[80%] mx-auto h-full flex flex-row gap-5">
          <div className="h-full w-[68%]">
            <PageCard>
                <div></div>
            </PageCard>
          </div>
          <div className="h-full flex flex-col gap-5 w-[32%]">
            <Card className="overflow-visible">
              <div className="bg-white border-accent border-1 p-4 rounded-[20px]">
                <h2 className="font-bold text-gray-900 text-2xl">
                  <div className="h-8 rounded-[20px] bg-gray-200"></div>
                </h2>
              </div>
            </Card>
            <div className="grow"></div>
            <div className="flex flex-row justify-between">
              <Button
                onClick={() => {
                  setStockOrder({
                    ticker: "AAPL", // TODO: fix
                    price: 0,
                    units: 0,
                    type: "buy",
                  });
                }}
              >
                Buy
              </Button>
              <Button
                onClick={() => {
                  setStockOrder({
                    ticker: "AAPL", // TODO: fix
                    price: 0,
                    units: 0,
                    type: "sell",
                  });
                }}
              >
                Sell
              </Button>
              <Button onClick={() => {}}>Hold</Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const currentDate = dayToDate(startDate, day);
  const formattedDate = dateFormatter.format(currentDate);

  return (
    <>
      <div className="h-[calc(100vh_-_5.125rem)] py-12">
        <section className="max-w-[72rem] min-w-[16rem] w-[80%] mx-auto h-full flex flex-row gap-5">
          <div className="h-full w-[68%]">
            <PageCard>
              <HiloOpenClose />
            </PageCard>
          </div>
          <div className="h-full flex flex-col gap-5 w-[32%]">
            <Card className="overflow-visible">
              <div className="bg-white border-accent border-1 p-4 rounded-[20px]">
                <h2 className="font-bold text-gray-900 text-2xl">
                  {formattedDate}
                </h2>
              </div>
            </Card>
            <div className="flex flex-col gap-4 grow-1 h-full overflow-scroll">
                {pushedArticles.map((article) => (
                  <div key={article.id} className="animate-pop-in">
                    <FeedCard
                      article={article}
                      date={dayToDate(startDate, article.day)}
                    />
                  </div>
                ))}
            </div>
            <div className="flex flex-row justify-between">
              <Button
                onClick={() => {
                  setStockOrder({
                    ticker: "AAPL", // TODO: fix
                    price: 0,
                    units: 0,
                    type: "buy",
                  });
                }}
              >
                Buy
              </Button>
              <Button
                onClick={() => {
                  setStockOrder({
                    ticker: "AAPL", // TODO: fix
                    price: 0,
                    units: 0,
                    type: "sell",
                  });
                }}
              >
                Sell
              </Button>
              <Button onClick={() => {}}>Hold</Button>
            </div>
          </div>
        </section>
      </div>
      <StockModal
        open={stockOrder != null}
        title={() => {
          if (stockOrder == null) {
            return;
          }

          return (
            <>
              <span className="capitalize">{stockOrder.type}</span>{" "}
              {stockOrder.ticker}?
            </>
          );
        }}
        content={() => {
          if (stockOrder == null) {
            return;
          }

          return (
            <>
              <span className="capitalize">{stockOrder.type}</span>{" "}
              {stockOrder.units} shares of {stockOrder.ticker} at{" "}
              {stockOrder.price} each?
            </>
          );
        }}
        onAction={() => {
          // TODO: hook to firebase
        }}
        onCancel={() => {
          setStockOrder(null);
        }}
      />
    </>
  );
}
