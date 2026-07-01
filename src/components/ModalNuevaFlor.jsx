import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import { supabase } from "../services/supabase";
import normalizarNombre from "../utils/normalizarNombre";
import ModalFlorParecida from "./ModalFlorParecida";


function ModalNuevaFlor({ onClose, obtenerFlores, mostrarToast, mostrarError, florEditar = null }) {

    const [nombre, setNombre] = useState(florEditar?.nombre || "");
    const [rareza, setRareza] = useState(florEditar?.rareza || "");
    const [imagen, setImagen] = useState(florEditar?.imagen || null);
    const [preview, setPreview] = useState(florEditar?.imagen || null);
    const [mostrarParecida, setMostrarParecida] = useState(false);
    const [guardarPendiente, setGuardarPendiente] = useState(null);
    const [nombreParecido, setNombreParecido] = useState("");

    function manejarImagen(e) {
        const archivo = e.target.files[0];

        if (!archivo) return;

        setImagen(archivo);

        setPreview(
            URL.createObjectURL(archivo)
        );
    }

    async function guardarFlor() {
        if (florEditar) {

            const { error } = await supabase
                .from("flores")
                .update({
                    nombre,
                    rareza
                })
                .eq("id", florEditar.id);

            if (error) {
                console.error(error);
                return;
            }

            mostrarToast(
                "✏️ Flor actualizada"
            );

            await obtenerFlores();

            onClose();

            return;
        }

        if (!nombre || !imagen) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        // 1️⃣ Buscar si existe exactamente igual
        const { data: florExacta } = await supabase
            .from("flores")
            .select("nombre")
            .ilike("nombre", nombre)
            .maybeSingle();

        if (florExacta) {
            mostrarError("🌸 Esa flor ya existe.");
            return;
        }

        // 2️⃣ Buscar parecidas
        const { data } = await supabase
            .from("flores")
            .select("nombre");

        const parecida = data.find(
            flor =>
                normalizarNombre(flor.nombre) ===
                normalizarNombre(nombre)
        );

        if (parecida) {

            setNombreParecido(parecida.nombre);

            setGuardarPendiente({
                nombre,
                rareza,
                imagen,
            });

            setMostrarParecida(true);

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

    async function guardarIgualmente() {

        setMostrarParecida(false);

        const datos = guardarPendiente;

        const nombreArchivo =
            `${Date.now()}_${datos.imagen.name}`;

        const { error: errorStorage } =
            await supabase.storage
                .from("flores")
                .upload(nombreArchivo, datos.imagen);

        if (errorStorage) return;

        const {
            data: { publicUrl },
        } = supabase.storage
            .from("flores")
            .getPublicUrl(nombreArchivo);

        await supabase
            .from("flores")
            .insert([
                {
                    nombre: datos.nombre,
                    rareza: datos.rareza,
                    imagen: publicUrl,
                },
            ]);

        await obtenerFlores();

        mostrarToast("🌸 Flor agregada");

        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-3xl shadow-xl p-6 w-[88%] max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">
                    {
                        florEditar
                            ? "✏️ Editar Flor"
                            : "🌸 Agregar Flor"
                    }
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

            {
                mostrarParecida && (

                    <ModalFlorParecida

                        nombreExistente={nombreParecido}

                        onCancelar={() =>
                            setMostrarParecida(false)
                        }

                        onContinuar={guardarIgualmente}

                    />

                )
            }

        </div>

    );
}

export default ModalNuevaFlor;