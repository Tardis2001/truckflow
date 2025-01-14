import styles from "./App.module.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import TruckPage from "./pages/Truck/Truck";
import Driver from "./pages/Driver/Driver";
import Tire from "./pages/Tire/Tire";
import Fuel from "./pages/Fuel/Fuel";
import Oil from "./pages/Oil/Oil";
import _routes from "./pages/Routes/Routes";
import Export from "./pages/Export/Export";
import { Spotlight } from "./components/Spotlight";
import {
    HomeIcon,
    Disc3Icon,
    Truck,
    SquareUserRound,
    FilterIcon,
    RouteIcon,
    FileUp,
    FuelIcon,
} from "lucide-react";
import { Waves } from "./components/Waves";
import { Dock, DockIcon, DockItem, DockLabel } from "./components/Dock/dock";
import SplashScreen from "./components/splash/SplashScreen";
import { useState } from "react";
import { Tiles } from "./components/tiles";

const data = [
    {
        title: "Dashboard",
        icon: (
            <HomeIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
        ),
        href: "/",
        element: <Dashboard />,
    },
    {
        title: "Motorista",
        icon: (
            <SquareUserRound className="h-full w-full text-neutral-600 dark:text-neutral-300" />
        ),
        href: "/driver",
        element: <Driver />,
    },
    {
        title: "Caminhão",
        icon: (
            <Truck className="h-full w-full text-neutral-600 dark:text-neutral-300" />
        ),
        href: "/truck",
        element: <TruckPage />,
    },
    {
        title: "Pneu",
        icon: (
            <Disc3Icon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
        ),
        href: "/tire",
        element: <Tire />,
    },
    {
        title: "Filtro de oleo",
        icon: (
            <FilterIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
        ),
        href: "/oil",
        element: <Oil />,
    },
    {
        title: "Combustivel",
        icon: (
            <FuelIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
        ),
        href: "/fuel",
        element: <Fuel />,
    },
    {
        title: "Rotas",
        icon: (
            <RouteIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
        ),
        href: "/routes",
        element: <_routes />,
    },
    {
        title: "Exportar",
        icon: (
            <FileUp className="h-full w-full text-neutral-600 dark:text-neutral-300" />
        ),
        href: "/export",
        element: <Export />,
    },
];
// eslint-disable-next-line react-hooks/rules-of-hooks
// const [isSplashVisible, setSplashVisible] = useState(true);

// const handleSplashComplete = () => {
//     setSplashVisible(false); // Esconde a splash após o tempo
// };
function Layout() {
    return (
        <div className="relative flex flex-col h-screen w-screen bg-gray-950">
            <Waves
                lineColor="rgba(125,125,125,1)"
                backgroundColor="rgba(0, 0, 0, 0.2)"
                waveSpeedX={0.02}
                waveSpeedY={0.01}
                waveAmpX={40}
                waveAmpY={20}
                friction={0.9}
                tension={0.01}
                maxCursorMove={120}
                xGap={12}
                yGap={36}
            />
            <Routes>
                {data.map((item, idx) => (
                    <Route key={idx} path={item.href} element={item.element} />
                ))}
            </Routes>
            <div className="fixed bottom-0 left-0 w-full z-50">
                <Dock className="pb-3 mb-5 z-50">
                    {data.map((item, idx) => (
                        <Link to={item.href} key={idx}>
                            <DockItem className="aspect-square rounded-full z-50 bg-gray-200 dark:bg-neutral-800">
                                <DockLabel>{item.title}</DockLabel>
                                <DockIcon>{item.icon}</DockIcon>
                            </DockItem>
                        </Link>
                    ))}
                </Dock>
            </div>
            <Spotlight size={30} />
        </div>
    );
}

function App() {
    return (
        <>
            {" "}
            {/* {isSplashVisible ? (
                <SplashScreen onComplete={handleSplashComplete} />
            ) : ( */}
            <Router>
                <Layout />
            </Router>
            {/* )} */}
        </>
    );
}

export default App;
