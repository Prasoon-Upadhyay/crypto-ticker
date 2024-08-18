
import { createBrowserRouter, RouterProvider } from "react-router-dom" 
import CanPage from "./pages/CandleStickPage/CanPage"
import TickerPage from "./pages/TickerPage/TickerPage"
import Dashboard from "./pages/DashboardPage/Dashboard"
import ErrorComp from "./pages/Error/ErrorComp"

export default function App () {
 
    const router = createBrowserRouter([
      {
        path: "/",
        element: <Dashboard />
      },
      {
        path: "/candleStick",
        element: <CanPage />
      },
      {
        path: "/table",
        element: <TickerPage />
      },
      {
        path: "/error",
        element: <ErrorComp />
      }
    ])

    return <RouterProvider router={router} />
}