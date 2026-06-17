import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "./Button";

function Navbar({ usuario }) {

    const location = useLocation();
    const [menuAbierto, setMenuAbierto] = useState(false);

    const iconos = {
        Lider: "👑",
        Colider: "⚔️",
        Veterano: "💎",
        Elite: "🤝",
        Miembro: "🌸",
    };

    function cerrarSesion() {

        localStorage.removeItem("usuario");

        window.location.reload();
    }


    return (
        <div className="p-3 justify-center flex fixed top-0 left-0 right-0 z-50">
            <div className="bg-gradient-to-r from-pink-200 to-pink-400 shadow-md rounded-4xl w-full max-w-7xl">
                <div className="p-4 flex items-center justify-between">

                    <div className="font-bold text-xl text-black">
                        🌸 Shangri-La
                    </div>

                    <div className="hidden md:flex gap-3">

                        <Link to="/">
                            <Button
                                active={location.pathname === "/"}
                            >
                                🏠 Inicio
                            </Button>
                        </Link>

                        <Link to="/flores">
                            <Button
                                active={location.pathname === "/flores"}
                            >
                                🌸 Flores
                            </Button>
                        </Link>

                        <Link to="/miembros">
                            <Button
                                active={location.pathname === "/miembros"}
                            >
                                👥 Miembros
                            </Button>
                        </Link>

                        <Link to="/coleccion">
                            <Button
                                active={location.pathname === "/coleccion"}
                            >
                                🌷 Colección
                            </Button>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-4">

                        <div className="text-right">
                            <p className="text-sm  text-gray-500">
                                {iconos[usuario.rol]}
                            </p>

                            <p className="font-semibold">
                                {usuario.nombre}
                            </p>
                        </div>

                        <Button variant="danger" onClick={cerrarSesion}>
                            📤
                        </Button>

                    </div>

                    <button
                        className="md:hidden text-3xl"
                        onClick={() =>
                            setMenuAbierto(!menuAbierto)
                        }
                    >
                        ☰
                    </button>

                    {
                        menuAbierto && (
                            <div
                                className="
                md:hidden
                flex
                flex-col
                gap-2
                p-4
                border-t
                border-pink-300
            "
                            >

                                <Link to="/">
                                    <Button>
                                        🏠 Inicio
                                    </Button>
                                </Link>

                                <Link to="/flores">
                                    <Button>
                                        🌸 Flores
                                    </Button>
                                </Link>

                                <Link to="/miembros">
                                    <Button>
                                        👥 Miembros
                                    </Button>
                                </Link>

                                <Link to="/coleccion">
                                    <Button>
                                        🌷 Colección
                                    </Button>
                                </Link>

                                <div className="text-center mt-2">
                                    <p>
                                        {iconos[usuario.rol]} {usuario.nombre}
                                    </p>
                                </div>

                                <Button
                                    variant="danger"
                                    onClick={cerrarSesion}
                                >
                                    📤 Cerrar sesión
                                </Button>

                            </div>
                        )
                    }

                </div>
            </div>
        </div>

    );
}

export default Navbar;