import { createBrowserRouter } from "react-router-dom";
import Home from "./Layouts/Home";
import Dashboard from "./pages/Dashboard";
import Add from "./pages/Add";
import Sales from "./pages/Sales";
import Stock from "./pages/Stock";
import Report from "./pages/Report";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const App = createBrowserRouter([
  {
      path: "/",
      element: <Home/>,
      children: [
          {
              path: '/',
              element: <Dashboard/>
          },
          {
              path: '/additem',
              element: <Add/>
          },
          {
              path: '/sales',
              element: <Sales/>
          },
          {
              path: '/stock',
              element: <Stock/>
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

