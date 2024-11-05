// This will prevent authenticated users from accessing this route
import { Navigate } from "react-router-dom"

function OpenRoute({ children }) {

  const token = localStorage.getItem("token")

  if (token === null || token === 'undefined') {
    return children
  } else {
    return <Navigate to="/my-courses" />
  }
}

export default OpenRoute
