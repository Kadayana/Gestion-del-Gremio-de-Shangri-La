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
                    {
                        sensitivity: "base"
                    }
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

            mostrarError(
                "❌ No se pudo cambiar la prioridad"
            );

            return;
        }


        if (!flor.prioritaria) {

            mostrarToast(
                "⭐ Flor marcada como prioritaria"
            );

        } else {

            mostrarToast(
                "⭐ Flor quitada de prioridades"
            );

        }


        obtenerFlores();

    }


    /*
     * 👥 CUALQUIER MIEMBRO
     *
     * Objetivo → Flor conseguida
     */

    async function cambiarConseguida(flor) {

        const { error } = await supabase
            .from("flores")
            .update({
                conseguida: true
            })
            .eq("id", flor.id);


        if (error) {

            console.error(error);

            mostrarError(
                "❌ No se pudo completar el objetivo"
            );

            return;
        }


        mostrarToast(
            `🎉 ¡${flor.nombre} fue conseguida!`
        );


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
        }, 2500);

    }


    const floresSeguras =
        Array.isArray(flores)
            ? flores
            : [];


    const resultados =
        floresSeguras.filter((flor) => {

            const nombre =
                flor.nombre?.toLowerCase() || "";

            const rareza =
                flor.rareza?.trim().toUpperCase();


            const coincideNombre =
                nombre.includes(
                    busqueda.toLowerCase()
                );


            const coincideRareza =
                filtroRareza === "TODAS" ||
                rareza === filtroRareza;


            return (
                coincideNombre &&
                coincideRareza
            );

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

            mostrarError(
                "❌ No se pudo eliminar el objetivo"
            );

            return;
        }


        mostrarToast(
            "🗑️ Objetivo eliminado"
        );


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
                📚 Cargando objetivos...
            </div>
        );

    }


    return (

        <div className="container mx-auto px-4 py-8">


            {/* AGREGAR OBJETIVO */}

            <div className="flex justify-center mb-6">

                {esAdmin && (

                    <Button
                        variant="primary"
                        onClick={() =>
                            setMostrarModal(true)
                        }
                    >
                        ➕ Agregar Objetivo
                    </Button>

                )}

            </div>


            {/* MODAL */}

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


            {/* MENSAJES */}

            {toast && (
                <Toast mensaje={toast} />
            )}


            {errorModal && (
                <ErrorModal mensaje={errorModal} />
            )}


            {/* FILTROS */}

            <div className="flex justify-center gap-2 mb-6 flex-wrap">

                <FilterButton
                    active={filtroRareza === "TODAS"}
                    onClick={() =>
                        setFiltroRareza("TODAS")
                    }
                >
                    🌸 Todas
                </FilterButton>


                <FilterButton
                    active={filtroRareza === "R"}
                    onClick={() =>
                        setFiltroRareza("R")
                    }
                    color="bg-blue-100"
                >
                    R
                </FilterButton>


                <FilterButton
                    active={filtroRareza === "SR"}
                    onClick={() =>
                        setFiltroRareza("SR")
                    }
                    color="bg-purple-100"
                >
                    SR
                </FilterButton>


                <FilterButton
                    active={filtroRareza === "SSR"}
                    onClick={() =>
                        setFiltroRareza("SSR")
                    }
                    color="bg-yellow-100"
                >
                    SSR
                </FilterButton>


                <FilterButton
                    active={filtroRareza === "UR"}
                    onClick={() =>
                        setFiltroRareza("UR")
                    }
                    color="bg-red-100"
                >
                    UR
                </FilterButton>

            </div>


            {/* BUSCADOR */}

            <SearchBar
                value={busqueda}
                onChange={(e) =>
                    setBusqueda(e.target.value)
                }
                placeholder="🔍 Buscar en objetivos..."
            />


            <p className="text-center text-gray-500 mb-6">

                🎯 Mostrando {resultados.length} de{" "}
                {floresSeguras.length} objetivos

            </p>


            {/* OBJETIVOS */}

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

                {resultados.map((flor) => (

                    <ObjetivoCard

                        key={flor.id}

                        flor={flor}

                        usuario={usuario}


                        onEditar={
                            esAdmin
                                ? () =>
                                    editarFlor(flor)
                                : null
                        }


                        onEliminar={
                            esAdmin
                                ? () =>
                                    solicitarEliminar(flor)
                                : null
                        }


                        onCambiarPrioridad={
                            esAdmin
                                ? () =>
                                    cambiarPrioridad(flor)
                                : null
                        }


                        /*
                         * 🔥 IMPORTANTE
                         *
                         * Esto NO lleva esAdmin.
                         *
                         * Cualquier miembro puede
                         * conseguir el objetivo.
                         */

                        onCambiarConseguida={() =>
                            cambiarConseguida(flor)
                        }

                    />

                ))}

            </div>


            {/* ELIMINAR */}

            {florEliminar && (

                <ModalConfirmacion

                    titulo="🗑️ Eliminar Objetivo"

                    mensaje={
                        `¿Segura que deseas eliminar "${florEliminar.nombre}"?`
                    }

                    onClose={() =>
                        setFlorEliminar(null)
                    }

                    onConfirm={() =>
                        eliminarFlor(florEliminar.id)
                    }

                />

            )}

        </div>

    );

}

export default Objetivos;