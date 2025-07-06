"use client";

import Button from "@/lib/components/Button";
import Card from "@/lib/components/Card";
import FeedCard from "@/lib/components/FeedCard";
import HiloOpenClose from "@/lib/components/HiloGraph/HiloGraph";
import Modal from "@/lib/components/Modal";
import PageCard from "@/lib/components/PageCard";
import StockModal from "@/lib/components/StockModal";
import db from "@/lib/firebase/firestore";
import { useWebSocket } from "@/lib/hooks/useWebSocket";
import dateFormatter from "@/lib/utils/dateFormatter";
import { RiPauseLine, RiPlayLine } from "@remixicon/react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { use, useEffect, useRef, useState } from "react";

function dayToDate(startDate: Date, day: number) {
  return new Date(new Date(startDate).setDate(startDate.getDate() + day));
}

const yearFormatter = new Intl.DateTimeFormat('en', { year: 'numeric' });
const monthFormatter = new Intl.DateTimeFormat('en', { month: '2-digit' });
const dayFormatter = new Intl.DateTimeFormat('en', { day: '2-digit' });

function formatDateTime(date: Date) {
    let year = yearFormatter.format(date);
    let month = monthFormatter.format(date);
    let day = dayFormatter.format(date);
    return `${day}-${month}-${year}:T00:00:00Z`;
}


