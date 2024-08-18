
import './TableSkeleton.css'

export default function TableSkeleton () {

    return <div className="table--placeholder--comp">
        <div className='btn--skeletons'>
            <div className="btn--skeleton">.</div>
            <div className="btn--skeleton">.</div>
            <div className="btn--skeleton">.</div>
        </div>
        
        <table >
                <thead  className="table--heading"> 
                    <tr>
                        <th><span>Symbol</span></th>
                        <th><span>Open</span></th>
                        <th><span>High</span></th>
                        <th><span>Low</span></th>
                        <th><span>Close</span></th>
                        <th><span>Volume</span></th>
                        <th><span>Market Cap</span></th>
                    </tr>
                </thead>

                <tbody>
                    <tr className='placeholder--row'><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr className='placeholder--row'><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr className='placeholder--row'><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr className='placeholder--row'><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr className='placeholder--row'><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr className='placeholder--row'><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr className='placeholder--row'><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                </tbody>
        </table>
    </div>
}