import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { truck } from "../../../types/truck";
import { oil } from "../../../types/oil";
import styles from "./Oil.module.css";
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
    const [updateoil, setupdateoil] = useState<oil>({
        id: undefined,
        dateSwitched: "",
        model: "",
        brand: "",
        truckId: undefined,
    });
    const [selectedTruckId, setselectedTruckId] = useState<string>("");
    const [oilremove, setOilremove] = useState<number>(undefined);
    useEffect(() => {
        loadSelect();
        // window.electronApp.openDialog();
    }, []);
    const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setupdateoil({ ...updateoil, [name]: value });
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

        setOil({ ...oil, dateSwitched: value });
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

        setupdateoil({ ...updateoil, dateSwitched: value });
    };
    useEffect(() => {
        if (selectedTruckId !== "") {
            const fetchOils = async () => {
                const oilsData = await window.electronApp.getOil(
                    Number(selectedTruckId)
                );
                setOils(oilsData);
                setOil({ ...oil, truckId: Number(selectedTruckId) });
            };
            fetchOils();
        } else {
            setOils([]); // Reseta óleos quando nenhum caminhão está selecionado
        }
    }, [selectedTruckId]); // Reexecuta quando `selectedTruckId` muda
    const selectTruck = (e: ChangeEvent<HTMLSelectElement>) => {
        setselectedTruckId(e.target.value);
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
    // const selectTruck = async (e: ChangeEvent<HTMLSelectElement>) => {
    //     const selectedValue = e.target.value;
    //     console.log(selectedValue);

    //     console.log(selectedTruckId);
    //     if (selectedValue === "") {
    //         setselectedTruckId(0); // Ou um valor que represente "nenhum caminhão selecionado"
    //         // setOil({ ...oil, truckId: undefined });
    //         console.log(oils);
    //         setOils([]);
    //         console.log(oils);
    //         return;
    //     }

    //     setselectedTruckId(Number(selectedValue)); // Ou um valor que represente "nenhum caminhão selecionado"
    //     console.log(selectedTruckId);

    //     const oilsData = await window.electronApp.getOil(Number(selectedValue));
    //     setOils(oilsData);
    // };
    const handleUpdateSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!selectedTruckId) {
            alert("Selecione um caminhão antes de adicionar um pneu.");
            return;
        }
        try {
            window.electronApp.updateOil(updateoil, updateoil.truckId);
            setupdateoil({
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
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!selectedTruckId) {
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
                truckId: Number(selectedTruckId),
            });
        } catch (error) {
            console.error("Erro ao adicionar pneu:", error);
        }
        loadSelect();
    };

    const handleDeleteChange = (e: ChangeEvent<HTMLInputElement>) => {
        setOilremove(Number(e.target.value.replace(/\D/g, "")));
    };
    const handleDeleteSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!oilremove) {
            alert("selecione um id de oleo para remover");
            return;
        }
        window.electronApp.deleteOil(oilremove);
        loadSelect();
    };

    return (
        <>
            <h3 className={styles.title}>Troca de filtro de oleo</h3>
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
                            <th>Data Troca</th>
                            <th>Marca</th>
                            <th>Modelo</th>
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
                                <td>{oil.brand} </td>
                                <td>{oil.model} </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.box}>
                    <h2>Adicionar Troca de filtro de oleo</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.model_box}>
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
                        <div className={styles.model_box}>
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
                        <div className={styles.model_box}>
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

                        <button className={styles.submit} type="submit">
                            Adicionar
                        </button>
                    </form>
                </div>
                <div className={styles.box}>
                    <h2>Atualizar Troca de filtro de oleo</h2>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="id"
                                value={updateoil.id}
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
                                value={updateoil.dateSwitched}
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
                                value={updateoil.model}
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
                                value={updateoil.brand}
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
                    <h2>Remover Troca de filtro de oleo</h2>
                    <form onSubmit={handleDeleteSubmit}>
                        <div className={styles.model_box}>
                            <input
                                type="number"
                                name="oilIdRemove"
                                value={oilremove}
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
export default Oil;
