import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import FlorCard from "../components/FlorCard";
import SearchBar from "../components/SearchBar";
import FilterButton from "../components/FilterButton";
import ModalNuevaFlor from "../components/ModalNuevaFlor";
import Button from "../components/Button";
import Toast from "../components/SuccessModal";

function Flores() {

  const [flores, setFlores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRareza, setFiltroRareza] = useState("TODAS");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    obtenerFlores();
  }, []);

  function mostrarToast(mensaje) {
    console.log("MOSTRAR TOAST:", mensaje);

    setToast(mensaje);

    setTimeout(() => {
      setToast("");
    }, 3000);

  }

  async function obtenerFlores() {
    const { data, error } = await supabase
      .from("flores")
      .select("*");

    if (!error) {
      setFlores(data);
    }
  }

  const resultados = flores.filter((flor) => {

    const coincideNombre =
      flor.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());

    const coincideRareza =
      filtroRareza === "TODAS" ||
      flor.rareza === filtroRareza;

    return coincideNombre && coincideRareza;
  });

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
          Supe Rara
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

        <Button variant="primary"
          onClick={() => setMostrarModal(true)}
        >
          ➕ Agregar Flor
        </Button>

      </div>
      {mostrarModal && (
        <ModalNuevaFlor
          onClose={() => setMostrarModal(false)}
          obtenerFlores={obtenerFlores}
          mostrarToast={mostrarToast}
        />
      )}


      {
        toast && (
          <Toast mensaje={toast} />
        )
      }

      <SearchBar
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="🔍 Buscar flor..."
      />

      <p className="text-center mb-6 text-lg">
        🌸 Mostrando {resultados.length} de {flores.length} flores
      </p>


      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

        {resultados.map((flor) => (
          <FlorCard
            key={flor.id}
            flor={flor}
          />
        ))}

      </div>
    </div>
  );
}




export default Flores;