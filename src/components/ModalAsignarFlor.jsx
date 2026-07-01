import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import Button from "./Button";
import Select from "./Select";

function ModalAsignarFlor({ onClose, mostrarToast, mostrarError }) {

    const [miembros, setMiembros] = useState([]);
    const [flores, setFlores] = useState([]);
    const [miembroId, setMiembroId] = useState("");
    const [floresSeleccionadas, setFloresSeleccionadas] = useState([]);
    const [floresDisponibles, setFloresDisponibles] = useState([]);

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

    useEffect(() => {
        if (miembroId) {
            cargarFloresDisponibles();
        }
    }, [miembroId, flores]);


    async function cargarFloresDisponibles() {

        const { data } = await supabase
            .from("miembro_flores")
            .select("flor_id")
            .eq("miembro_id", miembroId);

        const idsAsignadas =
            data.map(f => f.flor_id);

        const disponibles =
            flores.filter(
                flor => !idsAsignadas.includes(flor.id)
            );

        setFloresDisponibles(disponibles);
    }

    function seleccionarFlor(id) {

        if (
            floresSeleccionadas.includes(id)
        ) {

            setFloresSeleccionadas(
                floresSeleccionadas.filter(
                    flor => flor !== id
                )
            );

        } else {

            setFloresSeleccionadas([
                ...floresSeleccionadas,
                id
            ]);

        }

    }

    useEffect(() => {

        setFloresSeleccionadas([]);

    }, [miembroId]);

    async function guardarAsignacion() {
        if (
            !miembroId ||
            floresSeleccionadas.length === 0
        ) {
            alert("Por favor, selecciona un miembro y una flor.");
            return;
        }



        const registros =
            floresSeleccionadas.map(id => ({
                miembro_id: miembroId,
                flor_id: id
            }));

        const { error } =
            await supabase
                .from("miembro_flores")
                .insert(registros);

        if (error) {
            console.error(error);
            return;
        }

        await cargarDatos();
        mostrarToast(
            `🌷 ${floresSeleccionadas.length} flores asignadas`
        );

        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white rounded-3xl shadow-xl p-6 w-[88%] max-w-md">

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

                    <div>

                        <h3 className="font-semibold mb-3">
                            🌸 Selecciona las flores
                        </h3>



                        <div className="
        grid
        grid-cols-2
        gap-3
        max-h-72
        overflow-y-auto
    ">

                            {
                                floresDisponibles.map(flor => {

                                    const activa =
                                        floresSeleccionadas.includes(flor.id);

                                    return (



                                        <button
                                            type="button"
                                            key={flor.id}
                                            onClick={() =>
                                                seleccionarFlor(flor.id)
                                            }
                                            className={`
                            rounded-2xl
                            border-2
                            p-3
                            transition

                            ${activa
                                                    ? "border-pink-500 bg-pink-100"
                                                    : "border-gray-200 bg-white"
                                                }
                        `}
                                        >

                                            

                                            <p className="font-medium mt-2">
                                                {flor.nombre}
                                            </p>

                                        </button>

                                    );

                                })
                            }

                        </div>

                    </div>

                    <p className="text-center text-gray-500">

                        🌸 Seleccionadas:
                        
                        <b>
                            {floresSeleccionadas.length}
                        </b>

                    </p>

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