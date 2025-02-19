import Menubar from "./Menubar";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router";
import App from "../App";
import WarehousePage from "../pages/Warehouse";
import StockPage from "../pages/Stock";
import ProductPage from "../pages/Product";
import ReportPage from "../pages/Report";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";


function Routing() {
    return (
        <Router>
            <Menubar />
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/warehouse" element={<WarehousePage />} />
                <Route path="/product" element={<ProductPage />} />
                <Route path="/inventory" element={<StockPage />} />
                <Route path="/reports" element={<ReportPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/inventory" element={<StockPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default Routing;
