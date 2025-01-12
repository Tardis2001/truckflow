import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";
function Sidebar() {
    return (
        <nav>
            <div className={styles.titulo}>TruckFlow</div>
            <div className={styles.sidebar_items}>
                <Link className={styles.sidebar_button_wrapper} to={"/"}>
                    <button className={styles.sidebar_item}>
                        <img src="src/ui/assets/dashboard.png" /> Dashboard
                    </button>
                </Link>
                <Link to={"/driver"}>
                    <button className={styles.sidebar_item}>
                        {" "}
                        <img src="src/ui/assets/driver.png" /> Motoristas
                    </button>
                </Link>

                <Link to={"/truck"}>
                    <button className={styles.sidebar_item}>
                        <img src="src/ui/assets/delivery.png" /> Caminhões
                    </button>
                </Link>

                <Link to={"/tire"}>
                    <button className={styles.sidebar_item}>
                        <img src="src/ui/assets/wheel.png" />
                        Pneu
                    </button>
                </Link>

                <Link to={"/oil"}>
                    <button className={styles.sidebar_item}>
                        <img src="src/ui/assets/engine-oil.png" />
                        Filtro de Oléo
                    </button>
                </Link>

                <Link to={"/fuel"}>
                    <button className={styles.sidebar_item}>
                        <img src="src/ui/assets/gas-pump.png" />
                        Combustivel
                    </button>
                </Link>

                <Link to={"/routes"}>
                    <button className={styles.sidebar_item}>
                        <img src="src/ui/assets/route.png" />
                        Rotas
                    </button>
                </Link>

                <Link to={"/export"}>
                    <button className={styles.sidebar_item}>
                        <img src="src/ui/assets/export.png" />
                        Exportar
                    </button>
                </Link>
            </div>
        </nav>
    );
}
export default Sidebar;
