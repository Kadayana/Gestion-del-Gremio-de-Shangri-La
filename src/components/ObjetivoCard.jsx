function ObjetivoCard({
    flor,
    usuario,
    onEditar,
    onEliminar,
    onCambiarPrioridad,
    onCambiarConseguida,
}) {

    const esAdmin =
        usuario?.rol === "Lider" ||
        usuario?.rol === "Colider";

    const colores = {
        R: "bg-blue-100 text-blue-700",
        SR: "bg-purple-100 text-purple-700",
        SSR: "bg-yellow-100 text-yellow-700",
        UR: "bg-red-100 text-red-700",
    };

    const nombresRareza = {
        R: "R",
        SR: "SR",
        SSR: "SSR",
        UR: "UR",
    };

    return (

        <div
            className={`
                rounded-2xl
                p-4
                bg-white
                shadow
                transition
                hover:shadow-lg

                ${flor.prioritaria
                    ? "border-2 border-yellow-400"
                    : "border border-gray-200"
                }
            `}
        >

            {/* Encabezado */}

            <div className="flex justify-between items-center">

                <span
                    className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${colores[flor.rareza]}
                    `}
                >
                    {nombresRareza[flor.rareza]}
                </span>

                {
                    flor.prioritaria && (

                        <span className="text-xl">
                            ⭐
                        </span>

                    )
                }

            </div>

            
            {/* Botones */}

            {
                esAdmin && (

                    <div className="flex justify-center gap-2 mt-3">

                        <button
                            onClick={onCambiarPrioridad}
                            className={`
                                w-9
                                h-9
                                rounded-xl
                                transition

                                ${flor.prioritaria
                                    ? "bg-yellow-300 hover:bg-yellow-400"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }
                            `}
                        >
                            {flor.prioritaria ? "⭐" : "☆"}
                        </button>

                        <button
                            onClick={onCambiarConseguida}
                            className="
                                w-9
                                h-9
                                rounded-xl
                                bg-green-200
                                hover:bg-green-300
                            "
                        >
                            ✅
                        </button>

                        <button
                            onClick={onEditar}
                            className="
                                w-9
                                h-9
                                rounded-xl
                                bg-yellow-200
                                hover:bg-yellow-400
                            "
                        >
                            ✏️
                        </button>

                        <button
                            onClick={onEliminar}
                            className="
                                w-9
                                h-9
                                rounded-xl
                                bg-red-200
                                hover:bg-red-400
                            "
                        >
                            🗑️
                        </button>

                    </div>

                )
            }

            {/* Nombre */}

            <h3 className="text-lg font-bold mt-3 flex items-center justify-center gap-2">

                🌸 {flor.nombre}

            </h3>

            {/* Estado */}

            <div className="mt-3 flex justify-center">

                <span
                    className="
                        inline-block
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        bg-red-100
                        text-red-700
                        font-medium
                    "
                >
                    ❌ Sin conseguir
                </span>

            </div>


        </div>

    );

}

export default ObjetivoCard;