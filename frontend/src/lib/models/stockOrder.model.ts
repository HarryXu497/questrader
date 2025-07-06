interface StockOrder {
    type: 'buy' | 'sell';
    units: string;
    price: number;
    ticker: string;
}