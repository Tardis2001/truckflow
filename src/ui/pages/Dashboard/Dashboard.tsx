import { useEffect, useState } from "react";
// import { tire } from "../../types/switchTire";
// import { oil } from "../../types/oil";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

import styles from "./Dashboard.module.css";
import { oil } from "../../../types/oil";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/shadcn/card";
import { PieChart, TrendingUp } from "lucide-react";
import { Label } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/shadcn/chart";
import { driver } from "../../../types/driver";
import { truck } from "../../../types/truck";
import { VerticalCutReveal } from "../../components/shadcn/vertical-cut-reveal";
function Dashboard() {
  const [oilBrand, setOilBrand] = useState<string>("");
  const [oilMonthYear, setOilMonthYear] = useState<string>("");
  const [oilChartData, setOilChartData] = useState<any>(null);

  const [tireBrand, setTireBrand] = useState<string>("");
  const [tireMonthYear, setTireMonthYear] = useState<string>("");
  const [tireChartData, setTireChartData] = useState<any>(null);
  const [countDrivers, setCountDrivers] = useState<number>(0);
  const [countTrucks, setCountTrucks] = useState<number>(0);
  const [drivers, setDrivers] = useState<driver[]>();
  const [trucks, setTrucks] = useState<truck[]>();

  const formatDateToDDMMYYYY = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const chartData = [
    { month: "january", visitors: 187, fill: "hsl(210, 70%, 60%)" }, // Azul Frio
    { month: "february", visitors: 200, fill: "hsl(330, 70%, 60%)" }, // Rosa Vibrante
    { month: "march", visitors: 275, fill: "hsl(120, 60%, 50%)" }, // Verde Fresco
    { month: "april", visitors: 173, fill: "hsl(90, 60%, 50%)" }, // Verde Limão
    { month: "may", visitors: 220, fill: "hsl(60, 80%, 50%)" }, // Amarelo Claro
    { month: "june", visitors: 90, fill: "hsl(30, 70%, 60%)" }, // Laranja Quente
    { month: "july", visitors: 187, fill: "hsl(0, 70%, 60%)" }, // Vermelho Vivo
    { month: "august", visitors: 200, fill: "hsl(15, 70%, 50%)" }, // Coral
    { month: "september", visitors: 300, fill: "hsl(35, 60%, 50%)" }, // Bronzeado
    { month: "october", visitors: 250, fill: "hsl(50, 60%, 50%)" }, // Dourado
    { month: "november", visitors: 220, fill: "hsl(220, 50%, 50%)" }, // Azul Profundo
    { month: "december", visitors: 275, fill: "hsl(250, 60%, 60%)" }, // Roxo Gelado
  ];
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    january: {
      label: "January",
      color: "hsl(210, 70%, 60%)", // Azul Frio
    },
    february: {
      label: "February",
      color: "hsl(330, 70%, 60%)", // Rosa Vibrante
    },
    march: {
      label: "March",
      color: "hsl(120, 60%, 50%)", // Verde Fresco
    },
    april: {
      label: "April",
      color: "hsl(90, 60%, 50%)", // Verde Limão
    },
    may: {
      label: "May",
      color: "hsl(60, 80%, 50%)", // Amarelo Claro
    },
    june: {
      label: "June",
      color: "hsl(30, 70%, 60%)", // Laranja Quente
    },
    july: {
      label: "July",
      color: "hsl(0, 70%, 60%)", // Vermelho Vivo
    },
    august: {
      label: "August",
      color: "hsl(15, 70%, 50%)", // Coral
    },
    september: {
      label: "September",
      color: "hsl(35, 60%, 50%)", // Bronzeado
    },
    october: {
      label: "October",
      color: "hsl(50, 60%, 50%)", // Dourado
    },
    november: {
      label: "November",
      color: "hsl(220, 50%, 50%)", // Azul Profundo
    },
    december: {
      label: "December",
      color: "hsl(250, 60%, 60%)", // Roxo Gelado
    },
  } satisfies ChartConfig;

  const filterData = (
    data: Oil[] | Tire[],
    brand: string,
    monthYear: string
  ) => {
    const [year, month] = monthYear.split("-");
    return data.filter((item) => {
      const itemDate = new Date(item.dateSwitched);
      const itemYear = itemDate.getFullYear();
      const itemMonth = String(itemDate.getMonth() + 1).padStart(2, "0");
      return (
        item.brand.toLowerCase() === brand.toLowerCase() &&
        itemYear === Number(year) &&
        itemMonth === month
      );
    });
  };

  const handleOilSearch = async () => {
    if (!oilBrand || !oilMonthYear) return;
    const rawOilData: Oil[] = await window.electronApp.getOils();
    rawOilData.forEach((oil) => {
      oil.dateSwitched = formatDateToDDMMYYYY(new Date(oil.dateSwitched));
    });

    const chartData = [];
    const filteredData = filterData(rawOilData, oilBrand, oilMonthYear);
    const aggregatedData = filteredData.reduce<Record<string, number>>(
      (acc, curr) => {
        acc[curr.model] = (acc[curr.model] || 0) + 1;
        return acc;
      },
      {}
    );
  };
  useEffect(() => {
    const fetchDataCount = async () => {
      try {
        const driverData: driver[] = await window.electronApp.getDrivers();
        const truckData: truck[] = await window.electronApp.getTrucks();
        setDrivers(driverData);
        setTrucks(truckData);
        setCountDrivers(driverData.length); // Atualize o contador
        setCountTrucks(truckData.length); // Atualize o contador
      } catch (error) {
        console.error("Erro ao buscar caminhões e motoristas:", error);
      }
    };

    fetchDataCount();
  }, []);
  return (
    // <div className="h-full w-full flex flex-col items-center justify-center my-auto">
    //   <Card
    //     className="h-full place-self-center mb-2 overflow-hidden"
    //     style={{ width: "95%", height: "80%" }}
    //   >
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 m-24">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Caminhões Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold ">
            {" "}
            <VerticalCutReveal
              splitBy="characters"
              staggerDuration={0.2}
              staggerFrom="first"
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 21,
              }}
            >
              {countTrucks}
            </VerticalCutReveal>
          </p>
        </CardContent>
      </Card>

      {/* Card 2 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Motoristas Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {" "}
            <VerticalCutReveal
              splitBy="characters"
              staggerDuration={0.2}
              staggerFrom="first"
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 21,
              }}
            >
              {countDrivers}
            </VerticalCutReveal>
          </p>
        </CardContent>
      </Card>
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rotas Concluídas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-gray-800">+0</p>
        </CardContent>
      </Card> */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold ">
            {" "}
            <VerticalCutReveal
              splitBy="characters"
              staggerDuration={0.2}
              staggerFrom="first"
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 21,
              }}
            >
              +0
            </VerticalCutReveal>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ganhos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {" "}
            <VerticalCutReveal
              splitBy="characters"
              staggerDuration={0.2}
              staggerFrom="first"
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 21,
              }}
            >
              +0
            </VerticalCutReveal>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Grafico de filtro de oleo</CardTitle>
          <CardDescription>Janeiro - DEzembro 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="visitors"
                strokeWidth={2}
                radius={8}
                activeIndex={2}
                activeBar={({ ...props }) => {
                  return (
                    <Rectangle
                      {...props}
                      fillOpacity={0.8}
                      stroke={props.payload.fill}
                      strokeDasharray={4}
                      strokeDashoffset={4}
                    />
                  );
                }}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Grafico de trocas de pneu</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="visitors"
                strokeWidth={2}
                radius={8}
                activeIndex={2}
                activeBar={({ ...props }) => {
                  return (
                    <Rectangle
                      {...props}
                      fillOpacity={0.8}
                      stroke={props.payload.fill}
                      strokeDasharray={4}
                      strokeDashoffset={4}
                    />
                  );
                }}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
    //   </Card>
    // </div>
  );
}
export default Dashboard;
