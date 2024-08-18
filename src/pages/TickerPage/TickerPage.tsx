import React, { Suspense, useEffect, useRef } from "react"
import TableSkeleton from "../../components/Placeholders/Table/TableSkeleton"
import './TickerPage.css'

const TickerTable = React.lazy(() => import("../../components/TickerTable/TickerTable"))

export default function TickerPage () {

    const pageRef = useRef<HTMLDivElement | null>(null)
    useEffect( () => {
        
        const pageTimeout = setTimeout( () => {
            pageRef.current?.classList.add('fadeIn')
        }, 800)
  
        return () => {
 
            pageRef.current?.classList.remove('fadeIn')
        
            clearTimeout(pageTimeout) 
        }

    }, [])


    return (
    <main className="bg--overlay">
        <section className="table--section" ref={pageRef}>
            <h1>OHLCV and Market Data</h1>
            <Suspense fallback = {<TableSkeleton />}>
                <TickerTable />
            </Suspense> 
        </section>
    </main>
    )
}