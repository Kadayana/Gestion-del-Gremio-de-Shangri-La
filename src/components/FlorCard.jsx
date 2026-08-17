function FlorCard({
    flor,
    onEliminar,
    onEditar,
    onMandarAObjetivos,
    mostrarEstado = false,
}) {

    const colores = {
        R: "bg-blue-100 text-blue-700",
        SR: "bg-purple-100 text-purple-700",
        SSR: "bg-yellow-100 text-yellow-700",
        UR: "bg-red-100 text-red-700",
    };


    const nombresRareza = {
        R: "R - Rara",
        SR: "SR - Super Rara",
        SSR: "SSR - Super Super Rara",
        UR: "UR - Ultra Rara",
    };


    const estado = flor.conseguida
        ? {
            texto: "✅ Conseguida",
            estilo: "bg-green-100 text-green-700",
        }
        : {
            texto: "❌ Sin conseguir",
            estilo: "bg-gray-100 text-gray-600",
        };


    return (

        <div
            className="
                bg-pink-50
                rounded-3xl
                shadow
                p-4
                hover:shadow-lg
                transition
                hover:-translate-y-1
                w-full
                max-w-[280px]
                mx-auto
            "
        >


            {/* RAREZA Y ACCIONES */}

            <div className="flex justify-between items-center mb-4">

                <span
                    className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-medium
                        ${colores[flor.rareza]}
                    `}
                >
                    {nombresRareza[flor.rareza]}
                </span>


                <div className="flex gap-2">

                    {/* MANDAR A OBJETIVOS */}

                    {onMandarAObjetivos && (

                        <button
                            onClick={() =>
                                onMandarAObjetivos(flor)
                            }
                            title="Mandar a objetivos"
                            className="
                                w-8
                                h-8
                                rounded-xl
                                bg-purple-200
                                hover:bg-purple-400
                                transition
                            "
                        >
                            🎯
                        </button>

                    )}


                    {/* EDITAR */}

                    {onEditar && (

                        <button
                            onClick={() =>
                                onEditar(flor)
                            }
                            title="Editar flor"
                            className="
                                w-8
                                h-8
                                rounded-xl
                                bg-yellow-200
                                hover:bg-yellow-400
                                transition
                            "
                        >
                            ✏️
                        </button>

                    )}


                    {/* ELIMINAR */}

                    {onEliminar && (

                        <button
                            onClick={onEliminar}
                            title="Eliminar flor"
                            className="
                                w-8
                                h-8
                                rounded-xl
                                bg-red-200
                                hover:bg-red-400
                                transition
                            "
                        >
                            🗑️
                        </button>

                    )}

                </div>

            </div>


            {/* NOMBRE */}

            <h3 className="font-bold text-lg text-center">
                🌸 {flor.nombre}
            </h3>


            {/* ESTADO */}

            {mostrarEstado && (

                <div className="flex justify-center mt-3">

                    <span
                        className={`
                            px-3
                            py-1
                            rounded-full
                            text-[11px]
                            font-medium
                            ${estado.estilo}
                        `}
                    >
                        {estado.texto}
                    </span>

                </div>

            )}


            {/* IMAGEN */}

            <div className="mt-4">

                <img
                    src={flor.imagen}
                    className="
                        w-52
                        h-52
                        object-cover
                        rounded-2xl
                        mx-auto
                    "
                    alt={flor.nombre}
                />

            </div>

        </div>

    );

}

export default FlorCard;