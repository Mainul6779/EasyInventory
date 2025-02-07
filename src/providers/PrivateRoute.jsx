import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate, useLocation } from "react-router";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  

  const location = useLocation();
  console.log("user in private route", user);

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  const notify = () => {
  toast.warn("You have to login first!!", {
    position: toast.POSITION.TOP_CENTER
  });
}

  if (!user) {
    notify(); 
    return <Navigate state={{ from: location }} to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
