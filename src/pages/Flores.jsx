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
        .select("*");

      if (error) {
        console.error(error);
        setFlores([]);
        return;
      }

      setFlores(data || []);
    } catch (err) {
      console.error(err);
      setFlores([]);
    }
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
    }, 3000);

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

    return coincideNombre && coincideRareza;
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

      <div className="flex justify-center gap-2 mb-6">

        <FilterButton
          active={filtroRareza === "TODAS"}
          onClick={() => setFiltroRareza("TODAS")}
        >
          🌸 Todas
        </FilterButton>

        <FilterButton
          active={filtroRareza === "R"}
          onClick={() => setFiltroRareza("R")}
          color="bg-blue-100"
        >
          Rara
        </FilterButton>

        <FilterButton
          active={filtroRareza === "SR"}
          onClick={() => setFiltroRareza("SR")}
          color="bg-purple-100"
        >
          Super Rara
        </FilterButton>

        <FilterButton
          active={filtroRareza === "SSR"}
          onClick={() => setFiltroRareza("SSR")}
          color="bg-yellow-100"
        >
          Super Super Rara
        </FilterButton>

        <FilterButton
          active={filtroRareza === "UR"}
          onClick={() => setFiltroRareza("UR")}
          color="bg-red-100"
        >
          Ultra Rara
        </FilterButton>

      </div>

      <div className="flex justify-center mb-6">

        <Button
          variant="primary"
          onClick={() => setMostrarModal(true)}
        >
          ➕ Agregar Flor
        </Button>

      </div>

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
        placeholder="🔍 Buscar flor..."
      />

      <p className="text-center text-gray-500 mb-6">
        🌸 Mostrando {resultados.length} de {floresSeguras.length} flores
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

        {resultados.map((flor) => (
          <FlorCard
            key={flor.id}
            flor={flor}
            usuario={usuario}
            onEditar={editarFlor}
            onEliminar={
              esAdmin
                ? () => solicitarEliminar(flor)
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

export default Flores;