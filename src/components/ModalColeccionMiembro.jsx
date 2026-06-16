import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import FlorCard from "./FlorCard";


function ModalColeccionMiembro({
    miembro,
    onClose,
}) {

    const [flores, setFlores] = useState([]);

    useEffect(() => {
        obtenerFloresMiembro();
    }, []);

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

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 " onClick={onClose}>

            <div className=" bg-white
                rounded-3xl
                shadow-xl
                p-6
                w-full
                max-w-5xl
                max-h-[80vh]
                overflow-y-auto
            " onClick={(e) => e.stopPropagation()}>

                <h2 className="text-2xl font-bold text-center mb-4">
                    🌷 Colección de {miembro.nombre}
                </h2>


                {
                    flores.length === 0 ? (

                        <p className="text-center text-gray-500">
                            Este miembro aún no tiene flores.
                        </p>

                    ) : (

                        <div className="grid md:grid-cols-3 gap-4">

                            {flores.map((item) => (

                                <FlorCard
                                    key={item.id}
                                    flor={item.flores}
                                />

                            ))}

                        </div>

                    )
                }

            </div>
        </div>
    );
}

export default ModalColeccionMiembro;