import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Legend,
    Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
// import { tire } from "../../types/switchTire";
// import { oil } from "../../types/oil";
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
import styles from "./Dashboard.module.css";
import { oil } from "../../../types/oil";
function Dashboard() {
    const [chartOilData, setChartOilData] = useState<any>(null);
    const [SelectedMonthYear, setSelectedMonthYear] = useState<string>("");

    useEffect(() => {
        if (SelectedMonthYear) {
            loadOilData();
            loadTireData();
        }
    }, []);
    const aggregateData = (
        data: oil[],
        monthYear: string
    ): Record<string, number> => {
        const [inputYear, inputMonth] = monthYear.split("-");
        return data
            .filter((item) => {
                const itemDate = new Date(item.dateSwitched); // Garante que é um objeto Date
                const itemYear = itemDate.getFullYear();
                const itemMonth = String(itemDate.getMonth() + 1).padStart(
                    2,
                    "0"
                );

                return (
                    itemYear === Number(inputYear) && itemMonth === inputMonth
                );
            })
            .reduce<Record<string, number>>((acc, curr) => {
                acc[curr.brand] = (acc[curr.brand] || 0) + 1;
                return acc;
            }, {});
    };

    function formatDateToDDMMYYYY(date: Date): string {
        const day = String(date.getDate()).padStart(2, "0"); // Adiciona zero à esquerda se necessário
        const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth retorna de 0 a 11
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }

    const loadOilData = async () => {
        // Substitua pela função real para buscar os dados
        const rawOilsData = await window.electronApp.getOils();
        console.log("Dados retornados:", rawOilsData); // Verifique aqui se os dados estão corretos
        rawOilsData.filter((oil: oil) => {
            oil.dateSwitched = formatDateToDDMMYYYY(new Date(oil.dateSwitched));
        });
        if (!rawOilsData || rawOilsData.length === 0) {
            console.error("Nenhum dado encontrado.");
            return;
        }

        const aggregatedData = aggregateData(rawOilsData, SelectedMonthYear);
        console.log("Dados agregados:", aggregatedData); // Verifique se a agregação está funcionando

        const labels = Object.keys(aggregatedData); // Nomes das marcas
        const values = Object.values(aggregatedData); // Quantidades

        if (labels.length === 0 || values.length === 0) {
            console.error("Nenhum dado agregável encontrado.");
            return;
        }
        setChartOilData({
            labels,
            datasets: [
                {
                    label: `Marcas de Filtro de oleo - ${SelectedMonthYear}`,
                    data: values,
                    backgroundColor: "rgb(75, 192, 192)",
                    borderColor: "rgb(75, 192, 192)",
                    borderWidth: 1,
                },
            ],
        });
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setSelectedMonthYear(e.target.value);
        loadOilData();
    };

    return (
        <div className={styles.container}>
            <div className={styles.month_selector}>
                <input
                    type="month"
                    onChange={handleMonthChange}
                    value={SelectedMonthYear}
                />
            </div>{" "}
            <div className={styles.chart_container}>
                {chartOilData ? (
                    <Bar
                        data={chartOilData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: "top" },
                            },
                        }}
                    />
                ) : (
                    <p>Selecione um mês para visualizar os dados.</p>
                )}
            </div>
        </div>
    );
}
export default Dashboard;
