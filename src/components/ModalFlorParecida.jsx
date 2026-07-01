import Button from "./Button";

function ModalFlorParecida({ nombreExistente, onCancelar, onContinuar }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[60]">
            <div className="bg-white rounded-3xl shadow-xl p-6 w-[90%] max-w-md animate-fadeIn">
                <h2 className="text-2xl font-bold text-center mb-4">
                    🌸 Flor parecia encontrada
                </h2>

                <p className="text-center text-gray-600 mb-6">
                    Ya existe una flor llamada:
                </p>

                <div className="
                    bg-pink-50
                    rounded-2xl
                    p-4
                    text-center
                    font-semibold
                    text-lg
                    mb-6
                ">
                 {nombreExistente}
                </div>

                <p className="text-center text-gray-500 mb-6">
                    ¿Deseas crearla igualmente?
                </p>

                <div className="flex justify-center gap-3">

                    <Button
                        variant="secondary"
                        onClick={onCancelar}
                    >
                        ✏️ Corregir
                    </Button>

                    <Button
                        variant="primary"
                        onClick={onContinuar}
                    >
                        ✅ Crear igualmente
                    </Button>

                </div>

            </div>

        </div>
    );
}

export default ModalFlorParecida;

