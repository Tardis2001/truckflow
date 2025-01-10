import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Truck from "./pages/Truck";
import Driver from "./pages/Driver";
import Tire from "./pages/Tire";
import Fuel from "./pages/Fuel";
import Oil from "./pages/Oil";
import _routes from "./pages/Routes";
function App() {
    return (
        <main>
            <Router>
                <Sidebar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/driver" element={<Driver />} />
                        <Route path="/truck" element={<Truck />} />
                        <Route path="/tire" element={<Tire />} />
                        <Route path="/fuel" element={<Fuel />} />
                        <Route path="/routes" element={<_routes />} />
                        <Route path="/oil" element={<Oil />} />
                    </Routes>
                </div>
            </Router>
        </main>
    );
}

export default App;
