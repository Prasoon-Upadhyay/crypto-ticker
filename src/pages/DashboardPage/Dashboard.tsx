
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

import './Dashboard.css'
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import HeroIcon from './../../assets/hero.png'

export default function Dashboard () {

    const navigate  = useNavigate();

    const textRef = useRef<HTMLTableSectionElement | null>(null)
    const imageRef = useRef<HTMLImageElement | null>(null)
    const pageRef = useRef<HTMLElement | null>(null)

    useEffect( () => {
        
        const pageTimeout = setTimeout( () => {
            pageRef.current?.classList.add('fadeIn')
        }, 800)

        const textTimeout = setTimeout( () => {
            textRef.current?.classList.add('fadeIn')
            textRef.current?.classList.add('fadeDown')
        }, 1200)

        const imageTimeout = setTimeout( () => {
            imageRef.current?.classList.add('fadeIn')
            imageRef.current?.classList.add('fadeDown')
        }, 1800)

        return () => {

            textRef.current?.classList.remove('fadeIn')
            textRef.current?.classList.remove('fadeDown')
            imageRef.current?.classList.remove('fadeIn')
            pageRef.current?.classList.remove('fadeIn')
        
            clearTimeout(pageTimeout)
            clearTimeout(textTimeout)
            clearTimeout(imageTimeout) 
        }

    }, [])


    return(
        <main className="bg--overlay">
            <section className="dashboard"  ref={pageRef}>
                <div className="dashboard--text">
                    <h1 ref={textRef} className="dashboard--heading">Track Every Ticker</h1>
                    <div className='subheading'>
                        <p>Dynamic Tables & Candlestick Charts in One Place.</p>
                        <div>
                            <button onClick={() => navigate("/candleStick")}><FaChevronLeft/> Check Ticker</button>
                            <button onClick={() => navigate("/table")}>OHLC for Tickers <FaChevronRight/></button>
                        </div>
                    </div>
                </div>
                <div>
                    <img className="dashboard--image" ref={imageRef} src = {HeroIcon} />
                </div>
            </section>
        </main>
    )
}