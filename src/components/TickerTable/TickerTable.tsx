 
import { useCallback, useEffect, useMemo, useState } from "react";
import throttle from "../../assets/utils/throttle";
import axios from "axios";
import './TickerTable.css'
import TableRow from "./TableRow"; 
import { FaArrowTrendDown, FaArrowTrendUp, FaArrowUpAZ } from "react-icons/fa6";
import { FaArrowDownZA } from "react-icons/fa6";
import { FaSortNumericUp, FaSortNumericDown } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { BiReset } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { TickerData, Ticker24hr, TickerStream } from "../../assets/utils/types";
 

export default function TickerTable () {

    const [tableData, setTableData] = useState<TickerData[]>([]); // All The Data
    const [page, setPage] = useState<number>(1);                  // Pagination State
    const [filter, setFilter] = useState('all')                   // Filtering State
    const [sort, setSort] = useState(                             // Sorting State
        {
            ifSort: false,
            symbol : {
                isSort : false,
                order: 'asc'
            },

            marketCap : {
                isSort : false,
                order: 'asc'
            }
        }
    )
    
    const navigate = useNavigate();
 
 

    const fetchMarketData = async () => {
        try {
            const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr'); 
            
            const data = response.data.map((item: Ticker24hr) => ({
                symbol: item.symbol,
                open: parseFloat(item.openPrice),
                high: parseFloat(item.highPrice),
                low: parseFloat(item.lowPrice),
                close: parseFloat(item.lastPrice),
                volume: parseFloat(item.volume),
                marketCap: parseFloat(item.quoteVolume), 
                pChange: parseFloat(item.priceChangePercent)
            }));

            setTableData(data);
        } catch (error) {
            console.log(error);
            
            navigate('/error')
        }
    };


    // Paginationm Buttons

    const renderedBtns = 
    [
        <button key={Math.random()* 9999} disabled = {page === 1} className="prev--btn" onClick={() => setPage((prevPage) => prevPage - 1)}>Previous</button>,
        
        page !== 1 ? <button key={Math.random()* 9999}>{page - 1}</button> : '',
        <button key={Math.random()* 9999} className="current--page">{page}</button>,
        <button key={Math.random()* 9999}>{page + 1}</button>,
        <span> &nbsp; . . . &nbsp;</span>,  

        page < Math.ceil(tableData.length / 8) - 10 ? <button key={Math.random()* 9999} disabled = {page === Math.ceil(tableData.length / 8) - 10 }  onClick={ () => setPage( (prevPage) => prevPage + 10) }>{page + 10}</button>: '',
        page < Math.ceil(tableData.length / 8) - 11 ? <button key={Math.random()* 9999} disabled = {page === Math.ceil(tableData.length / 8) - 10 }  onClick={ () => setPage( (prevPage) => prevPage + 11) }>{page + 11}</button> : '',
        page < Math.ceil(tableData.length / 8) - 12 ? <button key={Math.random()* 9999} disabled = {page === Math.ceil(tableData.length / 8) - 10 }  onClick={ () => setPage( (prevPage) => prevPage + 12) }>{page + 12}</button>: '',
        
        <button key={Math.random()* 9999} className="next--btn" onClick={() => setPage((prevPage) => prevPage + 1)}>Next</button>,
         
    ]
    

    // Fetching the Initial Data for the Ticker and establishing Socket Connection for Live Updates

    useEffect(() => {
        fetchMarketData();

        const socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

        const throttledMessage = throttle((event: MessageEvent) => {
            const tickerData = JSON.parse(event.data);

            setTableData((prevData) => {
                const updatedData = prevData.map((item) => {
                    const updatedItem = tickerData.find((td: TickerStream) => td.s === item.symbol);
                    return updatedItem
                        ? {
                              ...item,
                              open: parseFloat(updatedItem.o),
                              high: parseFloat(updatedItem.h),
                              low: parseFloat(updatedItem.l),
                              close: parseFloat(updatedItem.c),
                              volume: parseFloat(updatedItem.v), 
                          }
                        : item;
                });
                return updatedData;
            });
        }, 5000);

        socket.onmessage = throttledMessage;

        return () => {
            socket.close();
        }
         
    }, []);
 
    
    // Filtering Data using the Filter State and memoizing the array 

    const filteredData = useMemo( () => {

        let data = tableData;

        if (filter === 'gainers') data = tableData.filter( datum => datum.pChange > 0) 
        else if (filter === 'losers') data = tableData.filter( datum => datum.pChange < 0) 
        else data = tableData.map(datum => datum)  
        
        return data;

    },[filter, tableData]);
    
    // Sorting Data using the Filter State and memoizing the array 

    const sortedData = useMemo(() => {

        const data = [...filteredData];
        
        if (sort.ifSort) {
        
            if (sort.symbol.isSort)
            {
                data.sort((a, b) => 
                {
                    return sort.symbol.order === 'asc'
                        ? a.symbol.localeCompare(b.symbol)
                        : b.symbol.localeCompare(a.symbol);
                });

            } 
            else if (sort.marketCap.isSort) 
            {
                data.sort((a, b) => 
                {
                    return sort.marketCap.order === 'asc'
                        ? a.marketCap - b.marketCap
                        : b.marketCap - a.marketCap;
                });
            }
        }
        return data;
        
    }, [sort, filteredData]);


    // Paging the Data using the Filter State and memoizing the array     
    
    const paginatedData = useMemo( () => {

        const startIndex = (page - 1) * 8;
        return sortedData.slice(startIndex, startIndex + 8);

    }, [page, sortedData])


    // The sorting function being memoized such that to prevent redeclaration on every re-render due to the Socket Streams

    const handleSort = useCallback((column: 'symbol' | 'marketCap') => {

        setSort( (prevSort) => {
            const isSortAsc = prevSort[column].order === 'asc';
            return {
                ifSort: true,
                symbol: 
                {
                    isSort: column === 'symbol',
                    order: column === 'symbol' && !isSortAsc ? 'asc' : 'desc'
                },
                marketCap: 
                {
                    isSort: column === 'marketCap',
                    order: column === 'marketCap' && !isSortAsc ? 'asc' : 'desc'
                }
            };
        });

    }, []);


    return (
        <div className="table--page"> 
            <section className="filter--btns">
                <button className={filter === "all" ? `current--page` : ''} onClick={() => {setFilter('all'); setPage(1)}}>All</button>
                <button className={filter === "gainers" ? `current--page` : ''} onClick={() => {setFilter('gainers'); setPage(1) }}> <FaArrowTrendUp /> Gainers </button>
                <button className={filter === "losers" ? `current--page` : ''} onClick={() => {setFilter('losers') ; setPage(1)}}> <FaArrowTrendDown /> Losers  </button>
            </section>
            <table >
                <thead  className="table--heading"> 
                    <tr>
                        <th><span>Symbol{ sort.symbol.order === "asc" ? <FaArrowUpAZ className="sort--icon" onClick={() => handleSort("symbol")} /> : <FaArrowDownZA className="sort--icon"  onClick={() => handleSort("symbol")} />}</span></th>
                        <th><span>Open</span></th>
                        <th><span>High</span></th>
                        <th><span>Low</span></th>
                        <th><span>Close</span></th>
                        <th><span>Volume</span></th>
                        <th><span>Market Cap{ sort.marketCap.order === "asc" ? <FaSortNumericUp  className="sort--icon" onClick={() => handleSort("marketCap")} /> : <FaSortNumericDown  className="sort--icon" onClick={() => handleSort("marketCap")} />}</span></th>
                    </tr>
                </thead>
                <tbody className="table--body"> 
                    {paginatedData.map( (item, i) => <TableRow  item={item} index={i}/>)}
                </tbody>
            </table>
            <div className="btn--group">
                <div className="page--btns">
                    {renderedBtns}
                </div>
                <div className="activity--btns">
                    <button onClick={() => {setFilter('all'); setSort(
                    {
                        ifSort: false,
                        symbol : {
                            isSort : false,
                            order: 'asc'
                        },

                        marketCap : {
                            isSort : false,
                            order: 'asc'
                        }
                    }); setPage(1)}}>Reset <BiReset />
                    </button>
                    <button onClick={() => navigate("/")}> <IoIosArrowBack /> Dashboard</button>
                </div>
            </div>
        </div>
    );
};