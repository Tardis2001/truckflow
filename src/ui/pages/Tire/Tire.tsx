import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { truck } from "../../../types/truck";
import { tire } from "../../../types/switchTire";
import styles from "./Tire.module.css";
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
    const [tireUpdate, setTireUpdate] = useState<tire>({
        id: undefined,
        dateSwitched: "",
        model: "",
        brand: "",
        truckId: undefined,
    });
    const [selectedTruckId, setselectedTruckId] = useState<string>("");

    const [tireRemove, settireRemove] = useState<number>(undefined);

    useEffect(() => {
        loadSelect();
    }, []);
    useEffect(() => {
        if (selectedTruckId !== "") {
            const fetchTires = async () => {
                const tireData = await window.electronApp.getTire(
                    Number(selectedTruckId)
                );
                setTires(tireData);
                setTire({ ...tire, truckId: Number(selectedTruckId) });
            };
            fetchTires();
        } else {
            setTires([]);
        }
    }, [selectedTruckId]);
    const selectTruck = (e: ChangeEvent<HTMLSelectElement>) => {
        setselectedTruckId(e.target.value);
    };
    const loadSelect = () => {
        window.electronApp.getTrucks().then((data: truck[]) => setTrucks(data));
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
    const handleUpdateDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        setTireUpdate({ ...tire, dateSwitched: value });
    };

    const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTireUpdate({ ...tireUpdate, [name]: value });
    };
    const handleUpdateSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!selectedTruckId) {
            alert("Selecione um caminhão antes de adicionar um pneu.");
            return;
        }
        try {
            window.electronApp.updateTire(tireUpdate, tireUpdate.truckId);
            setTireUpdate({
                id: undefined,
                dateSwitched: "",
                brand: "",
                model: "",
                truckId: String(selectedTruckId),
            });
        } catch (error) {
            console.error("Erro ao adicionar pneu:", error);
        }
        loadSelect();
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
            selectTruck({
                target: { value: tire.truckId.toString() },
            } as any);
        } catch (error) {
            console.error("Erro ao adicionar pneu:", error);
        }
        loadSelect();
    };

    const handleDeleteChange = (e: ChangeEvent<HTMLInputElement>) => {
        settireRemove(Number(e.target.value.replace(/\D/g, "")));
    };
    const handleDeleteSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!tireRemove) {
            alert("selecione um id de oleo para remover");
            return;
        }
        window.electronApp.removeTire(tireRemove);
        loadSelect();
    };
    return (
        <>
            <h3 className={styles.title}>Troca de Pneu</h3>
            <div className={styles.content}>
                {" "}
                <div className={styles.select_box_tire}>
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
                <div className={styles.box}>
                    <h2>Adicionar Troca de Pneu</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.model_box}>
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
                        <div className={styles.model_box}>
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
                        <div className={styles.model_box}>
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

                        <button className={styles.submit} type="submit">
                            Adicionar
                        </button>
                    </form>
                </div>
                <div className={styles.box}>
                    <h2>Atualizar Troca de Pneu</h2>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="id"
                                value={tireUpdate.id}
                                onChange={handleUpdateChange}
                                maxLength={10}
                                placeholder=" "
                                required
                            />
                            <label>Id</label>
                        </div>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="dateSwitched"
                                value={tireUpdate.dateSwitched}
                                onChange={handleUpdateDateChange}
                                maxLength={10}
                                placeholder=" "
                                required
                            />
                            <label>Data de Troca</label>
                        </div>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="model"
                                value={tireUpdate.model}
                                onChange={handleUpdateChange}
                                placeholder=" "
                                required
                            />
                            <label>Modelo</label>
                        </div>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="brand"
                                value={tireUpdate.brand}
                                onChange={handleUpdateChange}
                                placeholder=" "
                                required
                            />
                            <label>Marca</label>
                        </div>

                        <button className={styles.submit} type="submit">
                            Atualizar
                        </button>
                    </form>
                </div>
                <div className={styles.box}>
                    <h2>Remover Troca de Pneu</h2>
                    <form onSubmit={handleDeleteSubmit}>
                        <div className={styles.model_box}>
                            <input
                                type="number"
                                name="oilIdRemove"
                                value={tireRemove}
                                onChange={handleDeleteChange}
                                maxLength={10}
                                placeholder=" "
                                required
                            />
                            <label>Id</label>
                        </div>
                        <button className={styles.submit} type="submit">
                            Remover
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
export default Tire;
