import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  console.log("User in private route:", user);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const notify = () => {
    toast.warn("You have to login first!", {
      position: "top-center",
    });
  };

  if (!user) {
    notify();
    return <Navigate state={{ from: location }} to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
