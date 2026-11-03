import { useEffect, useState } from "react";
import { supabase } from "../services/supabase.js";
import FlorCard from "./FlorCard.jsx";
import Toast from "./SuccessModal.jsx";
import ModalConfirmacion from "./ModalConfirmacion.jsx";

function ModalColeccionMiembro({ miembro, usuario, onClose }) {
  const [flores, setFlores] = useState([]);
  const [toast, setToast] = useState("");
  const [florEliminar, setFlorEliminar] = useState(null);

  useEffect(() => {
    const scrollAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = scrollAnterior;
    };
  }, []);

  const mostrarToast = (mensaje) => {
    setToast(mensaje);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  useEffect(() => {
    async function cargarFlores() {
      if (!miembro?.id) return;

      const { data, error } = await supabase
        .from("miembro_flores")
        .select(
          `
                id,
                flores (
                    id,
                    nombre,
                    rareza,
                    imagen
                )
            `,
        )
        .eq("miembro_id", miembro.id);

      if (error) {
        console.error("Error al obtener flores:", error);
        return;
      }

      setFlores(data || []);
    }

    cargarFlores();
  }, [miembro?.id]);

  function solicitarEliminar(item) {
    setFlorEliminar(item);
  }

  async function eliminarFlorMiembro(id) {
    const { error } = await supabase
      .from("miembro_flores")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar flor:", error);
      return;
    }

    mostrarToast("🗑️ Flor eliminada");
    setFlorEliminar(null);
  }

  return (
    <div
      className="
      fixed inset-0 z-50
      bg-black/40
      flex justify-center items-center
      p-3
      overflow-y-auto
      overscroll-contain
    "
      onClick={onClose}
    >
      <div
        className="
        bg-white
        rounded-3xl
        shadow-xl
        p-4 md:p-6
        w-[95%]
        max-w-5xl
        max-h-[90vh]
        max-h-[90dvh]
        flex flex-col
        overflow-hidden
      "
        onClick={(e) => e.stopPropagation()}
      >
        {/* ENCABEZADO */}
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 shrink-0">
          🌷 Colección de {miembro.nombre}
        </h2>

        {/* FLORES CON SCROLL */}
        <div
          className="
        flex-1
        min-h-0
        overflow-y-auto
       
      "
        >
          {flores.length === 0 ? (
            <p className="text-center text-gray-500">
              Este miembro aún no tiene flores.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {flores.map((item) => (
                <FlorCard
                  key={item.id}
                  flor={item.flores}
                  usuario={usuario}
                  onEliminar={() => solicitarEliminar(item)}
                  tamanoImagen="w-24 h-24"
                  soloCodigoRareza={true}
                  tamañoLetraNombre="text-xl"
                />
              ))}
            </div>
          )}
        </div>

        {toast && <Toast mensaje={toast} />}

        {florEliminar && (
          <ModalConfirmacion
            titulo="🗑️ Eliminar Asignación"
            mensaje={`¿Deseas quitar la flor "${florEliminar.flores.nombre}" de ${miembro.nombre}?`}
            onClose={() => setFlorEliminar(null)}
            onConfirm={() => eliminarFlorMiembro(florEliminar.id)}
          />
        )}
      </div>
    </div>
  );
}

export default ModalColeccionMiembro;
