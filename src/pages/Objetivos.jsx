import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import ObjetivoCard from "../components/ObjetivoCard";
import SearchBar from "../components/SearchBar";
import FilterButton from "../components/FilterButton";
import ModalNuevoObjetivo from "../components/ModalNuevoObjetivo";
import Button from "../components/Button";
import Toast from "../components/SuccessModal";
import ModalConfirmacion from "../components/ModalConfirmacion";
import ErrorModal from "../components/ErrorModal";

function Objetivos({ usuario }) {

    const [flores, setFlores] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [filtroRareza, setFiltroRareza] = useState("TODAS");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [toast, setToast] = useState("");
    const [florEliminar, setFlorEliminar] = useState(null);
    const [florEditar, setFlorEditar] = useState(null);
    const [errorModal, setErrorModal] = useState("");

    const esAdmin =
        usuario?.rol === "Lider" ||
        usuario?.rol === "Colider";

    useEffect(() => {
        obtenerFlores();
    }, []);

    async function obtenerFlores() {
        try {
            const { data, error } = await supabase
                .from("flores")
                .select("*")
                .eq("conseguida", false);

            if (error) {
                console.error(error);
                setFlores([]);
                return;
            }

            data.sort((a, b) => {

                if (a.prioritaria !== b.prioritaria) {
                    return b.prioritaria - a.prioritaria;
                }

                return a.nombre.localeCompare(
                    b.nombre,
                    "es",
                    { sensitivity: "base" }
                );

            });

            setFlores(data || []);

        } catch (err) {
            console.error(err);
            setFlores([]);
        }
    }

    async function cambiarPrioridad(flor) {

        const { error } = await supabase
            .from("flores")
            .update({
                prioritaria: !flor.prioritaria
            })
            .eq("id", flor.id);

        if (error) {
            console.error(error);
            return;
        }

        if (!flor.prioritaria) {
            mostrarToast("⭐ Flor marcada como prioritaria");
        } else {
            mostrarToast("⭐ Flor quitada de prioridades");
        }

        obtenerFlores();
    }

    async function cambiarConseguida(flor) {

        const { error } = await supabase
            .from("flores")
            .update({
                conseguida: !flor.conseguida
            })
            .eq("id", flor.id);

        if (error) {
            console.error(error);
            return;
        }

        if (!flor.conseguida) {
            mostrarToast("🎉 ¡Objetivo completado! Flor conseguida.");
        } else {
            mostrarToast("↩️ La flor volvió a marcarse como pendiente.");
        }


        obtenerFlores();
    }

    function mostrarToast(mensaje) {
        setToast(mensaje);

        setTimeout(() => {
            setToast("");
        }, 3000);
    }

    function mostrarError(mensaje) {
        setErrorModal(mensaje);

        setTimeout(() => {
            setErrorModal("");
        }, 2000);

    }

    const floresSeguras = Array.isArray(flores) ? flores : [];

    const resultados = floresSeguras.filter((flor) => {

        const nombre = flor.nombre?.toLowerCase() || "";
        const rareza = flor.rareza?.trim().toUpperCase();

        const coincideNombre =
            nombre.includes(busqueda.toLowerCase());

        const coincideRareza =
            filtroRareza === "TODAS" ||
            rareza === filtroRareza;



        return (
            coincideNombre &&
            coincideRareza

        );
    });


    console.log({
        total: floresSeguras.length,
        resultados: resultados.length,
    });



    function solicitarEliminar(flor) {
        setFlorEliminar(flor);
    }

    async function eliminarFlor(id) {
        await supabase
            .from("miembro_flores")
            .delete()
            .eq("flor_id", id);

        const { error } = await supabase
            .from("flores")
            .delete()
            .eq("id", id);

        if (error) {
            console.error(error);
            return;
        }

       mostrarToast("🗑️ Objetivo eliminado.");

        setFlorEliminar(null);
        obtenerFlores();
    }

    function editarFlor(flor) {
        setFlorEditar(flor);
        setMostrarModal(true);
    }


    if (flores === null) {
        return (
            <div className="text-center p-10">
                📚 Cargando catálogo...
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center mb-6 ">

                {
                    esAdmin && (

                        <Button
                            variant="primary"
                            onClick={() => setMostrarModal(true)}
                        >
                            ➕ Agregar Objetivo
                        </Button>

                    )
                }

            </div>

            {mostrarModal && (
                <ModalNuevoObjetivo
                    florEditar={florEditar}
                    onClose={() => {
                        setMostrarModal(false);
                        setFlorEditar(null);
                    }}
                    obtenerFlores={obtenerFlores}
                    mostrarToast={mostrarToast}
                    mostrarError={mostrarError}
                />
            )}

            {toast &&
                <Toast mensaje={toast} />
            }

            {
                errorModal && (
                    <ErrorModal mensaje={errorModal} />
                )
            }

            <SearchBar
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="🔍 Buscar en ojetivos..."
            />

            <p className="text-center text-gray-500 mb-6">
                📚 Mostrando {resultados.length} de {floresSeguras.length} flores
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

                {resultados.map((flor) => (
                    <ObjetivoCard
                        key={flor.id}
                        flor={flor}
                        usuario={usuario}

                        mostrarEstado={true}

                        onEditar={
                            esAdmin
                                ? () => editarFlor(flor)
                                : null
                        }

                        onEliminar={
                            esAdmin
                                ? () => solicitarEliminar(flor)
                                : null
                        }

                        onCambiarPrioridad={
                            esAdmin
                                ? () => cambiarPrioridad(flor)
                                : null
                        }

                        onCambiarConseguida={
                            esAdmin
                                ? () => cambiarConseguida(flor)
                                : null
                        }
                    />
                ))}

            </div>

            {florEliminar && (
                <ModalConfirmacion
                    titulo="🗑️ Eliminar Flor"
                    mensaje={`¿Segura que deseas eliminar "${florEliminar.nombre}"?`}
                    onClose={() => setFlorEliminar(null)}
                    onConfirm={() => eliminarFlor(florEliminar.id)}
                />
            )}

        </div>
    );
}

export default Objetivos;