import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import MiembroCard from "../components/MiembroCard";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";
import ModalNuevaMiembro from "../components/ModalNuevoMiembro";
import Toast from "../components/SuccessModal";
import ModalConfirmacion from "../components/ModalConfirmacion";

function Miembros({ usuario }) {

  const [miembros, setMiembros] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("TODOS");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [toast, setToast] = useState("");
  const [miembroEditar, setMiembroEditar] = useState(null);
  const [miembroEliminar, setMiembroEliminar] = useState(null);

  const esAdmin =
    usuario?.rol === "Lider" ||
    usuario?.rol === "Colider";

  useEffect(() => {
    obtenerMiembros();
  }, []);

  async function obtenerMiembros() {
    const { data, error } = await supabase
      .from("miembros")
      .select("*");

    console.log("DATA MIEMBROS:", data);
    console.log("ERROR MIEMBROS:", error);

    setMiembros(data || []);
  }

  function mostrarToast(mensaje) {
    setToast(mensaje);

    setTimeout(() => {
      setToast("");
    }, 3000);
  }

  const miembrosSeguros = Array.isArray(miembros) ? miembros : [];

  const resultados = miembrosSeguros.filter((miembro) => {

    const nombre = miembro.nombre?.toLowerCase() || "";
    const rol = miembro.rol?.trim().toUpperCase();
    const filtro = filtroRol.toUpperCase();

    const coincideNombre =
      nombre.includes(busqueda.toLowerCase());

    const coincideRol =
      filtro === "TODOS" ||
      rol === filtro;

    return coincideNombre && coincideRol;
  });

  function editarMiembro(miembro) {
    setMiembroEditar(miembro);
    setMostrarModal(true);
  }

  function solicitarEliminar(miembro) {
    setMiembroEliminar(miembro);
  }

  async function eliminarMiembro(id) {

    await supabase
      .from("miembro_flores")
      .delete()
      .eq("miembro_id", id);

    const { error } = await supabase
      .from("miembros")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    mostrarToast("🗑️ Miembro eliminado");

    setMiembroEliminar(null);
    obtenerMiembros();
  }

  if (miembros === null) {
    return (
      <div className="text-center p-10">
        👥 Cargando miembros...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="flex justify-center mb-6">
        {esAdmin && (
          <Button
            variant="primary"
            onClick={() => setMostrarModal(true)}
          >
            ➕ Agregar Miembro
          </Button>
        )}
      </div>

      {mostrarModal && (
        <ModalNuevaMiembro
          miembroEditar={miembroEditar}
          onClose={() => {
            setMostrarModal(false);
            setMiembroEditar(null);
          }}
          obtenerMiembros={obtenerMiembros}
          mostrarToast={mostrarToast}
        />
      )}

      {toast && <Toast mensaje={toast} />}

      <SearchBar
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="🔍 Buscar miembro..."
      />

      <p className="text-center text-gray-500 mb-6">
        👥 Mostrando {resultados.length} de {miembrosSeguros.length} miembros
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

        {resultados.map((miembro) => (
          <MiembroCard
            key={miembro.id}
            miembro={miembro}
            onEditar={
              esAdmin
                ? editarMiembro
                : undefined
            }
            onEliminar={
              esAdmin
                ? () => solicitarEliminar(miembro)
                : undefined
            }
          />
        ))}

      </div>

      {miembroEliminar && (
        <ModalConfirmacion
          titulo="🗑️ Eliminar Miembro"
          mensaje={`¿Seguro que deseas eliminar a "${miembroEliminar.nombre}"?`}
          onClose={() => setMiembroEliminar(null)}
          onConfirm={() => eliminarMiembro(miembroEliminar.id)}
        />
      )}

    </div>
  );
}

export default Miembros;