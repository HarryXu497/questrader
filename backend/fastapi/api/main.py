from fastapi import FastAPI, WebSocket
from dotenv import load_dotenv
import asyncio
import requests
import os
import json


load_dotenv()

headers = {
    "accept": "application/json",
    "APCA-API-KEY-ID": os.getenv("ALPACA_API_KEY"),
    "APCA-API-SECRET-KEY": os.getenv("ALPACA_API_SECRET")
}

app = FastAPI()

@app.websocket("/ws/portfolio")
async def portfolio_endpoint(websocket: WebSocket):
    await websocket.accept()
    data = await websocket.receive_text()
    parsed = json.loads(data)
    ticker = parsed.get("ticker") 
    end_date = parsed.get("end_date")
    start_date = parsed.get("start_date")
    while True:
        url = f"https://data.alpaca.markets/v2/stocks/bars?symbols={ticker}&timeframe=1W&start={start_date}&end={end_date}&limit=1&adjustment=raw&feed=iex&sort=asc"

        response = requests.get(url, headers=headers)
        input_data = response.json()

        bars = input_data["bars"][ticker]
        reformatted = []
        
        for bar in bars:
            reformatted.append({
                "x": bar["t"], 
                "open": bar["o"],
                "high": bar["h"],
                "low": bar["l"],
                "close": bar["c"],
                "volume": bar["v"]
            })
        await websocket.send_json(reformatted)
        await asyncio.sleep(1)

@app.websocket("/ws/market")
async def market_endpoint(websocket: WebSocket):
    await websocket.accept()
    data = await websocket.receive_text()
    parsed = json.loads(data)
    ticker = parsed.get("ticker") 
    end_date = parsed.get("end_date")
    start_date = parsed.get("start_date")
    while True:
        url = f"https://data.alpaca.markets/v2/stocks/bars?symbols={ticker}&timeframe=1W&start={start_date}&end={end_date}&limit=1&adjustment=raw&feed=iex&sort=asc"

        response = requests.get(url, headers=headers)
        input_data = response.json()

        bars = input_data["bars"][ticker]
        reformatted = []
        
        for bar in bars:
            reformatted.append({
                "x": bar["t"], 
                "open": bar["o"],
                "high": bar["h"],
                "low": bar["l"],
                "close": bar["c"],
                "volume": bar["v"]
            })
        await websocket.send_json(reformatted)
        await asyncio.sleep(1)

@app.websocket("/ws/learn/{level_id}")
async def learn_endpoint(websocket: WebSocket):
    await websocket.accept()
    data = await websocket.receive_text()
    parsed = json.loads(data)
    ticker = parsed.get("ticker") 
    end_date = parsed.get("end_date")
    start_date = parsed.get("start_date")
    while True:
        url = f"https://data.alpaca.markets/v2/stocks/bars?symbols={ticker}&timeframe=1W&start={start_date}&end={end_date}&limit=1&adjustment=raw&feed=iex&sort=asc"

        response = requests.get(url, headers=headers)
        input_data = response.json()

        bars = input_data["bars"][ticker]
        reformatted = []
        
        for bar in bars:
            reformatted.append({
                "x": bar["t"], 
                "open": bar["o"],
                "high": bar["h"],
                "low": bar["l"],
                "close": bar["c"],
                "volume": bar["v"]
            })
        await websocket.send_json(reformatted)
        await asyncio.sleep(1)