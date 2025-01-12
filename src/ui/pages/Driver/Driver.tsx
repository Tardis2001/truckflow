import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { driver } from "../../../types/driver";
import styles from "./Driver.module.css";
function Driver() {
    const [driver, setDriver] = useState<driver>({
        id: undefined,
        name: "",
        phone: "",
    });
    const [updateDriver, setUpdateDriver] = useState<driver>({
        id: undefined,
        name: "",
        phone: "",
    });
    const [deleteDriverId, setdeleteDriverId] = useState<number>({});
    const [drivers, setDrivers] = useState<driver[]>([]);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDriver({ ...driver, [name]: value });
    };
    const handleUpdateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdateDriver({ ...updateDriver, [name]: value });
    };
    const handleDeleteChange = (e: ChangeEvent<HTMLInputElement>) => {
        setdeleteDriverId(Number(e.target.value));
    };
    useEffect(() => {
        loadDrivers();
    }, []);
    const loadDrivers = async () => {
        const drivers = await window.electronApp.getDrivers();
        setDrivers(drivers);
    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        window.electronApp.addDriver(driver);
        setDriver({ id: undefined, name: "", phone: "" });
        loadDrivers();
    };
    const handleSubmitUpdate = async (e: FormEvent) => {
        e.preventDefault();
        window.electronApp.updateDriver(updateDriver);
        setUpdateDriver({ id: undefined, name: "", phone: "" });
        loadDrivers();
    };
    const handleSubmitDelete = async (e: FormEvent) => {
        e.preventDefault();
        window.electronApp.deleteDriver(deleteDriverId);
        setdeleteDriverId(undefined);
        loadDrivers();
    };
    return (
        <>
            <h2 className={styles.title}>Motoristas</h2>

            <div className={styles.content}>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nome</th>
                            <th>Telefone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map((driver) => (
                            <tr key={driver.id}>
                                <td>
                                    <strong>{driver.id}</strong>
                                </td>
                                <td>
                                    <strong>{driver.name}</strong>
                                </td>
                                <td>
                                    {driver.phone !== "" ? (
                                        <span>{driver.phone}</span>
                                    ) : (
                                        <strong>
                                            Motorista não possui telefone
                                        </strong>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.box}>
                    <h2>Adicionar Motorista</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="name"
                                value={driver.name}
                                onChange={handleChange}
                                placeholder=" "
                                required
                            />
                            <label>Nome</label>
                        </div>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="phone"
                                value={driver.phone}
                                onChange={handleChange}
                                placeholder=" "
                            />
                            <label>Telefone</label>
                        </div>

                        <button className={styles.submit} type="submit">
                            Adicionar
                        </button>
                    </form>
                </div>
                <div className={styles.box}>
                    <h2>Atualiza Motorista</h2>
                    <form onSubmit={handleSubmitUpdate}>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="id"
                                value={updateDriver.id}
                                onChange={handleUpdateChange}
                                placeholder=" "
                                required
                            />
                            <label>Id</label>
                        </div>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="name"
                                value={updateDriver.name}
                                onChange={handleUpdateChange}
                                placeholder=" "
                                required
                            />
                            <label>Nome</label>
                        </div>
                        <div className={styles.model_box}>
                            <input
                                type="number"
                                name="phone"
                                value={updateDriver.phone}
                                onChange={handleUpdateChange}
                                placeholder=" "
                            />
                            <label>Telefone</label>
                        </div>

                        <button className={styles.submit} type="submit">
                            Atualizar
                        </button>
                    </form>
                </div>
                <div className={styles.box}>
                    <h2>Deletar Motorista</h2>
                    <form onSubmit={handleSubmitDelete}>
                        <div className={styles.model_box}>
                            <input
                                type="number"
                                name="id"
                                value={deleteDriverId}
                                onChange={handleDeleteChange}
                                placeholder=" "
                            />
                            <label>Id</label>
                        </div>
                        <button className={styles.submit} type="submit">
                            Deletar
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
export default Driver;
