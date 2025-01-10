import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "./Truck.css";
import { truck } from "../../types/truck";
import { driver } from "../../types/driver";
function Truck() {
    const [truck, setTruck] = useState<truck>({
        id: undefined,
        plate: "",
        model: "",
        year: undefined,
        driver: [],
    });
    const [trucks, setTrucks] = useState<truck[]>([]);
    const [updateNewTruck, setUpdateNewTruck] = useState<truck>({
        id: undefined,
        plate: "",
        model: "",
        year: undefined,
        driver: [],
    });
    const [drivers, setDrivers] = useState<driver[]>([]);
    const [selectedDrivers, setSelectedDrivers] = useState<driver[]>([]);
    const [updateNewDriverSelected, setupdateNewDriverSelected] = useState<
        driver[]
    >([]);

    useEffect(() => {
        loadTable();
        // window.electronApp.removeAll();
    }, []);
    const loadTable = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.electronApp.getDrivers().then((data: any) => setDrivers(data));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.electronApp.getTrucks().then((data: any) => setTrucks(data));
    };
    const handleTruckChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTruck({ ...truck, [name]: value });
    };

    const handleDriversChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedDriverId = parseInt(e.target.value);
        const driver = drivers.find((d) => d.id === selectedDriverId);

        if (driver && !selectedDrivers.some((d) => d.id === driver.id)) {
            setSelectedDrivers([...selectedDrivers, driver]);
        }
    };
    const handleUpdateTruckChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdateNewTruck({ ...updateNewTruck, [name]: value });
    };

    const handleDriversUpdateChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const updateNewDriverSelectedId = parseInt(e.target.value);
        const driver = drivers.find((d) => d.id === updateNewDriverSelectedId);

        if (
            driver &&
            !updateNewDriverSelected.some((d) => d.id === driver.id)
        ) {
            setupdateNewDriverSelected([...updateNewDriverSelected, driver]);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const UpdateTruck = {
            ...truck,
            driver: selectedDrivers.map((driver) => driver.id),
        };

        window.electronApp.addTruck(UpdateTruck).then(() => {
            setTruck({ id: 0, plate: "", model: "", year: 0 });
            setSelectedDrivers([]);
            loadTable();
        });
    };

    const handleUpdateSubmit = (e: FormEvent) => {
        e.preventDefault();
        window.electronApp.updateTruck(updateNewTruck, updateNewDriverSelected);
        loadTable();
        setUpdateNewTruck({
            id: undefined,
            plate: "",
            model: "",
            year: undefined,
        });
    };
    const removeSelectedDriver = (id: number) => {
        setSelectedDrivers(
            selectedDrivers.filter((driver) => driver.id !== id)
        );
    };
    const removeUpdateSelectedDriver = (id: number) => {
        setupdateNewDriverSelected(
            updateNewDriverSelected.filter((driver) => driver.id !== id)
        );
    };
    const groupDriversByInitial = (drivers: driver[]) => {
        const grouped: { [key: string]: driver[] } = {};

        drivers.forEach((driver) => {
            const initial = driver.name.charAt(0).toUpperCase();
            if (!grouped[initial]) {
                grouped[initial] = [];
            }
            grouped[initial].push(driver);
        });

        for (const initial in grouped) {
            grouped[initial].sort((a, b) => a.name.localeCompare(b.name));
        }

        const sortedGrouped: { [key: string]: driver[] } = {};
        Object.keys(grouped)
            .sort()
            .forEach((key) => {
                sortedGrouped[key] = grouped[key];
            });

        return sortedGrouped;
    };
    const groupedSelectedDrivers = groupDriversByInitial(selectedDrivers);
    const groupednewDriversTruck = groupDriversByInitial(
        updateNewDriverSelected
    );
    return (
        <>
            <h2 className="title-truck">Frota de Caminhões</h2>
            <div className="truck-content">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Placa</th>
                            <th>Modelo</th>
                            <th>Ano</th>
                            <th>Motoristas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trucks.map((truck) => (
                            <tr key={truck.id}>
                                <td>
                                    <strong>{truck.id}</strong>
                                </td>
                                <td>{truck.plate}</td>
                                <td>{truck.model}</td>
                                <td>{truck.year}</td>
                                <td>
                                    <ul className="driver-list">
                                        {Array.isArray(truck.driver) &&
                                        truck.driver.length > 0 ? (
                                            truck.driver.map((driverId) => {
                                                const driverInfo = drivers.find(
                                                    (d) => d.id === driverId
                                                );
                                                return (
                                                    <li
                                                        key={driverId}
                                                        className="driver-item"
                                                    >
                                                        {driverInfo
                                                            ? driverInfo.name
                                                            : "Motorista não encontrado"}
                                                    </li>
                                                );
                                            })
                                        ) : (
                                            <li>Sem motoristas associados</li>
                                        )}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="box">
                    <h2>Adiciona Caminhão</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="model-box">
                            <input
                                type="text"
                                name="plate"
                                value={truck.plate}
                                onChange={handleTruckChange}
                                placeholder=" "
                                required
                            />
                            <label>Placa</label>
                        </div>
                        <div className="model-box">
                            <input
                                type="text"
                                name="model"
                                value={truck.model}
                                placeholder=" "
                                onChange={handleTruckChange}
                                required
                            />
                            <label>Modelo</label>
                        </div>
                        <div className="model-box">
                            <input
                                type="number"
                                name="year"
                                value={truck.year}
                                placeholder=" "
                                onChange={handleTruckChange}
                                required
                            />
                            <label>Ano</label>
                        </div>

                        <div className="select-box">
                            <select onChange={handleDriversChange}>
                                <option value="">Escolha um motorista</option>
                                {drivers.map((driver) => (
                                    <option key={driver.id} value={driver.id}>
                                        {driver.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="driver-list">
                            <label className="select-title">Motoristas:</label>
                            <div className="container">
                                <div className="floating-stack">
                                    {Object.keys(groupedSelectedDrivers).map(
                                        (initial) => (
                                            <dl>
                                                <dt>{initial}</dt>
                                                {groupedSelectedDrivers[
                                                    initial
                                                ].map((driver) => (
                                                    <dd key={driver.id}>
                                                        <div>{driver.name}</div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeSelectedDriver(
                                                                    driver.id
                                                                )
                                                            }
                                                            className="remove-btn"
                                                        >
                                                            X
                                                        </button>
                                                    </dd>
                                                ))}
                                            </dl>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        <button className="submit-truck" type="submit">
                            Adicionar Caminhão
                        </button>
                    </form>
                </div>
                <div className="box">
                    <h2>Atualiza Caminhão</h2>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className="model-box">
                            <input
                                type="text"
                                name="id"
                                value={updateNewTruck.id}
                                placeholder=" "
                                onChange={handleUpdateTruckChange}
                                required
                            />
                            <label>Id</label>
                        </div>
                        <div className="model-box">
                            <input
                                type="text"
                                name="plate"
                                value={updateNewTruck.plate}
                                placeholder=" "
                                onChange={handleUpdateTruckChange}
                                required
                            />
                            <label>Placa</label>
                        </div>
                        <div className="model-box">
                            <input
                                type="text"
                                name="model"
                                value={updateNewTruck.model}
                                placeholder=" "
                                onChange={handleUpdateTruckChange}
                                required
                            />
                            <label>Modelo</label>
                        </div>
                        <div className="model-box">
                            <input
                                type="number"
                                name="year"
                                placeholder=" "
                                value={updateNewTruck.year}
                                onChange={handleUpdateTruckChange}
                                required
                            />
                            <label>Ano</label>
                        </div>

                        <div className="select-box">
                            <select onChange={handleDriversUpdateChange}>
                                <option value="">Escolha um motorista</option>
                                {drivers.map((driver) => (
                                    <option key={driver.id} value={driver.id}>
                                        {driver.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="driver-list">
                            <label className="select-title">Motoristas:</label>
                            <div className="container">
                                <div className="floating-stack">
                                    {Object.keys(groupednewDriversTruck).map(
                                        (initial) => (
                                            <dl>
                                                <dt>{initial}</dt>
                                                {groupednewDriversTruck[
                                                    initial
                                                ].map((driver) => (
                                                    <dd key={driver.id}>
                                                        <div>{driver.name}</div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeUpdateSelectedDriver(
                                                                    driver.id
                                                                )
                                                            }
                                                            className="remove-btn"
                                                        >
                                                            X
                                                        </button>
                                                    </dd>
                                                ))}
                                            </dl>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        <button className="submit-truck" type="submit">
                            Atualiza Caminhão
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
export default Truck;
