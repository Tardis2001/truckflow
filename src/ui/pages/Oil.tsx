import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { truck } from "../../types/truck";
import { oil } from "../../types/oil";

function Oil() {
    const [trucks, setTrucks] = useState<truck[]>([]);
    const [oils, setOils] = useState<oil[]>([]);
    const [oil, setOil] = useState<oil>({
        id: undefined,
        dateSwitched: "",
        model: "",
        brand: "",
        truckId: undefined,
    });

    useEffect(() => {
        loadSelect();
        // window.electronApp.openDialog();
    }, []);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Remove qualquer caractere que não seja número
        value = value.replace(/\D/g, "");

        // Aplica a máscara DD/MM/YYYY
        if (value.length > 2) {
            value = value.slice(0, 2) + "/" + value.slice(2);
        }
        if (value.length > 5) {
            value = value.slice(0, 5) + "/" + value.slice(5);
        }

        // Limita o tamanho a 10 caracteres (DD/MM/YYYY)
        if (value.length > 10) {
            value = value.slice(0, 10);
        }

        setOil({ ...oil, dateSwitched: value });
    };
    // useEffect(() => {
    //     // Função que solicita o cálculo da próxima troca de óleo ao processo principal
    //     async function getNextOilChange() {
    //         // setNextOilChangeDate(nextDate); // Atualiza o estado com a próxima data de troca
    //     }

    //     getNextOilChange(); // Chama a função para calcular
    // }, [lastOilChangeDate, howManyDays]);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOil({ ...oil, [name]: value });
    };
    const loadSelect = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.electronApp.getTrucks().then((data: any) => setTrucks(data));
    };
    const selectTruck = async (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedTruckId = Number(e.target.value);
        setOil({ ...oil, truckId: selectedTruckId });

        if (!isNaN(selectedTruckId)) {
            try {
                const data = await window.electronApp.getOil(selectedTruckId);
                setOils(data);
            } catch (error) {
                console.error("Erro ao carregar pneus:", error);
            }
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!oil.truckId) {
            alert("Selecione um caminhão antes de adicionar um pneu.");
            return;
        }

        try {
            await window.electronApp.addOil(oil);
            setOil({
                id: undefined,
                dateSwitched: "",
                brand: "",
                model: "",
                truckId: oil.truckId,
            });
            await selectTruck({
                target: { value: oil.truckId.toString() },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
        } catch (error) {
            console.error("Erro ao adicionar pneu:", error);
        }
    };
    return (
        <>
            <h3 className="title-driver">Troca de filtro de oleo</h3>
            <div className="driver-content">
                {" "}
                <div className="select-box-tire">
                    <select onChange={selectTruck}>
                        <option value="">Escolha um caminhão</option>
                        {trucks.map((truck) => (
                            <option key={truck.id} value={truck.id}>
                                Id: {truck.id} / Placa: {truck.plate}
                            </option>
                        ))}
                    </select>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Data Troca</th>
                            {/* <th>Proxima troca</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {oils.map((oil) => (
                            <tr key={oil.id}>
                                <td>
                                    <strong>{oil.id}</strong>
                                </td>
                                <td>{oil.dateSwitched}</td>
                                {/* <td>{oil.dateNext} </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="box">
                    <h2>Adicionar Troca de filtro de oleo</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="model-box">
                            <input
                                type="text"
                                name="dateSwitched"
                                value={oil.dateSwitched}
                                onChange={handleDateChange}
                                maxLength={10}
                                placeholder=" "
                                required
                            />
                            <label>Data de Troca</label>
                        </div>
                        <div className="model-box">
                            <input
                                type="text"
                                name="model"
                                value={oil.model}
                                onChange={handleChange}
                                placeholder=" "
                                required
                            />
                            <label>Modelo</label>
                        </div>
                        <div className="model-box">
                            <input
                                type="text"
                                name="brand"
                                value={oil.brand}
                                onChange={handleChange}
                                placeholder=" "
                                required
                            />
                            <label>Marca</label>
                        </div>
                        {/* <div className="model-box">
                            <input
                                type="text"
                                name="truckId"
                                value={oil.truckId}
                                onChange={handleChange}
                                placeholder=" "
                                required
                            />
                            <label>TruckId</label>
                        </div> */}

                        <button className="submit" type="submit">
                            Adicionar
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
export default Oil;
