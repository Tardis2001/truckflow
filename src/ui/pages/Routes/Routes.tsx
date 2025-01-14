import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { truck } from "../../../types/truck";
import { route } from "../../../types/routes";
import styles from "./Routes.module.css";
function Routes() {
    const [trucks, setTrucks] = useState<truck[]>([]);
    const [Routes, setRoutes] = useState<route[]>([]);
    const [route, setRoute] = useState<route>({
        id: undefined,
        dateSwitched: "",
        model: "",
        brand: "",
        truckId: undefined,
    });
    const [routeUpdate, setRouteUpdate] = useState<route>({
        id: undefined,
        dateInitial: "",
        dateEnd: "",
        truckId: undefined,
    });
    const [selectedTruckId, setselectedTruckId] = useState<string>("");

    const [routeRemove, setRouteRemove] = useState<number>(undefined);

    useEffect(() => {
        loadSelect();
    }, []);
    useEffect(() => {
        if (selectedTruckId !== "") {
            const fetchRoutes = async () => {
                const RouteData = await window.electronApp.getRoute(
                    Number(selectedTruckId)
                );
                setRoutes(RouteData);
                setRoute({ ...route, truckId: Number(selectedTruckId) });
            };
            fetchRoutes();
        } else {
            setRoutes([]);
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
        const name = e.target.name;
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

        setRoute({ ...route, [name]: value });
    };
    const handleUpdateDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        const name = e.target.name;

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

        setRouteUpdate({ ...routeUpdate, [name]: value });
    };

    const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRouteUpdate({ ...routeUpdate, [name]: value });
    };
    const handleUpdateSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!routeUpdate.truckId) {
            alert("Selecione um caminhão antes de adicionar um Rota.");
            return;
        }
        try {
            window.electronApp.updateRoute(routeUpdate, routeUpdate.truckId);
            setRouteUpdate({
                id: undefined,
                dateSwitched: "",
                brand: "",
                model: "",
                truckId: String(selectedTruckId),
            });
        } catch (error) {
            console.error("Erro ao adicionar Rota:", error);
        }
        loadSelect();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRoute({ ...route, [name]: value });
    };
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!route.truckId) {
            alert("Selecione um caminhão antes de adicionar um pneu.");
            return;
        }

        try {
            await window.electronApp.addRouteData(route);
            setRoute({
                id: undefined,
                dateInitial: "",
                dateEnd: "",
                truckId: route.truckId,
            });
            selectTruck({
                target: { value: route.truckId.toString() },
            } as any);
        } catch (error) {
            console.error("Erro ao adicionar rota:", error);
        }
        loadSelect();
    };

    const handleDeleteChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRouteRemove(Number(e.target.value.replace(/\D/g, "")));
    };
    const handleDeleteSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!routeRemove) {
            alert("selecione um id de oleo para remover");
            return;
        }
        window.electronApp.removeRoute(routeRemove);
        loadSelect();
    };
    return (
        <>
            <h3 className={styles.title}>Rotas</h3>
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
                            <th>Data Inicial</th>
                            <th>Data Final</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Routes.map((tire) => (
                            <tr key={tire.id}>
                                <td>
                                    <strong>{tire.id}</strong>
                                </td>
                                <td>{tire.dateInitial}</td>
                                <td>{tire.dateEnd}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.box}>
                    <h2>Adicionar Rota</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="dateInitial"
                                value={route.dateInitial}
                                onChange={handleDateChange}
                                maxLength={10}
                                placeholder=" "
                                required
                            />
                            <label>Data Inicial</label>
                        </div>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="dateEnd"
                                value={route.dateEnd}
                                onChange={handleDateChange}
                                placeholder=" "
                                required
                            />
                            <label>Data Final</label>
                        </div>

                        <button className={styles.submit} type="submit">
                            Adicionar
                        </button>
                    </form>
                </div>
                <div className={styles.box}>
                    <h2>Atualizar Rota</h2>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="id"
                                value={routeUpdate.id}
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
                                name="value={routeUpdate.dateInitial}"
                                value={routeUpdate.dateInitial}
                                onChange={handleUpdateDateChange}
                                maxLength={10}
                                placeholder=" "
                                required
                            />
                            <label>Data Inicial</label>
                        </div>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="dateEnd"
                                value={routeUpdate.dateEnd}
                                onChange={handleUpdateChange}
                                placeholder=" "
                                required
                            />
                            <label>Data Final</label>
                        </div>

                        <button className={styles.submit} type="submit">
                            Atualizar
                        </button>
                    </form>
                </div>
                <div className={styles.box}>
                    <h2>Remover Rota</h2>
                    <form onSubmit={handleDeleteSubmit}>
                        <div className={styles.model_box}>
                            <input
                                type="number"
                                name="routeRemove"
                                value={routeRemove}
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
export default Routes;
