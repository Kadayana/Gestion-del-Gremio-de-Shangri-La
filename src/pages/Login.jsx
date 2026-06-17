import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { supabase } from "../services/supabase";
import ModalCambiarClave from "../components/ModalCambiarClave";

function Login({ iniciarSesion }) {

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

        iniciarSesion(data);

        navigate("/");
    }

    return (
        <div className=" min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-purple-200 flex justify-center items-center p-4">

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md">

                <div className="text-center mb-6">
                    <div className="text-6xl mb-3">
                        🌸
                    </div>

                    <h1 className="text-4xl font-bold text-pink-600">
                        Shangri-La
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Sistema de gestión del gremio
                    </p>
                </div>

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

                    <div className="flex justify-center">
                        <Button
                            variant="primary"
                            onClick={manejarLogin}
                        >
                            Ingresar
                        </Button>
                    </div>
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

                            navigate("/");
                        }}
                    />
                )
            }
        </div>



    );
}



export default Login;