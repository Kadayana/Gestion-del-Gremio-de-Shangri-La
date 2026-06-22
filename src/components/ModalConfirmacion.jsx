import Button from "./Button";

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
                    animate-[fadeIn_.2s_ease-out]
                "
            >

                <h2 className="text-2xl font-bold text-center mb-3">
                    {titulo}
                </h2>

                <p className="text-center text-gray-600 mb-6">
                    {mensaje}
                </p>

                <p className="text-center text-red-500 text-sm mb-4">
                    Esta acción no se puede deshacer.
                </p>

                <div className="flex justify-center gap-3">

                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="danger"
                        onClick={onConfirm}
                    >
                        Eliminar
                    </Button>

                </div>

            </div>

        </div>
    );
}

export default ModalConfirmacion;