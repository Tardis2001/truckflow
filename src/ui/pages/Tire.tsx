import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "./Tire.css";
import { truck } from "../../types/truck";
import { tire } from "../../types/switchTire";
function Tire() {
    const [trucks, setTrucks] = useState<truck[]>([]);
    const [tires, setTires] = useState<tire[]>([]);
    const [tire, setTire] = useState<tire>({
        id: undefined,
        dateSwitched: "",
        model: "",
        brand: "",
        truckId: undefined,
    });
    useEffect(() => {
        loadSelect();
    }, []);
    const loadSelect = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.electronApp.getTrucks().then((data: any) => setTrucks(data));
    };
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

        setTire({ ...tire, dateSwitched: value });
    };
    const selectTruck = async (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedTruckId = Number(e.target.value);
        setTire({ ...tire, truckId: selectedTruckId });

        if (!isNaN(selectedTruckId)) {
            try {
                const data = await window.electronApp.getTire(selectedTruckId);
                setTires(data);
            } catch (error) {
                console.error("Erro ao carregar pneus:", error);
            }
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTire({ ...tire, [name]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!tire.truckId) {
            alert("Selecione um caminhão antes de adicionar um pneu.");
            return;
        }

        try {
            await window.electronApp.addTireData(tire);
            setTire({
                id: undefined,
                model: "",
                brand: "",
                dateSwitched: "",
                truckId: tire.truckId,
            });
            await selectTruck({
                target: { value: tire.truckId.toString() },
            } as any);
        } catch (error) {
            console.error("Erro ao adicionar pneu:", error);
        }
    };
    return (
        <>
            <h3 className="title-driver">Troca de Pneu</h3>
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
                            <th>Data de troca</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            {/* <th>TruckID</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {tires.map((tire) => (
                            <tr key={tire.id}>
                                <td>
                                    <strong>{tire.id}</strong>
                                </td>
                                <td>{tire.dateSwitched}</td>
                                <td>{tire.brand}</td>
                                <td>{tire.model}</td>
                                {/* <td>{tire.truckId} </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="box">
                    <h2>Adicionar Troca de Pneu</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="model-box">
                            <input
                                type="text"
                                name="dateSwitched"
                                value={tire.dateSwitched}
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
                                name="brand"
                                value={tire.brand}
                                onChange={handleChange}
                                placeholder=" "
                                required
                            />
                            <label>Marca</label>
                        </div>
                        <div className="model-box">
                            <input
                                type="text"
                                name="model"
                                value={tire.model}
                                onChange={handleChange}
                                placeholder=" "
                                required
                            />
                            <label>Modelo</label>
                        </div>

                        <button className="submit" type="submit">
                            Adicionar
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
export default Tire;
