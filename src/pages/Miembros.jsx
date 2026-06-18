import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import MiembroCard from "../components/MiembroCard";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";
import ModalNuevaMiembro from "../components/ModalNuevoMiembro";
import Toast from "../components/SuccessModal";

function Miembros({ usuario }) {

  const [miembros, setMiembros] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("TODOS");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [toast, setToast] = useState("");


  const resultados = miembros.filter((miembro) => {

    const coincideNombre =
      miembro.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());

    const coincideRol =
      filtroRol === "TODOS" ||
      miembro.rol === filtroRol;

    return coincideNombre && coincideRol;
  });

  useEffect(() => {
    obtenerMiembros();
  }, []);

  const esAdmin =
    usuario?.rol === "Lider" ||
    usuario?.rol === "Colider";

  function mostrarToast(mensaje) {
    console.log("MOSTRAR TOAST:", mensaje);

    setToast(mensaje);

    setTimeout(() => {
      setToast("");
    }, 3000);

  }

  async function obtenerMiembros() {
    const { data, error } = await supabase
      .from("miembros")
      .select("*");

    if (!error) {
      setMiembros(data);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-6">
        {
          esAdmin && (
            <Button variant="primary"
              onClick={() => setMostrarModal(true)}
            >
              ➕ Agregar Miembro
            </Button>
          )}

      </div>
      {mostrarModal && (
        <ModalNuevaMiembro
          onClose={() => setMostrarModal(false)}
          obtenerMiembros={obtenerMiembros}
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
        placeholder="🔍 Buscar miembro..."
      />

      <p className="text-center text-gray-500 mb-6">
        👥 Mostrando {resultados.length} de {miembros.length} miembros
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {resultados.map((miembro) => (
          <MiembroCard
            key={miembro.id}
            miembro={miembro}
          />
        ))}
      </div>
    </div>
  );
}

export default Miembros;