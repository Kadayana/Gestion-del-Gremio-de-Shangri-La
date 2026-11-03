import { useEffect, useState, useCallback } from "react";
import { supabase } from "../services/supabase.js";
import MiembroCard from "../components/MiembroCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Button from "../components/Button.jsx";
import ModalNuevaMiembro from "../components/ModalNuevoMiembro.jsx";
import Toast from "../components/SuccessModal.jsx";
import ModalConfirmacion from "../components/ModalConfirmacion.jsx";
import ErrorModal from "../components/ErrorModal.jsx";

function Miembros({ usuario }) {
  const [miembros, setMiembros] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("TODOS");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [toast, setToast] = useState("");
  const [miembroEditar, setMiembroEditar] = useState(null);
  const [miembroEliminar, setMiembroEliminar] = useState(null);
  const [errorModal, setErrorModal] = useState("");

  const esAdmin =
    usuario?.rol === "Admin" ||
    usuario?.rol === "Lider" ||
    usuario?.rol === "Colider";

  // Obtener y ordenar miembros
  const obtenerMiembros = useCallback(async () => {
    const { data, error } = await supabase.from("miembros").select("*");

    if (error) {
      console.error("Error al obtener miembros:", error);
      setErrorModal("No se pudieron cargar los miembros.");
      setMiembros([]);
      return;
    }

    const ordenRoles = {
      Admin: 0,
      Lider: 1,
      Colider: 2,
      Veterano: 3,
      Elite: 4,
      Miembro: 5,
    };

    const miembrosOrdenados = [...(data || [])].sort((a, b) => {
      const diferencia = (ordenRoles[a.rol] ?? 99) - (ordenRoles[b.rol] ?? 99);

      if (diferencia !== 0) return diferencia;

      return a.nombre.localeCompare(b.nombre, "es", {
        sensitivity: "base",
      });
    });

    setMiembros(miembrosOrdenados);
  }, []);

  // Carga inicial
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    obtenerMiembros();
  }, [obtenerMiembros]);

  // Mensajes
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

  // Filtrar miembros
  const miembrosSeguros = Array.isArray(miembros) ? miembros : [];

  const resultados = miembrosSeguros.filter((miembro) => {
    const nombre = miembro.nombre?.toLowerCase() || "";
    const rol = miembro.rol?.trim().toUpperCase();
    const filtro = filtroRol.toUpperCase();

    const coincideNombre = nombre.includes(busqueda.toLowerCase());

    const coincideRol = filtro === "TODOS" || rol === filtro;

    return coincideNombre && coincideRol;
  });

  // Editar miembro
  function editarMiembro(miembro) {
    setMiembroEditar(miembro);
    setMostrarModal(true);
  }

  // Solicitar eliminación
  function solicitarEliminar(miembro) {
    setMiembroEliminar(miembro);
  }

  // Eliminar miembro
  async function eliminarMiembro(id) {
    const { error: errorFlores } = await supabase
      .from("miembro_flores")
      .delete()
      .eq("miembro_id", id);

    if (errorFlores) {
      console.error("Error al eliminar asignaciones:", errorFlores);
      mostrarError("No se pudieron eliminar las flores asignadas.");
      return;
    }

    const { error } = await supabase.from("miembros").delete().eq("id", id);

    if (error) {
      console.error("Error al eliminar miembro:", error);
      mostrarError("No se pudo eliminar el miembro.");
      return;
    }

    mostrarToast("🗑️ Miembro eliminado");
    setMiembroEliminar(null);

    await obtenerMiembros();
  }

  // Pantalla de carga
  if (miembros === null) {
    return <div className="text-center p-10">👥 Cargando miembros...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Agregar miembro */}
      <div className="flex justify-center mb-6">
        {esAdmin && (
          <Button variant="primary" onClick={() => setMostrarModal(true)}>
            ➕ Agregar Miembro
          </Button>
        )}
      </div>

      {/* Modal de creación y edición */}
      {mostrarModal && (
        <ModalNuevaMiembro
          miembroEditar={miembroEditar}
          onClose={() => {
            setMostrarModal(false);
            setMiembroEditar(null);
          }}
          obtenerMiembros={obtenerMiembros}
          mostrarToast={mostrarToast}
          mostrarError={mostrarError}
        />
      )}

      {/* Notificaciones */}
      {toast && <Toast mensaje={toast} />}

      {errorModal && <ErrorModal mensaje={errorModal} />}

      {/* Búsqueda */}
      <SearchBar
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="🔍 Buscar miembro..."
      />

      {/* Filtro por rol */}
      <div className="flex justify-center my-4">
        <select
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
          className="border border-pink-200 rounded-xl px-4 py-2 bg-white shadow-sm"
        >
          <option value="TODOS">Todos los roles</option>
          <option value="ADMIN">Admin</option>
          <option value="LIDER">Líder</option>
          <option value="COLIDER">Colíder</option>
          <option value="VETERANO">Veterano</option>
          <option value="ELITE">Elite</option>
          <option value="MIEMBRO">Miembro</option>
        </select>
      </div>

      {/* Cantidad de resultados */}
      <p className="text-center text-gray-500 mb-6">
        👥 Mostrando {resultados.length} de {miembrosSeguros.length} miembros
      </p>

      {/* Tarjetas de miembros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {resultados.map((miembro) => (
          <MiembroCard
            key={miembro.id}
            miembro={miembro}
            onEditar={esAdmin ? editarMiembro : undefined}
            onEliminar={esAdmin ? () => solicitarEliminar(miembro) : undefined}
          />
        ))}
      </div>

      {/* Confirmación de eliminación */}
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
