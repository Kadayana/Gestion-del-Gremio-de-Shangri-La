import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import FlorCard from "../components/FlorCard";
import SearchBar from "../components/SearchBar";
import FilterButton from "../components/FilterButton";
import ModalNuevaFlor from "../components/ModalNuevaFlor";
import Button from "../components/Button";
import Toast from "../components/SuccessModal";
import ModalConfirmacion from "../components/ModalConfirmacion";
import ErrorModal from "../components/ErrorModal";

function Flores({ usuario }) {

  const [flores, setFlores] = useState(null);
  const [floresAsignadas, setFloresAsignadas] = useState([]);
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

      // Obtener flores conseguidas
      const { data, error } = await supabase
        .from("flores")
        .select("*")
        .eq("conseguida", true);

      if (error) {
        console.error(error);
        setFlores([]);
        return;
      }


      // Obtener las flores que ya están asignadas
      const { data: asignaciones, error: errorAsignaciones } =
        await supabase
          .from("miembro_flores")
          .select("flor_id");

      if (errorAsignaciones) {
        console.error(errorAsignaciones);
        setFloresAsignadas([]);
      } else {

        // Guardamos solamente los IDs únicos
        const idsAsignados = [
          ...new Set(
            asignaciones.map((item) => item.flor_id)
          )
        ];

        setFloresAsignadas(idsAsignados);
      }


      data.sort((a, b) =>
        a.nombre.localeCompare(
          b.nombre,
          "es",
          { sensitivity: "base" }
        )
      );

      setFlores(data || []);

    } catch (err) {

      console.error(err);
      setFlores([]);

    }
  }


  /*
   * 👑 Lider / ⚔️ Colider
   *
   * Mandar una flor de Flores → Objetivos
   *
   * Solo se mostrará el botón 🎯
   * si nadie tiene asignada esa flor.
   */
  async function mandarAObjetivos(flor) {

    const { error } = await supabase
      .from("flores")
      .update({
        conseguida: false
      })
      .eq("id", flor.id);

    if (error) {

      console.error(error);

      mostrarError(
        "❌ No se pudo enviar la flor a objetivos"
      );

      return;
    }

    mostrarToast(
      `🎯 "${flor.nombre}" fue enviada a objetivos`
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
        "❌ No se pudo eliminar la flor"
      );

      return;
    }


    mostrarToast("🗑️ Flor eliminada");

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
        🌸 Cargando flores...
      </div>
    );

  }


  return (

    <div className="container mx-auto px-4 py-8">


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

          <span className="hidden sm:inline">
            Rara
          </span>

          <span className="sm:hidden">
            R
          </span>

        </FilterButton>


        <FilterButton
          active={filtroRareza === "SR"}
          onClick={() =>
            setFiltroRareza("SR")
          }
          color="bg-purple-100"
        >

          <span className="hidden sm:inline">
            Super Rara
          </span>

          <span className="sm:hidden">
            SR
          </span>

        </FilterButton>


        <FilterButton
          active={filtroRareza === "SSR"}
          onClick={() =>
            setFiltroRareza("SSR")
          }
          color="bg-yellow-100"
        >

          <span className="hidden sm:inline">
            Super Super Rara
          </span>

          <span className="sm:hidden">
            SSR
          </span>

        </FilterButton>


        <FilterButton
          active={filtroRareza === "UR"}
          onClick={() =>
            setFiltroRareza("UR")
          }
          color="bg-red-100"
        >

          <span className="hidden sm:inline">
            Ultra Rara
          </span>

          <span className="sm:hidden">
            UR
          </span>

        </FilterButton>

      </div>


      {/* AGREGAR FLOR */}

      <div className="flex justify-center mb-6">

        <Button
          variant="primary"
          onClick={() =>
            setMostrarModal(true)
          }
        >
          ➕ Agregar Flor
        </Button>

      </div>


      {/* MODAL NUEVA FLOR */}

      {mostrarModal && (

        <ModalNuevaFlor
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


      {/* BUSCADOR */}

      <SearchBar
        value={busqueda}
        onChange={(e) =>
          setBusqueda(e.target.value)
        }
        placeholder="🔍 Buscar flor..."
      />


      <p className="text-center text-gray-500 mb-6">

        🌸 Mostrando {resultados.length} de{" "}
        {floresSeguras.length} flores

      </p>


      {/* FLORES */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

        {resultados.map((flor) => (

          <FlorCard
            key={flor.id}

            flor={flor}

            usuario={usuario}

            modo="normal"

            onEditar={
              esAdmin
                ? editarFlor
                : null
            }

            onEliminar={
              esAdmin
                ? () =>
                    solicitarEliminar(flor)
                : null
            }

            /*
             * 🎯 SOLO aparece si:
             *
             * 1. El usuario es Lider o Colider
             * 2. Nadie tiene asignada esta flor
             */
            onMandarAObjetivos={
              esAdmin &&
              !floresAsignadas.includes(flor.id)
                ? () => mandarAObjetivos(flor)
                : null
            }

          />

        ))}

      </div>


      {/* CONFIRMAR ELIMINACIÓN */}

      {florEliminar && (

        <ModalConfirmacion

          titulo="🗑️ Eliminar Flor"

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

export default Flores;