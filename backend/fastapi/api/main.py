from fastapi import FastAPI, WebSocket
from dotenv import load_dotenv
import asyncio
import random
import requests
import os
import time

load_dotenv()

headers = {
    "accept": "application/json",
    "APCA-API-KEY-ID": os.getenv("ALPACA_API_KEY"),
    "APCA-API-SECRET-KEY": os.getenv("ALPACA_API_SECRET")
}

app = FastAPI()

@app.websocket("/ws/market")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        ticker = await websocket.receive_text()
        print(ticker)
        ticker = ticker.strip() 
        response = requests.get(f"https://data.alpaca.markets/v2/stocks/quotes/latest?symbols={ticker}&feed=iex&currency=USD", headers=headers)
        data = response.json()
        market_data = {
            "symbol": ticker,
            "bid_price": data["quotes"][ticker]["bp"],
            "ask_price": data["quotes"][ticker]["ap"]
        }
        #print(market_data["bid_price"])
        await websocket.send_json(market_data)
        await asyncio.sleep(1)  