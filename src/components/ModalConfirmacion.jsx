function ModalConfirmacion({
    titulo,
    mensaje,
    onConfirm,
    onClose
}) {

    return (
        <div
            className="
                fixed
                inset-0
                bg-black/40
                flex
                justify-center
                items-center
                z-50
            "
        >

            <div
                className="
                    bg-white
                    rounded-3xl
                    shadow-xl
                    p-6
                    w-full
                    max-w-md
                "
            >

                <h2 className="text-2xl font-bold text-center mb-3">
                    {titulo}
                </h2>

                <p className="text-center text-gray-600 mb-6">
                    {mensaje}
                </p>

                <div className="flex justify-center gap-3">

                    <button
                        onClick={onClose}
                        className="
                            px-4
                            py-2
                            rounded-2xl
                            bg-gray-200
                            hover:bg-gray-300
                        "
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onConfirm}
                        className="
                            px-4
                            py-2
                            rounded-2xl
                            bg-red-500
                            text-white
                            hover:bg-red-600
                        "
                    >
                        Eliminar
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ModalConfirmacion;