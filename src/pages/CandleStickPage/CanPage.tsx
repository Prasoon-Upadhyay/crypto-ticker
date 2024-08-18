import React, { Suspense, useEffect, useRef, useState } from "react"; 
import './CanPage.css'
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import axios from 'axios';
import CandleSkeleton from "../../components/Placeholders/CandleStick/CandleSkeleton";
const CandleStick = React.lazy( () => import("../../components/CandleStick/CandleStick"))

export default function CanPage () {
    
    const [tickerSymbols, setTickerSymbols] = useState([]);
    const [currentTicker, setCurrentTicker] = useState("")
    const [interval, setInterval] = useState('1m');
   
    const navigate = useNavigate(); 
    
    const pageRef = useRef<HTMLDivElement | null>(null)
    
    // Page Animation on Load

    useEffect( () => {
        
        const pageTimeout = setTimeout( () => {
            pageRef.current?.classList.add('fadeIn')
        }, 800)
  
        return () => {
 
            pageRef.current?.classList.remove('fadeIn')
        
            clearTimeout(pageTimeout) 
        }

    }, [])


    // Intializing the Tickers on PageLoad
    useEffect( () => {
        async function getAllTickers() {
            try 
            {

                const response = await axios.get('https://api.binance.com/api/v3/ticker/price');
                const tickers = response.data.map( (ticker : { symbol: string, price: number }) => ticker.symbol); 
                setTickerSymbols(tickers) 
            } 
            catch (e) 
            {
                console.log(e);
                
                navigate('/error')
            }
        }

        getAllTickers();

    }, [])


    // Setting the current ticker after all the tickers are fetched
    useEffect( () => {
        
        if(tickerSymbols.length > 0)
        setCurrentTicker(tickerSymbols[0])

    }, [tickerSymbols])
    
 
    return(
        <main className="bg--overlay">
            <div ref={pageRef}  className="controls">
                <section className="options--section"  > 
                    <select
                        id="tickerSelect"
                        className="ticker--dropdown"
                        value={currentTicker}
                        onChange={(e) => setCurrentTicker(e.target.value)}
                    >
                        {
                            tickerSymbols.map( (ticker, i) => <option key = {i} value={ticker}>{ticker}</option>)
                        } 
                    </select>  
                    <select
                        id="intervalSelect"
                        className="interval--dropdown"
                        value={interval}
                        onChange={(e) => setInterval(e.target.value)}
                    >
                        <option value="1m">1 Minute</option>
                        <option value="5m">5 Minutes</option>
                        <option value="15m">15 Minutes</option>
                        <option value="1h">1 Hour</option>
                        <option value="4h">4 Hours</option>
                        <option value="1d">1 Day</option>
                        <option value="1w">1 Week</option> 
                    </select>
                </section> 
 
                { currentTicker ? <Suspense fallback = {<CandleSkeleton />}>
                    <CandleStick tickerSymbol={currentTicker} interval={interval} />
                </Suspense> : ''}
                 
                <button onClick={() => navigate("/")}> <IoIosArrowBack /> Dashboard</button>
            </div>
        </main>
    )
}