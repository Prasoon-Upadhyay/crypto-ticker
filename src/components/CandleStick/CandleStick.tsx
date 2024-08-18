/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Chart from "react-apexcharts"
import throttle from "../../assets/utils/throttle";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { ApexOptions } from 'apexcharts';
import { Series } from "../../assets/utils/types"; 

export default function CandleStick ( { tickerSymbol, interval } : { tickerSymbol: string, interval: string } ) {

    const [candleData, setCandleData] = useState<Series[]>([]);  // ALl the data state
    const [lastCandle, setLastCandle] = useState<Series | null>(null); // State for the Last Candle sent by the Stream
 
    const navigate = useNavigate();

    const fetchInitialData = async () => {

        try {
            const response = await axios({
                url: `https://api.binance.com/api/v3/klines?symbol=${tickerSymbol}&interval=${interval}&limit=100`,
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = response.data.map((datum: any) => ({
                x: new Date(datum[0]),
                y: [parseFloat(datum[1]), parseFloat(datum[2]), parseFloat(datum[3]), parseFloat(datum[4])]
            }));
            setCandleData(data)
        }

        catch (e) {
            navigate('/error')
        }
        
        
    }


    // Fetching the Initial Data and establishing the Socket Connection for live updates 

    useEffect( () => {

        fetchInitialData(); 

        const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${tickerSymbol.toLowerCase()}@kline_${interval}`);
        
        // The Stream being throttled down to every 5s.

        const throttledMessage = throttle((event: MessageEvent) => {
            const tickerData = JSON.parse(event.data);
 
            
            if (!tickerData.k.x && tickerData.k.i === interval) { // We check that if the latest candle being received and the interval selected are the same and that the candle is open.
                setLastCandle({
                    x: new Date(tickerData.k.t), // The Interval of the Kline
                    y: [
                        parseFloat(tickerData.k.o), // Open
                        parseFloat(tickerData.k.h), // High
                        parseFloat(tickerData.k.l), // Low
                        parseFloat(tickerData.k.c)  // Close
                    ]
                });
            }
        }, 5000);

        socket.onmessage = throttledMessage

        return () => {
            console.log("Closing connection.");
            
            socket.close();
        }
        
    },[tickerSymbol, interval])
    

    // 

    useEffect(() => {
        if (lastCandle) { 
            
            setCandleData((prevData) => {
                
                const lastIndex = prevData.length - 1;
                let updatedData = [...prevData]; 
            
                // If the interval of both the last candle and the latest candle are the same, update the last candle 

                if (updatedData[lastIndex].x.getTime() === lastCandle.x.getTime()) 
                {
                    updatedData[lastIndex] = lastCandle;  
                }

                // If not, then add the latest candle to the candleData State.
                else
                { 
                    updatedData = [...updatedData, lastCandle];  
                    if (updatedData.length > 100) {
                        updatedData.shift(); 
                    }
                }
                return updatedData; 
            });
        }
    }, [lastCandle]);


    // Options for CandleStick Chart

    const options : ApexOptions  = {
        chart: {
          type: "candlestick", 
          id: 'candlestick-chart',
        
        },
        
        title: {
          text: `${interval} Kline for ${tickerSymbol} `,
          align: 'center',
        },

        xaxis: {  
            type: "datetime",
            labels: {

                formatter: function (val : string) {
                    return new Date(val).toLocaleString();
                }
            },
        },
        yaxis: {
          title: {
            text: 'Price',
          },
        },
        
        plotOptions: {
            candlestick: {
                colors: {
                    upward: 'rgba(135, 182, 252, 0.738)',  
                    downward: 'rgba(241, 153, 38, 0.877)', 
                },
                wick: {
                    useFillColor: true,  
                }, 
            },
        }, 
      };

     
    
    return( 
    <div className="chart">
            <Chart
                options={options} 
                series = { [{
                        data: candleData
                    }]
                } 
                type="candlestick"
                height={550} 
            />
    </div>)
}