import { Link, useLocation } from "react-router-dom";
import Button from "./Button";

function Navbar(usuario) {

    const location = useLocation();

    function cerrarSesion() {

        localStorage.removeItem("usuario");

        window.location.reload();
    }


    return (
        <div className="p-3 justify-center flex fixed top-0 left-0 right-0 z-50">
            <div className="bg-gradient-to-r from-pink-200 to-pink-400 shadow-md rounded-4xl w-200">
                <div className="container p-5 mx-auto flex gap-3 justify-center ">

                    <div className="flex items-center gap-4">

                    <div className="text-right">
                        <p className="font-semibold">
                            👤 {usuario.nombre}
                        </p>

                        <p className="text-sm text-gray-500">
                            {usuario.rol}
                        </p>
                    </div>

                    <Button variant="danger" onClick={cerrarSesion}>
                        🚪 
                    </Button>

                </div>

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

                
            </div>
        </div>

    );
}

export default Navbar;