import { Link } from "react-router-dom";
import "./Sidebar.css";
function Sidebar() {
    return (
        <nav>
            <div className="titulo-sidebar">TruckFlow</div>
            <div className="sidebar-items">
                <Link to={"/"}>
                    <button className="sidebar-button"> Dashboard</button>
                </Link>
                <Link to={"/driver"}>
                    <button className="sidebar-button"> Motoristas</button>
                </Link>

                <Link to={"/truck"}>
                    <button className="sidebar-button"> Caminhões</button>
                </Link>

                <Link to={"/tire"}>
                    <button className="sidebar-button">Pneu</button>
                </Link>

                <Link to={"/oil"}>
                    <button className="sidebar-button">Filtro de Oléo</button>
                </Link>

                <Link to={"/fuel"}>
                    <button className="sidebar-button">Combustivel</button>
                </Link>

                <Link to={"/routes"}>
                    <button className="sidebar-button">Rotas</button>
                </Link>

                <Link to={"/export"}>
                    <button className="sidebar-button"> Exportar</button>
                </Link>
            </div>
        </nav>
    );
}
export default Sidebar;
