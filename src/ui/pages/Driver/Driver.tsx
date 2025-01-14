import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { driver } from "../../../types/driver";
import styles from "./Driver.module.css";
import { motion } from "motion/react";
import StarBorder from "../../components/StarBorder/Starborder";
import { LucideDelete, LucideEdit, LucideSave } from "lucide-react";

function Driver() {
    const [driver, setDriver] = useState<driver>({
        id: undefined,
        name: "",
        phone: "",
    });
    const [editRow, setEditRow] = useState<number | null>(null);
    const [editedValue, setEditedValue] = useState<driver>({
        id: 0,
        name: "",
        phone: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [drivers, setDrivers] = useState<driver[]>([]);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = drivers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(drivers.length / itemsPerPage);
    useEffect(() => {
        loadDrivers();
    }, []);
    const loadDrivers = async () => {
        const drivers = await window.electronApp.getDrivers();
        setDrivers(drivers);
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDriver({ ...driver, [name]: value });
    };
    const handleEdit = (index: number) => {
        setEditRow(index);
        setEditedValue(drivers[index]);
    };
    const saveEdit = (index: number) => {
        // const updatedDrivers = [...drivers];
        // updatedDrivers[index] = { ...updatedDrivers[index], ...editedValue };
        // setDrivers(updatedDrivers);

        window.electronApp.updateDriver(editedValue);
        setEditRow(-1);

        loadDrivers();
    };

    const handleDelete = (id: number) => {
        console.log(id);
        window.electronApp.deleteDriver(id);
        loadDrivers();
    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        window.electronApp.addDriver(driver);
        setDriver({ id: undefined, name: "", phone: "" });
        loadDrivers();
    };
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setItemsPerPage(Number(event.target.value));
    };

    return (
        <>
            {/* <h2 className={styles.title}>Motoristas</h2> */}

            <div
                className={
                    "flex-col pt-10 w-screen h-screen justify-center items-center overflow-auto p-10 flex " +
                    styles.box
                }
            >
                <div className="h-96">
                    {/* <h2 className="text-4xl font-mono font-semibold">
                        Adicionar Motorista
                    </h2> */}
                    <form onSubmit={handleSubmit}>
                        <div className={"w-full " + styles.model_box}>
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
                        <div className={"w-full " + styles.model_box}>
                            <input
                                type="text"
                                name="phone"
                                value={driver.phone}
                                onChange={handleChange}
                                placeholder=" "
                            />
                            <label>Telefone</label>
                        </div>
                        <StarBorder>Enviar</StarBorder>
                    </form>
                </div>

                <div className="flex justify-center items-center mt-4 mb-10">
                    <div className="flex items-center p-2 rounded-full bg-gray-100 shadow-md">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 text-sm ${
                                currentPage === 1
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-blue-600 hover:bg-blue-100"
                            } rounded-l-full`}
                        >
                            Anterior
                        </button>

                        <span className="px-6 py-2 bg-gray-100 text-black text-sm font-semibold text-center">
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 text-sm ${
                                currentPage === totalPages
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-blue-600 hover:bg-blue-100"
                            } rounded-r-full`}
                        >
                            Próximo
                        </button>
                    </div>

                    {/* Itens por página */}
                    <div className="ml-4">
                        <select
                            id="itemsPerPage"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="border p-2 rounded"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </div>
                </div>
                <motion.div
                    className="w-full flex justify-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <table className="w-4/5 table-auto text-gray-800">
                        <thead>
                            <tr className="bg-gray-200/50">
                                <th className="px-6 py-3 text-left font-bold">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left font-bold">
                                    Nome
                                </th>
                                <th className="px-6 py-3 text-left font-bold">
                                    Telefone
                                </th>
                                <th className="px-6 py-3 text-center font-bold">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <motion.tbody
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.2 }}
                        >
                            {currentItems.map((driver, index) => (
                                <motion.tr
                                    key={driver.id}
                                    // className=" hover:bg-gray-100/50"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <td className="text-3xl w-36">
                                        {driver.id}
                                    </td>
                                    <td className="text-3xl w-36 p-0 h-16">
                                        {editRow === index ? (
                                            <input
                                                type="text"
                                                className="w-36 h-16 py-10 px-5 bg-transparent text-3xl border-none outline-none"
                                                value={editedValue.name}
                                                onChange={(e) =>
                                                    setEditedValue({
                                                        ...editedValue,
                                                        name: e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            driver.name
                                        )}
                                    </td>
                                    <td className="text-3xl w-36 p-0">
                                        {editRow === index ? (
                                            <input
                                                type="text"
                                                value={editedValue.phone}
                                                onChange={(e) =>
                                                    setEditedValue({
                                                        ...editedValue,
                                                        phone: e.target.value,
                                                    })
                                                }
                                                className=" w-36 h-16 py-10 px-5 bg-transparent text-3xl border-none outline-none"
                                            />
                                        ) : (
                                            driver.phone
                                        )}
                                    </td>
                                    <td className="text-center w-16">
                                        {editRow === index ? (
                                            <motion.button
                                                className="p-4 text-white bg-green-500 rounded-full shadow hover:bg-green-600"
                                                onClick={() => saveEdit(index)}
                                                initial={{ scale: 1 }}
                                                whileHover={{ scale: 1.2 }}
                                                transition={{
                                                    duration: 0.8,
                                                }}
                                            >
                                                <LucideSave />
                                            </motion.button>
                                        ) : (
                                            <div className="flex gap-5 justify-center">
                                                <motion.button
                                                    className="p-4 text-white bg-blue-500 rounded-full shadow hover:bg-blue-600"
                                                    onClick={() =>
                                                        handleEdit(index)
                                                    }
                                                    initial={{ scale: 1 }}
                                                    whileHover={{ scale: 1.2 }}
                                                    transition={{
                                                        duration: 0.4,
                                                    }}
                                                >
                                                    <LucideEdit />
                                                </motion.button>
                                                <motion.button
                                                    className="p-4 text-white bg-red-500 rounded-full shadow hover:bg-red-600"
                                                    onClick={() =>
                                                        handleDelete(driver.id)
                                                    }
                                                    initial={{ scale: 1 }}
                                                    whileHover={{ scale: 1.2 }}
                                                    transition={{
                                                        duration: 0.4,
                                                    }}
                                                >
                                                    <LucideDelete />
                                                </motion.button>
                                            </div>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </motion.tbody>
                    </table>
                </motion.div>
            </div>
        </>
    );
}

export default Driver;
