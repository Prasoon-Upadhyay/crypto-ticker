export  interface Series {
    x: Date,
    y: number[]
}


export interface Ticker24hr {
    symbol: string;                 
    priceChange: string;           
    priceChangePercent: string;
    weightedAvgPrice: string;
    prevClosePrice: string;
    lastPrice: string;              
    lastQty: string;                
    bidPrice: string;               
    bidQty: string;                 
    askPrice: string;               
    askQty: string;                 
    openPrice: string;               
    highPrice: string;               
    lowPrice: string;                
    volume: string;                  
    quoteVolume: string;             
    openTime: number;               
    closeTime: number;              
    firstId: number;                 
    lastId: number;                  
    count: number;                   
}

export interface TickerData {
    symbol: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    marketCap: number;
    pChange: number
}

export interface TickerStream {
    e: string;                
    E: number;                
    s: string;               
    p: string;               
    P: string;                
    w: string;                
    x: string;               
    c: string;               
    Q: string;               
    b: string;               
    B: string;               
    a: string;               
    A: string;               
    o: string;               
    h: string;               
    l: string;               
    v: string;                 
    q: string;                 
    O: number;                 
    C: number;                 
    F: number;                
    L: number;                
    n: number;                
}
