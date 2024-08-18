import { CSSProperties, useEffect, useRef } from "react";
import { TickerData } from "./TickerTable";

import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";


export default function TableRow ( { item, index } : { item : TickerData, index: number}  ) {

    const rowRef = useRef<HTMLTableRowElement | null>(null)

    useEffect( () => {

        const rowTimeout = setTimeout( () => {

            rowRef.current?.classList.add("fadeIn");
            rowRef.current?.classList.add("dropDown");

        }, 200)

        return () => {
            rowRef.current?.classList.remove('fadeIn');
            rowRef.current?.classList.remove("dropDown");
            clearTimeout(rowTimeout)
        }

    },  )

    const rowOrder = {
        "--order": index
    } as CSSProperties

    return(  
            <tr className={`table--row `} style={rowOrder } key={item.symbol} ref={rowRef} >
                <td className="symbol"><span>{item.symbol} {item.pChange > 0 ? <FaArrowTrendUp className="arrow--up" /> : <FaArrowTrendDown className="arrow--down" /> }</span></td>
                <td><span className="num--values">${item.open.toFixed(2)}</span></td>
                <td><span className="num--values">${item.high.toFixed(2)}</span></td>
                <td><span className="num--values">${item.low.toFixed(2)}</span></td>
                <td><span className="num--values">${item.close.toFixed(2)}</span></td>
                <td><span className="num--values">${item.volume.toFixed(2)}</span></td>
                <td><span className="num--values">${item.marketCap.toFixed(2)}</span></td>
            </tr> 
    )
}