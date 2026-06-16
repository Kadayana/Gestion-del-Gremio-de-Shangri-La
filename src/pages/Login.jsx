import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { supabase } from "../services/supabase";
import ModalCambiarClave from "../components/ModalCambiarClave";

function Login({ manejarLogin }) {

    const [nombre, setNombre] = useState("");
    const [clave, setClave] = useState("");
    const [mostrarCambioClave, setMostrarCambioClave] = useState(false);
    const [usuarioActual, setUsuarioActual] = useState(null);
    const navigate = useNavigate();

    async function manejarLogin() {

        const { data, error } =
            await supabase
                .from("miembros")
                .select("*")
                .eq("nombre", nombre)
                .eq("clave", clave)
                .single();

        if (error || !data) {
            alert("❌ Usuario o contraseña incorrectos");
            return;
        }

        if (data.primer_ingreso) {

            setUsuarioActual(data);
            setMostrarCambioClave(true);

            return;
        }

        localStorage.setItem(
            "usuario",
            JSON.stringify(data)
        );

        manejarLogin(data);

        navigate("/");
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">
                    🌸 Iniciar Sesión
                </h2>

                <div className="space-y-4">
                    <Input
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="👤 Nombre"
                    />


                    <Input
                        type="password"
                        value={clave}
                        onChange={(e) => setClave(e.target.value)}
                        placeholder="🔒 Contraseña"
                    />

                    <Button
                        active={location.pathname === "/"}
                        variant="primary"
                        onClick={manejarLogin}
                    >
                        Ingresar
                    </Button>

                </div>

            </div>
            {
                mostrarCambioClave && (
                    <ModalCambiarClave
                        usuario={usuarioActual}
                        onSuccess={(usuarioActualizado) => {

                            localStorage.setItem(
                                "usuario",
                                JSON.stringify(usuarioActualizado)
                            );

                            iniciarSesion(usuarioActualizado);

                            setMostrarCambioClave(false);
                        }}
                    />
                )
            }
        </div>



    );
}



export default Login;