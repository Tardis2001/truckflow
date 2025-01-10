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
import "./Dashboard.css";
function Dashboard() {
    const [chartData, setChartData] = useState<any>(null);
    const [SelectedMonthYear, setSelectedMonthYear] = useState<string>("");

    useEffect(() => {
        if (SelectedMonthYear) {
            loadChartData();
        }
    }, [SelectedMonthYear]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aggregateData = (data: any[], month_year: string) => {
        return data
            .filter((item) => {
                // Converte o item.dateSwitched para um objeto Date
                const itemDate = new Date(item.dateSwitched);

                // Extrai o ano e o mês da data do item
                const itemYear = itemDate.getFullYear();
                const itemMonth = itemDate.getMonth() + 1; // getMonth() retorna de 0 a 11, por isso adicionamos 1

                // Converte o mês selecionado no formato "YYYY-MM" para ano e mês
                const [selectedYear, selectedMonth] = month_year
                    .split("-")
                    .map(Number);

                // Verifica se o ano e o mês correspondem
                return itemYear === selectedYear && itemMonth === selectedMonth;
            })
            .reduce((acc, curr) => {
                // Conta as ocorrências por marca
                acc[curr.brand] = (acc[curr.brand] || 0) + 1;
                return acc;
            }, {});
    };

    const loadChartData = async () => {
        // Substitua pela função real para buscar os dados
        const rawData = await window.electronApp.getOils();
        console.log("Dados retornados:", rawData); // Verifique aqui se os dados estão corretos

        if (!rawData || rawData.length === 0) {
            console.error("Nenhum dado encontrado.");
            return;
        }

        const aggregatedData = aggregateData(rawData, SelectedMonthYear);
        console.log("Dados agregados:", aggregatedData); // Verifique se a agregação está funcionando

        const labels = Object.keys(aggregatedData); // Nomes das marcas
        const values = Object.values(aggregatedData); // Quantidades

        if (labels.length === 0 || values.length === 0) {
            console.error("Nenhum dado agregável encontrado.");
            return;
        }
        setChartData({
            labels,
            datasets: [
                {
                    label: `Trocas de Filtro - ${SelectedMonthYear}`,
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
        loadChartData();
    };

    return (
        <div className="chart-container">
            <h3 className="title">Gráfico de Trocas de Filtros de Óleo</h3>
            <div className="month-selector">
                <input
                    type="month"
                    onChange={handleMonthChange}
                    value={SelectedMonthYear}
                />
            </div>
            {chartData ? (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: "top" },
                            title: {
                                display: true,
                                text: "Trocas de Filtros de Óleo por Marca",
                            },
                        },
                    }}
                />
            ) : (
                <p>Selecione um mês para visualizar os dados.</p>
            )}
        </div>
    );
}
export default Dashboard;
