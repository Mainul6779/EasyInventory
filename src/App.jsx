import { createBrowserRouter } from "react-router-dom";
import Home from "./Layouts/Home";
import Dashboard from "./pages/Dashboard";
import Add from "./pages/Add";
import Sales from "./pages/Sales";
import Stock from "./pages/Stock";
import Report from "./pages/Report";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./providers/PrivateRoute";
import { ToastContainer } from "react-toastify";

const App = createBrowserRouter([
  {
      path: "/",
      element: <>
       <ToastContainer autoClose={500} />
       <Home/>
      </> ,
      children: [
          {
              path: '/',
              element: <Dashboard/>
          },
          {
              path: '/additem',
              element: ( <PrivateRoute> <Add/> </PrivateRoute> )
          },
          {
              path: '/sales',
              element: ( <PrivateRoute>   <Sales/>   </PrivateRoute>)
          },
          {
              path: '/stock',
              element:( <PrivateRoute> <Stock/>  </PrivateRoute> )
          },
          {
              path: '/report',
              element: <Report/>
          },
          {
              path: '/login',
              element: <Login/>
          },
          {
              path: '/signup',
              element: <SignUp/>
          },

      ],

  },
  {
      path: '*',
      element: <Home/>
  },
]);

export default App;

