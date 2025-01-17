import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "../shadcn/sidebar";
import {
  Calendar,
  FileChartColumnIncreasing,
  FileUp,
  HelpCircle,
  Home,
  LightbulbIcon,
  LucideHome,
  Settings,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
// import { useSidebar } from "../../context/sidebarcontext";

export function AppSidebar({ ...props }) {
  const { open } = useSidebar();
  // Menu items.
  const items = [
    {
      title: "Calendario",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Financeiro",
      url: "/finance",
      icon: FileChartColumnIncreasing,
    },
    {
      title: "Configurações",
      url: "/settings",
      icon: Settings,
    },

    {
      title: "Exportar",
      url: "/export",
      icon: FileUp,
    },
    {
      title: "FeedBack",
      url: "/feedback",
      icon: LightbulbIcon,
    },
    {
      title: "Ajuda",
      url: "/Help",
      icon: HelpCircle,
    },
  ];
  return (
    <Sidebar
      collapsible="icon"
      className="max-h-[calc(97vh-2px)] flex justify-end items-end place-self-end transform"
      {...props}
    >
      <SidebarHeader>
        <AnimatePresence>
          {open ? (
            <Link to={"/"}>
              <motion.h2
                className="font-mono text-2xl font-bold text-center m-5"
                initial={false}
                animate={{
                  opacity: open ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                TruckFlow
              </motion.h2>
            </Link>
          ) : (
            <SidebarMenuItem className="list-none">
              <SidebarMenuButton asChild>
                <LucideHome />
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </AnimatePresence>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent style={{ marginLeft: "5px", marginTop: "10px" }}>
        <SidebarMenu className="">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
