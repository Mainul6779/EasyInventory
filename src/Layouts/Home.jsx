import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
    return (
        <div>
            <Navbar/>
            <Outlet/>
            {/* <Footer/> */}
        </div>
    );
};

export default Home;