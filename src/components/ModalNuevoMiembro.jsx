import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import { supabase } from "../services/supabase";


function ModalNuevaMiembro({ onClose, obtenerMiembros, mostrarToast }) {

    const [nombre, setNombre] = useState("");
    const [rol, setRol] = useState("");


    async function guardarMiembro() {
        if (!nombre || !rol) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const { error } =
            await supabase
                .from("miembros")
                .insert([
                    {
                        nombre,
                        rol
                    },
                ]);

        if (error) {
            console.error(error);
            return;
        }

        await obtenerMiembros();
        mostrarToast(
            "🙋🏼‍♀️ Miembro agregado Correctamente"
        );

        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">
                    🌸 Agregar Miembro
                </h2>

                <div className="space-y-4">

                    <Input
                        value={nombre}
                        onChange={(e) =>
                            setNombre(e.target.value)
                        }
                        placeholder="🌸 Nombre del miembro"
                    />

                    <Select
                        value={rol}
                        onChange={(e) =>
                            setRol(e.target.value)
                        }
                        
                        options={[
                            {
                                value: "Lider",
                                label: "👑 Lider",
                            },
                            {
                                value: "Colider",
                                label: "⚔️ Colider",
                            },
                            {
                                value: "Veterano",
                                label: "💎 Veterano",
                            },
                            {
                                value: "Elite",
                                label: "🤝 Elite",
                            },
                            {
                                value: "Miembro",
                                label: "🌸 Miembro",
                            },
                        ]}
                        placeholder="Seleccionar rol"
                        
                    />

                    <div className="flex gap-3 justify-center">

                        <Button variant="primary"
                            onClick={guardarMiembro}
                        >
                            🌷 Guardar
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>

                    </div>


                </div>

            </div>

        </div>
    );
}

export default ModalNuevaMiembro;