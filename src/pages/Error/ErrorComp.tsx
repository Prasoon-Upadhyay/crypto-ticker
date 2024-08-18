
import { IoIosArrowBack } from 'react-icons/io'
import './ErrorComp.css'
import { useNavigate } from 'react-router-dom'

export default function ErrorComp () {

    const navigate = useNavigate();

    return <main className="bg--overlay">
        <div className="error--container">
            <h1>Something Went Wrong :(</h1>
            <div>
                <button onClick={() => navigate("/")}> <IoIosArrowBack /> Dashboard</button>
            </div>
        </div>
    </main>

}