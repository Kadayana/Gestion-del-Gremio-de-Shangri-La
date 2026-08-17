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
        R: "R - Rara",
        SR: "SR - Super Rara",
        SSR: "SSR - Super Super Rara",
        UR: "UR - Ultra Rara",
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

                ${
                    flor.prioritaria
                        ? "border-2 border-yellow-400"
                        : "border border-gray-200"
                }
            `}
        >


            {/* ENCABEZADO */}

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


                {flor.prioritaria && (

                    <span className="text-xl">
                        ⭐
                    </span>

                )}

            </div>


            {/* ACCIONES */}

            <div className="flex justify-center gap-2 mt-3">


                {/* ⭐ PRIORIDAD
                    SOLO ADMIN */}

                {esAdmin && (

                    <button
                        onClick={onCambiarPrioridad}
                        title="Cambiar prioridad"
                        className={`
                            w-9
                            h-9
                            rounded-xl
                            transition

                            ${
                                flor.prioritaria
                                    ? "bg-yellow-300 hover:bg-yellow-400"
                                    : "bg-gray-200 hover:bg-gray-300"
                            }
                        `}
                    >
                        {flor.prioritaria
                            ? "⭐"
                            : "☆"
                        }
                    </button>

                )}


                {/* 🌸 CONSEGUIDA
                    TODOS */}

                <button
                    onClick={onCambiarConseguida}
                    title="Marcar como conseguida"
                    className="
                        w-32
                        h-9
                        rounded-xl
                        bg-green-200
                        hover:bg-green-300
                        transition
                    "
                >
                    🌸 Conseguida
                </button>


                {/* ✏️ EDITAR
                    SOLO ADMIN */}

                {esAdmin && (

                    <button
                        onClick={onEditar}
                        title="Editar objetivo"
                        className="
                            w-9
                            h-9
                            rounded-xl
                            bg-yellow-200
                            hover:bg-yellow-400
                            transition
                        "
                    >
                        ✏️
                    </button>

                )}


                {/* 🗑️ ELIMINAR
                    SOLO ADMIN */}

                {esAdmin && (

                    <button
                        onClick={onEliminar}
                        title="Eliminar objetivo"
                        className="
                            w-9
                            h-9
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


            {/* NOMBRE */}

            <h3 className="
                text-lg
                font-bold
                mt-3
                flex
                items-center
                justify-center
                gap-2
                text-center
            ">

                🌸 {flor.nombre}

            </h3>


            {/* ESTADO */}

            <div className="mt-3 flex justify-center">

                <span
                    className="
                        inline-block
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        bg-orange-100
                        text-orange-700
                        font-medium
                    "
                >
                    🎯 Objetivo pendiente
                </span>

            </div>

        </div>

    );

}

export default ObjetivoCard;