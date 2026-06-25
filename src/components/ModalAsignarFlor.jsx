import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import Button from "./Button";
import Select from "./Select";

function ModalAsignarFlor({ onClose, mostrarToast, mostrarError }) {

    const [miembros, setMiembros] = useState([]);
    const [flores, setFlores] = useState([]);
    const [miembroId, setMiembroId] = useState("");
    const [florId, setFlorId] = useState("");

    useEffect(() => {
        cargarDatos();
    }, []);

    async function cargarDatos() {

        const { data: miembrosData } =
            await supabase
                .from("miembros")
                .select("*");

        const { data: floresData } =
            await supabase
                .from("flores")
                .select("*");

        setMiembros(miembrosData || []);
        setFlores(floresData || []);
    }

    async function guardarAsignacion() {
        if (!miembroId || !florId) {
            alert("Por favor, selecciona un miembro y una flor.");
            return;
        }

        const { data: existe } = await supabase
            .from("miembro_flores")
            .select("*")
            .eq("miembro_id", miembroId)
            .eq("flor_id", florId)
            .maybeSingle();

        if (existe) {

            mostrarError("🌷 Este miembro ya tiene esa flor");

            return;
        }

        const { error } =
            await supabase
                .from("miembro_flores")
                .insert([
                    {
                        miembro_id: miembroId,
                        flor_id: florId
                    },
                ]);

        if (error) {
            console.error(error);
            return;
        }

        await cargarDatos();
        mostrarToast(
            " 🌷 Flor asignada correctamente"
        );


        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">
                    🌷 Asignar Flor
                </h2>

                <div className="space-y-4">

                    <Select
                        value={miembroId}
                        onChange={(e) =>
                            setMiembroId(e.target.value)
                        }
                        options={miembros.map((m) => ({
                            value: m.id,
                            label: m.nombre,
                        }))}
                        placeholder="👤 Seleccionar Miembro"
                    />

                    <Select
                        value={florId}
                        onChange={(e) =>
                            setFlorId(e.target.value)
                        }
                        options={flores.map((f) => ({
                            value: f.id,
                            label: f.nombre,
                        }))}
                        placeholder="🌷 Seleccionar Flor"
                    />

                    <div className="flex justify-center gap-3">

                        <Button variant="primary" onClick={guardarAsignacion}>

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

export default ModalAsignarFlor;