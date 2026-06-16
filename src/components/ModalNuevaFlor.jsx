import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import { supabase } from "../services/supabase";


function ModalNuevaFlor({ onClose, obtenerFlores, mostrarToast }) {

    const [nombre, setNombre] = useState("");
    const [rareza, setRareza] = useState("");
    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(null);

    function manejarImagen(e) {
        const archivo = e.target.files[0];

        if (!archivo) return;

        setImagen(archivo);

        setPreview(
            URL.createObjectURL(archivo)
        );
    }

    async function guardarFlor() {
        if (!nombre || !imagen) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const nombreArchivo = `${Date.now()}_${imagen.name}`;
        const { error: errorStorage } =
            await supabase.storage
                .from("flores")
                .upload(nombreArchivo, imagen);

        if (errorStorage) {
            console.error(errorStorage);
            return;
        }

        const {
            data: { publicUrl },
        } = supabase.storage
            .from("flores")
            .getPublicUrl(nombreArchivo);

        const { error } =
            await supabase
                .from("flores")
                .insert([
                    {
                        nombre,
                        rareza,
                        imagen: publicUrl,
                    },
                ]);

        if (error) {
            console.error(error);
            return;
        }

        await obtenerFlores();
        mostrarToast(
            "🌸 Flor agregada correctamente"
        );

        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">
                    🌸 Agregar Flor
                </h2>

                <div className="space-y-4">

                    <Input
                        value={nombre}
                        onChange={(e) =>
                            setNombre(e.target.value)
                        }
                        placeholder="🌸 Nombre de la flor"
                    />

                    <Select
                        value={rareza}
                        onChange={(e) =>
                            setRareza(e.target.value)
                        }
                        placeholder="Seleccionar rareza"

                        options={[
                            {
                                value: "R",
                                label: "💙 R - Rara",
                            },
                            {
                                value: "SR",
                                label: "💜 SR - Super Rara",
                            },
                            {
                                value: "SSR",
                                label: "💛 SSR - Super Super Rara",
                            },
                            {
                                value: "UR",
                                label: "❤️ UR - Ultra Rara",
                            },
                        ]}

                    />

                    <div>

                        <label className="block mb-2 font-medium">
                            🖼️ Imagen
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={manejarImagen}
                            className="
                                w-full
                                flex
                                justify-center
                                items-center
                                p-4
                                border-2
                                border-dashed
                                border-pink-200
                                rounded-2xl
                                cursor-pointer
                                bg-pink-50
                                hover:bg-pink-100
                                transition
                                "
                        />

                    </div>

                    {preview && (

                        <div className="flex justify-center">

                            <img
                                src={preview}
                                alt="Vista previa"
                                className="
                                    w-40
                                    h-40
                                    object-cover
                                    rounded-2xl
                                    shadow
                                    mt-3
                                "
                            />

                        </div>

                    )}

                    <div className="flex gap-3 justify-center">

                        <Button variant="primary"
                            onClick={guardarFlor}
                        >
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

export default ModalNuevaFlor;