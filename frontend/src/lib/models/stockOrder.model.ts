interface StockOrder {
    type: 'buy' | 'sell';
    units: number;
    price: number;
    ticker: string;
}