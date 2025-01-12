import styles from "./App.module.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Truck from "./pages/Truck/Truck";
import Driver from "./pages/Driver/Driver";
import Tire from "./pages/Tire/Tire";
import Fuel from "./pages/Fuel/Fuel";
import Oil from "./pages/Oil/Oil";
import _routes from "./pages/Routes/Routes";
import Export from "./pages/Export/Export";
function App() {
    return (
        <main>
            <Router>
                <Sidebar />
                <div className={styles.content}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/driver" element={<Driver />} />
                        <Route path="/truck" element={<Truck />} />
                        <Route path="/tire" element={<Tire />} />
                        <Route path="/fuel" element={<Fuel />} />
                        <Route path="/routes" element={<_routes />} />
                        <Route path="/oil" element={<Oil />} />
                        <Route path="/export" element={<Export />} />
                    </Routes>
                </div>
            </Router>
        </main>
    );
}

export default App;