export default function Page({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = use(params);
  const isTutorial = levelId === "1";
  const [tutorialState, setTutorialState] = useState<number | null>(
    isTutorial ? 0 : null
  );
  const [amount, setAmount] = useState<number | null>();
  const [startDate, setStartDate] = useState<null | Date>(null);
  const [endDate, setEndDate] = useState<null | Date>(null);
  const [day, setDay] = useState(0);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [articles, setArticles] = useState<Article[] | null>([]);
  const [pushedArticles, setPushedArticles] = useState<Article[]>([]);
  const [stockOrder, setStockOrder] = useState<StockOrder | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(tutorialState !== null);
  const [decisionPending, setDecisionPending] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const [stockData, setStockData] = useState<StockData[] | null>(null);

  const { isConnected, isReconnecting, sendMessage } = useWebSocket(
    `ws://127.0.0.1:8000/ws/learn/${levelId}`,
    {
      onOpen: () => console.log("WebSocket connected"),
      onMessage: (event) => {
        console.log("Received message:", event.data);
        setStockData(event.data);
      },
      onClose: () => console.log("WebSocket disconnected"),
      onError: (event) => console.error("WebSocket error:", event),
    }
  );

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
              pause: document.get("pause"),
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
      const amount = document.get("startingAmount") as number;
      setStartDate(startTimestamp.toDate());
      setEndDate(endTimestamp.toDate());
      setAmount(amount);
    });
  }, []);

  useEffect(() => {
    const stocks = collection(db, "level", levelId, "stocks");

    getDocs(stocks)
      .then((snapshots) => snapshots.docs)
      .then((documents) => documents.map((document) => document.ref))
      .then((references) => references.map(deleteDoc));
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

      if (currentArticle.pause) {
        setDecisionPending(true);
      }

      index++;
    }

    setPushedArticles((currentArticles) => [...toBePushed, ...currentArticles]);
    setCurrentArticleIndex(index);
  }, [day, articles, currentArticleIndex]);

  useEffect(() => {
    timeoutRef.current = setInterval(() => {
      if (!isPaused && !decisionPending) {
        setDay((d) => d + 7);
      }
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isPaused, decisionPending]);

  useEffect(() => {
    if (startDate && endDate) {
      sendMessage(
        JSON.stringify({
          start_date: formatDateTime(startDate),
          end_date: formatDateTime(endDate),
          ticker: "AAPL", // TODO: make dynamic
        }) 
      );
    }
  }, [startDate, day]);

  useEffect(() => {
    if (timeoutRef.current && startDate && endDate) {
      const currDate = dayToDate(startDate, day);

      if (currDate >= endDate) {
        clearInterval(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [startDate, day, endDate]);

  if (startDate === null && isTutorial) {
    return (
      <div className="h-[calc(100vh_-_5.375rem)] py-12 animate-pulse"></div>
    );
  }

  if (startDate === null) {
    // TODO: loading page
    return (
      <div className="h-[calc(100vh_-_5.375rem)] py-12 animate-pulse">
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
            <PageCard>
              <div className="grow"></div>
            </PageCard>
            <div className="flex flex-row justify-between">
              <PageCard>
                <Button
                  onClick={() => {
                    setStockOrder({
                      ticker: "AAPL", // TODO: fix
                      price: 1,
                      units: "",
                      type: "buy",
                    });
                  }}
                >
                  Buy
                </Button>
              </PageCard>
              <PageCard>
                <Button
                  onClick={() => {
                    setStockOrder({
                      ticker: "AAPL", // TODO: fix
                      price: 1,
                      units: "",
                      type: "sell",
                    });
                  }}
                >
                  Sell
                </Button>
              </PageCard>
              <PageCard>
                <Button onClick={() => {}}>Hold</Button>
              </PageCard>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (tutorialState === 0) {
    return (
      <div className="h-[calc(100vh_-_5.375rem)] py-12">
        <div className="flex flex-col gap-1 items-center justify-center h-full w-120 m-auto">
          <h2 className="font-bold text-2xl text-gray-700 text-center">
            Welcome to
            <Image
              width={600}
              height={144}
              className="mt-4 mb-8 animate-bounce"
              src="/images/logo.svg"
              alt="Questrader"
            />
          </h2>
          <p className="text-lg text-gray-500 text-center w-80">
            Before you start learning, we'll like to show you around this
            website.
          </p>
          <button
            className="text-lg text-gray-900 text-center underline hover:cursor-pointer"
            onClick={() => setTutorialState((s) => s! + 1)}
          >
            Click here to start.
          </button>
        </div>
      </div>
    );
  }

  if (tutorialState === 5) {
    return (
      <div className="h-[calc(100vh_-_5.375rem)] py-12">
        <div className="flex flex-col gap-1 items-center justify-center h-full w-80 m-auto">
          <h2 className="font-bold text-2xl text-gray-700 text-center">
            Are you ready to start learning?
          </h2>
          <p className="text-lg text-gray-500 text-center">
            Good luck and have fun!
          </p>
          <button
            className="text-lg text-gray-900 text-center underline hover:cursor-pointer"
            onClick={() => {
              setTutorialState(null);
              setIsPaused(false);
            }}
          >
            Click here to <span className="font-bold">start</span>!
          </button>
        </div>
      </div>
    );
  }

  const currentDate = dayToDate(startDate, day);
  const formattedDate = dateFormatter.format(currentDate);

  return (
    <>
      <div className="h-[calc(100vh_-_5.375rem)] py-12">
        <section className="max-w-[72rem] min-w-[16rem] w-[80%] mx-auto h-full flex flex-row gap-5">
          <div className="h-full w-[68%]">
            <PageCard>
              {tutorialState === 1 && (
                <div className="flex flex-col gap-1 items-center justify-center h-full w-[36rem] m-auto">
                  <h2 className="font-bold text-2xl text-gray-700 text-center">
                    This is your stock chart
                  </h2>
                  <div className="flex flex-col gap-2">
                    <p className="text-lg text-gray-500 text-center">
                      When you look at a stock chart, you'll see four key
                      prices: <strong className="font-bold">Open</strong>,{" "}
                      <strong className="font-bold">Close</strong>,{" "}
                      <strong className="font-bold">High</strong>, and{" "}
                      <strong className="font-bold">Low</strong>. These tell the
                      story of a stock's price movement during a trading day.
                    </p>
                    <ul className="flex flex-col items-start text-lg text-gray-500 text-center">
                      <li>
                        <strong className="font-bold">Open</strong>: The price
                        the stock starts trading at when the market opens.
                      </li>
                      <li>
                        <strong className="font-bold">Close</strong>: The final
                        price when the market closes for the day.
                      </li>
                      <li>
                        <strong className="font-bold">High</strong>: The highest
                        price the stock reached during the day.
                      </li>
                      <li>
                        <strong className="font-bold">Low</strong>: The lowest
                        price the stock hit that day.
                      </li>
                    </ul>
                    <p className="text-lg text-gray-500 text-center">
                      Together, these give a quick snapshot of how a stock moved
                      throughout the day and they help you understand trends,
                      volatility, and potential opportunities.
                    </p>
                  </div>
                  <button
                    className="text-lg text-gray-900 text-center underline hover:cursor-pointer"
                    onClick={() => setTutorialState((s) => s! + 1)}
                  >
                    Click here to move on.
                  </button>
                </div>
              )}
              {tutorialState !== 1 && <HiloOpenClose />}
            </PageCard>
          </div>
          <div className="h-full flex flex-col gap-5 w-[32%]">
            <Card className="overflow-visible">
              <div className="bg-white border-accent border-1 px-4 py-3 rounded-[20px] gap-4 flex flex-col justify-between">
                <div className="flex flex-row justify-between items-center w-full">
                  <h2 className="font-bold text-gray-900 text-2xl">
                    {formattedDate}
                  </h2>
                  <button
                    onClick={() =>
                      setIsPaused((p) => (tutorialState === null ? !p : p))
                    }
                    disabled={tutorialState !== null || decisionPending}
                    className="border-accent bg-accent p-2 border-1 block h-full aspect-square rounded-[20px] disabled:border-gray-300 disabled:bg-gray-300"
                  >
                    {(isPaused || decisionPending) && (
                      <RiPlayLine size={24} className="text-white" />
                    )}
                    {!(isPaused || decisionPending) && (
                      <RiPauseLine size={24} className="text-white" />
                    )}
                  </button>
                </div>
                <div className="h-[1px] w-[calc(100%_-_0.125rem)] mx-auto bg-accent"></div>
                <div>
                  <h2 className="font-thin text-gray-500 text-xl">
                    You have{" "}
                    <span className="font-bold">${amount?.toFixed(2)}</span>
                  </h2>
                </div>
              </div>
            </Card>
            <PageCard>
              <div className="flex flex-col justify-start gap-4 grow-1 h-full overflow-scroll">
                {tutorialState === 2 && (
                  <div className="flex flex-col gap-1 items-center justify-center h-full p-6 pb-8">
                    <h2 className="font-bold text-xl text-gray-700 text-center">
                      This is your article feed
                    </h2>
                    <p className="text-md text-gray-500 text-center">
                      News articles will appear here as the level progresses.
                      Keep these articles in mind becaues they reflect real
                      world events that could affect the stock market!
                    </p>
                    <button
                      className="text-md text-gray-900 text-center underline hover:cursor-pointer"
                      onClick={() => setTutorialState((s) => s! + 1)}
                    >
                      Click here to move on.
                    </button>
                  </div>
                )}

                {tutorialState === 3 && (
                  <div className="flex flex-col gap-1 items-center justify-center h-full p-6 pb-8">
                    <h2 className="font-bold text-xl text-gray-700 text-center">
                      The card above this text shows the current date.
                    </h2>
                    <p className="text-md text-gray-500 text-center">
                      Time will progress week-by-week as the level progresses.
                      After certain articles, the level will pause and ask you
                      to make a decision: buy, sell, or hold. Make the best
                      choice you can!
                    </p>
                    <button
                      className="text-md text-gray-900 text-center underline hover:cursor-pointer"
                      onClick={() => setTutorialState((s) => s! + 1)}
                    >
                      Click here to move on.
                    </button>
                  </div>
                )}

                {tutorialState === 4 && (
                  <div className="flex flex-col gap-1 items-center justify-center h-full p-6 pb-8">
                    <h2 className="font-bold text-xl text-gray-700 text-center">
                      The buttons below will allow you to manage shares.
                    </h2>
                    <p className="text-md text-gray-500 text-center">
                      Speaking of buying, selling, and holding, the buttons
                      below will let you buy and sell the stocks of different
                      companies. Holding means you will stay put with your
                      current arrangement and not change it. The buttons are
                      disabled until the level pauses and asks you to make a
                      decision.
                    </p>
                    <button
                      className="text-md text-gray-900 text-center underline hover:cursor-pointer"
                      onClick={() => setTutorialState((s) => s! + 1)}
                    >
                      Click here to move on.
                    </button>
                  </div>
                )}
                {selectedArticle === null &&
                  pushedArticles.map((article) => (
                    <button
                      key={article.id}
                      className="block animate-pop-in hover:cursor-pointer w-full"
                      onClick={() => setSelectedArticle(article)}
                    >
                      <div className="w-full">
                        <FeedCard
                          cardClassName="items-start"
                          article={article}
                          date={dayToDate(startDate, article.day)}
                        />
                      </div>
                    </button>
                  ))}
                {selectedArticle !== null && (
                  <button
                    className="block animate-pop-in h-full hover:cursor-pointer"
                    onClick={() => {
                      setSelectedArticle(null);
                    }}
                  >
                    <div className="w-full h-full">
                      <FeedCard
                        cardClassName="h-full"
                        article={selectedArticle}
                        truncateText={false}
                        date={dayToDate(startDate, selectedArticle.day)}
                      />
                    </div>
                  </button>
                )}
              </div>
            </PageCard>
            <div className="flex flex-row justify-between gap-5">
              <Button
                disabled={!decisionPending}
                onClick={() => {
                  setStockOrder({
                    ticker: "AAPL", // TODO: fix
                    price: 1,
                    units: "",
                    type: "buy",
                  });
                }}
              >
                Buy
              </Button>
              <Button
                disabled={!decisionPending}
                onClick={() => {
                  setStockOrder({
                    ticker: "AAPL", // TODO: fix
                    price: 1,
                    units: "",
                    type: "sell",
                  });
                }}
              >
                Sell
              </Button>
              <Button disabled={!decisionPending} onClick={() => {}}>
                Hold
              </Button>
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
            <div className="flex flex-col gap-1">
              <div className="flex flex-row gap-1">
                <span className="capitalize">{stockOrder.type}</span>{" "}
                <input
                  className="border-1 border-accent rounded-[20px] text-center w-20"
                  type="number"
                  value={stockOrder.units}
                  onChange={(e) => {
                    setStockOrder({ ...stockOrder, units: e.target.value });
                  }}
                />
                shares of {stockOrder.ticker} at
                {/*  TODO: use mssot recent data from db */}
                each?
              </div>
              {orderError !== null && (
                <p className="text-red-500 text-sm">{orderError}</p>
              )}
            </div>
          );
        }}
        onAction={async () => {
          if (amount === null || amount === undefined || stockOrder === null) {
            return;
          }

          const numericalUnits = +stockOrder.units;

          if (isNaN(numericalUnits)) {
            setOrderError("You specified an invalid number of shares.");
            return;
          }

          if (numericalUnits <= 0 || !Number.isInteger(numericalUnits)) {
            setOrderError("You must specify a positive integer of shares.");
            return;
          }

          // TODO: hook to firebase
          if (stockOrder?.type === "buy") {
            if (numericalUnits * stockOrder.price > amount) {
              setOrderError(
                `You can afford at most ${Math.floor(
                  amount / stockOrder.price
                )} shares.`
              );
              return;
            }

            const docRef = doc(
              db,
              "level",
              levelId,
              "stocks",
              stockOrder.ticker.toUpperCase()
            );
            const snapshot = await getDoc(docRef);

            if (snapshot.exists()) {
              const shares = snapshot.get("shares") as number;

              await updateDoc(docRef, {
                shares: shares + numericalUnits,
              });
            } else {
              await setDoc(docRef, {
                shares: numericalUnits,
              });
            }

            console.log(numericalUnits, stockOrder.price);

            setAmount((amount) => amount! - numericalUnits * stockOrder.price);
          } else {
            const docRef = doc(
              db,
              "level",
              levelId,
              "stocks",
              stockOrder.ticker.toUpperCase()
            );
            const snapshot = await getDoc(docRef);

            if (snapshot.exists()) {
              const shares = snapshot.get("shares") as number;

              if (shares < numericalUnits) {
                setOrderError(`You only have ${shares} shares.`);
                return;
              }

              await updateDoc(docRef, {
                shares: shares - numericalUnits,
              });
            }

            setAmount((amount) => amount! + numericalUnits * stockOrder.price);
          }

          setStockOrder(null);
          setOrderError(null);
        }}
        onCancel={() => {
          setStockOrder(null);
          setOrderError(null);
        }}
      />
    </>
  );
}
