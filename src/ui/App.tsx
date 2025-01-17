import styles from "./App.module.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
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
import TitleBar from "./components/titleBar/titleBar";
import { useEffect, useState } from "react";
import { Button } from "./components/shadcn/button";

import { Toaster } from "sonner";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/shadcn/sidebar";

import { AppSidebar } from "./components/Sidebar/AppSidebar";
import { Separator } from "./components/shadcn/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "./components/shadcn/breadcrumb";
import { Switch } from "./components/shadcn/switch";
import { Label } from "./components/shadcn/label";
import { ThemeProvider, useTheme } from "./components/theme-provider";
import { AnimatePresence, motion } from "framer-motion";

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
];

function BreadcrumbComponent() {
  const location = useLocation();
  const { setTheme } = useTheme();

  const breadcrumbMap = {
    "/": "Dashboard",
    "/driver": "Motorista",
    "/truck": "Caminhão",
    "/tire": "Pneu",
    "/oil": "Filtro de óleo",
    "/fuel": "Combustível",
    "/routes": "Rotas",
    "/export": "Exportar",
    "/calendar": "Calendario",
    "/finances": "Financias",
    "/settings": "Settings",
    "/help": "Help",
    "/feedback": "Feedback",
  };
  const setDarkMode = (isChecked: boolean) => {
    setTheme(!isChecked ? "dark" : "light");
  };
  return (
    <Breadcrumb className="flex justify-between w-full">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>
            {breadcrumbMap[location.pathname as keyof typeof breadcrumbMap]}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
      <div className="flex align-middle gap-2">
        <Switch id="darkmode" onCheckedChange={setDarkMode} />
        <Label htmlFor="darkmode">Modo Escuro</Label>
      </div>
    </Breadcrumb>
  );
}
function Layout() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950">
      <SidebarInset className="min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <BreadcrumbComponent />
        </header>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {data.map((item, idx) => (
              <Route
                key={idx}
                path={item.href}
                element={
                  <motion.div
                    className="h-full"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.element}
                  </motion.div>
                }
              />
            ))}
          </Routes>
        </AnimatePresence>
        <div className="absolute bottom-2 left-1/2 max-w-full -translate-y-8 -translate-x-1/2">
          <Dock className="pb-3 mb-5 z-50">
            {data.map((item, idx) => (
              <Link viewTransition to={item.href} key={idx}>
                <DockItem className="aspect-square rounded-full z-50 bg-gray-200 dark:bg-neutral-800">
                  <DockLabel>{item.title}</DockLabel>
                  <DockIcon>{item.icon}</DockIcon>
                </DockItem>
              </Link>
            ))}
          </Dock>
        </div>
        {/* <Spotlight size={30} /> */}
      </SidebarInset>
    </div>
  );
}

function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);

  const handleSplashComplete = () => {
    setSplashVisible(false); // Esconde a splash após o tempo
  };

  return (
    <div>
      <Router>
        <TitleBar />
        {/* {isSplashVisible ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : ( */}
        <SidebarProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AppSidebar />

            <Layout />
            <Toaster />
          </ThemeProvider>
        </SidebarProvider>
        {/* )} */}
      </Router>
    </div>
  );
}

export default App;
