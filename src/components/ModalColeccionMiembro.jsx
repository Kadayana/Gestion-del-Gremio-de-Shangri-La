import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import FlorCard from "./FlorCard";
import Toast from "../components/SuccessModal";
import ModalConfirmacion from "../components/ModalConfirmacion";

function ModalColeccionMiembro({
miembro,
usuario,
onClose,
}) {


const [flores, setFlores] = useState([]);
const [toast, setToast] = useState("");
const [florEliminar, setFlorEliminar] = useState(null);

useEffect(() => {
    obtenerFloresMiembro();
}, []);

function mostrarToast(mensaje) {

    setToast(mensaje);

    setTimeout(() => {
        setToast("");
    }, 3000);
}

async function obtenerFloresMiembro() {

    const { data, error } =
        await supabase
            .from("miembro_flores")
            .select(`
                id,
                flores (
                    id,
                    nombre,
                    rareza,
                    imagen
                )
            `)
            .eq("miembro_id", miembro.id);

    if (!error) {
        setFlores(data);
    }
}

function solicitarEliminar(item) {

    setFlorEliminar(item);

}

async function eliminarFlorMiembro(id) {

    const { error } =
        await supabase
            .from("miembro_flores")
            .delete()
            .eq("id", id);

    if (error) {
        console.error(error);
        return;
    }

    mostrarToast(
        "🗑️ Flor eliminada"
    );

    setFlorEliminar(null);

    obtenerFloresMiembro();
}

return (
    <div
        className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
        onClick={onClose}
    >

        <div
            className="
                bg-white
                rounded-3xl
                shadow-xl
                p-4 md:p-6
                w-[95%]
                max-w-5xl
                max-h-[85vh]
                overflow-y-auto
            "
            onClick={(e) => e.stopPropagation()}
        >

            <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
                🌷 Colección de {miembro.nombre}
            </h2>

            {
                flores.length === 0 ? (

                    <p className="text-center text-gray-500">
                        Este miembro aún no tiene flores.
                    </p>

                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {flores.map((item) => (

                            <FlorCard
                                key={item.id}
                                flor={item.flores}
                                usuario={usuario}
                                onEliminar={() =>
                                    solicitarEliminar(item)
                                }
                            />

                        ))}

                    </div>

                )
            }

            {
                toast && (
                    <Toast mensaje={toast} />
                )
            }

            {
                florEliminar && (
                    <ModalConfirmacion
                        titulo="🗑️ Eliminar Asignación"
                        mensaje={`¿Deseas quitar la flor "${florEliminar.flores.nombre}" de ${miembro.nombre}?`}
                        onClose={() =>
                            setFlorEliminar(null)
                        }
                        onConfirm={() =>
                            eliminarFlorMiembro(
                                florEliminar.id
                            )
                        }
                    />
                )
            }

        </div>

    </div>
);


}

export default ModalColeccionMiembro;
