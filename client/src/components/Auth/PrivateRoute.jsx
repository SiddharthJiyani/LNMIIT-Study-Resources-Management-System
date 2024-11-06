// // This will prevent non-authenticated users from accessing this route
// import { Navigate } from "react-router-dom"

// function PrivateRoute({ children }) {

//   const token = localStorage.getItem("token")

//   if (token !== null) {
//     return children
//   } else {
//     return <Navigate to="/login" />
//   }
// }

// export default PrivateRoute

import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

function PrivateRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();


  const isTokenExpired = () => {
    const expiryTime = localStorage.getItem("tokenExpiryTime");
    return expiryTime && new Date().getTime() > Number(expiryTime);
  };
  if( token === undefined || token === 'undefined' || token === null || token === 'null') {
    navigate('/login');

  }
  const isAuthenticated = token !== null && token !== undefined && !isTokenExpired();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Session timed out, please log in again.");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiryTime");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute;
