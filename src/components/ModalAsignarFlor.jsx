import { useState, useEffect, useCallback } from "react";
import { supabase } from "../services/supabase.js";
import Button from "./Button.jsx";
import Select from "./Select.jsx";

function ModalAsignarFlor({ onClose, mostrarToast, mostrarError }) {
  const [miembros, setMiembros] = useState([]);
  const [flores, setFlores] = useState([]);
  const [miembroId, setMiembroId] = useState("");
  const [floresSeleccionadas, setFloresSeleccionadas] = useState([]);
  const [floresDisponibles, setFloresDisponibles] = useState([]);

  useEffect(() => {
    const scrollAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = scrollAnterior;
    };
  }, []);

  // Cargar miembros y flores
  async function cargarDatos() {
    try {
      const { data: miembrosData, error: errorMiembros } = await supabase
        .from("miembros")
        .select("*");

      if (errorMiembros) throw errorMiembros;

      const { data: floresData, error: errorFlores } = await supabase
        .from("flores")
        .select("*")
        .eq("conseguida", true);

      if (errorFlores) throw errorFlores;

      const floresOrdenadas = (floresData || []).sort((a, b) =>
        a.nombre.localeCompare(b.nombre, "es", {
          sensitivity: "base",
        }),
      );

      setMiembros(miembrosData || []);
      setFlores(floresOrdenadas);
    } catch (error) {
      mostrarError?.(error.message || "No se pudieron cargar los datos.");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarDatos();
  }, []);

  // Cargar las flores que todavía no tiene el miembro
  const cargarFloresDisponibles = useCallback(async () => {
    if (!miembroId) {
      setFloresDisponibles([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("miembro_flores")
        .select("flor_id")
        .eq("miembro_id", miembroId);

      if (error) throw error;

      const idsAsignadas = (data || []).map((f) => f.flor_id);

      const disponibles = flores.filter(
        (flor) => !idsAsignadas.includes(flor.id),
      );

      setFloresDisponibles(disponibles);
    } catch (error) {
      mostrarError?.(
        error.message || "No se pudieron cargar las flores disponibles.",
      );
    }
  }, [miembroId, flores, mostrarError]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarFloresDisponibles();
  }, [cargarFloresDisponibles]);

  // Cambiar de miembro y limpiar la selección anterior
  function cambiarMiembro(id) {
    setMiembroId(id);
    setFloresSeleccionadas([]);
  }

  // Seleccionar o deseleccionar una flor
  function seleccionarFlor(id) {
    setFloresSeleccionadas((actuales) =>
      actuales.includes(id)
        ? actuales.filter((flor) => flor !== id)
        : [...actuales, id],
    );
  }

  // Guardar asignación
  async function guardarAsignacion() {
    if (!miembroId || floresSeleccionadas.length === 0) {
      mostrarError?.("Por favor, selecciona un miembro y al menos una flor.");
      return;
    }

    const registros = floresSeleccionadas.map((id) => ({
      miembro_id: Number(miembroId),
      flor_id: id,
    }));

    try {
      const { error } = await supabase.from("miembro_flores").insert(registros);

      if (error) throw error;

      mostrarToast?.(`🌷 ${floresSeleccionadas.length} flores asignadas`);

      onClose();
    } catch (error) {
      mostrarError?.(error.message || "No se pudieron asignar las flores.");
    }
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
    >
      <div
        className="
      bg-white
      rounded-3xl
      shadow-xl
      p-4 md:p-6
      w-[95%]
      max-w-md
      max-h-[90vh]
      max-h-[90dvh]
      flex flex-col
      overflow-hidden
    "
      >
        {/* ENCABEZADO */}
        <h2 className="text-4xl font-sue text-center mb-6 shrink-0">
          🌷 Asignar Flor 🌷
        </h2>

        {/* CONTENIDO DESPLAZABLE */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-4 pr-1">
          <Select
            value={miembroId}
            onChange={(e) => cambiarMiembro(e.target.value)}
            options={miembros.map((m) => ({
              value: m.id,
              label: m.nombre,
            }))}
            placeholder="👤 Seleccionar Miembro"
          />

          <div>
            <h3 className="font-semibold mb-3">🌸 Selecciona las flores</h3>

            <div
              className="
            grid grid-cols-2
            gap-3
            max-h-72
            overflow-y-auto
            overscroll-contain
          "
          style={{ WebkitOverflowScrolling: "touch" }}
            >
              {floresDisponibles.map((flor) => {
                const activa = floresSeleccionadas.includes(flor.id);

                return (
                  <button
                    type="button"
                    key={flor.id}
                    onClick={() => seleccionarFlor(flor.id)}
                    className={`
                    rounded-2xl
                    border-2
                    p-3
                    transition
                    ${
                      activa
                        ? "border-pink-500 bg-pink-100"
                        : "border-gray-200 bg-white"
                    }
                  `}
                  >
                    <p className="font-sue text-2xl mt-2">{flor.nombre}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-center text-gray-500">
            🌸 Seleccionadas: <b>{floresSeleccionadas.length}</b>
          </p>
        </div>

        {/* BOTONES */}
        <div className="flex justify-center gap-3 pt-4 shrink-0">
          <Button variant="primary" onClick={guardarAsignacion}>
            🌷 Guardar
          </Button>

          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModalAsignarFlor;
