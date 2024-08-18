/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Chart from "react-apexcharts"
import throttle from "../../assets/utils/throttle";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { ApexOptions } from 'apexcharts';

interface Series {
    x: Date,
    y: number[]
}

export default function CandleStick ( { tickerSymbol, interval } : { tickerSymbol: string, interval: string } ) {

    const [candleData, setCandleData] = useState<Series[]>([]); 
    const [lastCandle, setLastCandle] = useState<Series | null>(null);
 
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



    useEffect( () => {

        fetchInitialData(); 

        const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${tickerSymbol.toLowerCase()}@kline_${interval}`);
        
        const throttledMessage = throttle((event: MessageEvent) => {
            const tickerData = JSON.parse(event.data);
 
            
            if (!tickerData.k.x && tickerData.k.i === interval) { 
                setLastCandle({
                    x: new Date(tickerData.k.t),
                    y: [
                        parseFloat(tickerData.k.o),
                        parseFloat(tickerData.k.h),
                        parseFloat(tickerData.k.l),
                        parseFloat(tickerData.k.c)
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
    

    useEffect(() => {
        if (lastCandle) { 
            
            setCandleData((prevData) => {
                
                const lastIndex = prevData.length - 1;
                let updatedData = [...prevData]; 
            
                if (updatedData[lastIndex].x.getTime() === lastCandle.x.getTime()) 
                {
                    updatedData[lastIndex] = lastCandle;  
                }

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
                    upward: 'rgba(111, 111, 234, 0.629)',  
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