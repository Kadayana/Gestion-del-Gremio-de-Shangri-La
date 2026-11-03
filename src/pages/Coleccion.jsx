import { useState, useEffect } from "react";
import { supabase } from "../services/supabase.js";
import Button from "../components/Button.jsx";
import ModalAsignarFlor from "../components/ModalAsignarFlor.jsx";
import MiembroCard from "../components/MiembroCard.jsx";
import ModalColeccionMiembro from "../components/ModalColeccionMiembro.jsx";
import Toast from "../components/SuccessModal.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ErrorModal from "../components/ErrorModal.jsx";

function Coleccion({ usuario }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [miembros, setMiembros] = useState([]);
  const [miembroSeleccionado, setMiembroSeleccionado] = useState(null);
  const [mostrarColeccion, setMostrarColeccion] = useState(false);
  const [toast, setToast] = useState("");
  const [coleccion, setColeccion] = useState([]);
  const [busquedaFlor, setBusquedaFlor] = useState("");
  const [errorModal, setErrorModal] = useState("");

  const resultadosFlor = coleccion.filter((item) =>
    item.flores?.nombre?.toLowerCase().includes(busquedaFlor.toLowerCase()),
  );

  const floresAgrupadas = {};

  resultadosFlor.forEach((item) => {
    const nombreFlor = item.flores?.nombre;
    const miembro = item.miembros;

    if (!nombreFlor || !miembro) return;

    if (!floresAgrupadas[nombreFlor]) {
      floresAgrupadas[nombreFlor] = [];
    }

    floresAgrupadas[nombreFlor].push({
      id: miembro.id,
      nombre: miembro.nombre,
    });
  });

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

  function abrirColeccion(miembro) {
    setMiembroSeleccionado(miembro);
    setMostrarColeccion(true);
  }

  async function obtenerMiembros() {
    const { data, error } = await supabase.from("miembros").select("*");

    if (error) {
      console.error("Error al obtener miembros:", error);
      return;
    }

    const miembrosOrdenados = [...(data || [])].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es", {
        sensitivity: "base",
      }),
    );

    setMiembros(miembrosOrdenados);
  }

  async function obtenerColeccion() {
    let todos = [];
    let desde = 0;
    const cantidad = 1000;

    while (true) {
      const { data, error } = await supabase
        .from("miembro_flores")
        .select(
          `
          id,
          miembro_id,
          flor_id,
          miembros(
            id,
            nombre
          ),
          flores(
            id,
            nombre
          )
        `,
        )
        .range(desde, desde + cantidad - 1);

      if (error) {
        console.error("Error al obtener colección:", error);
        return;
      }

      todos = [...todos, ...(data || [])];

      if (!data || data.length < cantidad) break;

      desde += cantidad;
    }

    setColeccion(todos);
  }

  useEffect(() => {
    async function cargarDatos() {
      await Promise.all([obtenerMiembros(), obtenerColeccion()]);
    }

    cargarDatos();
  }, []);

  const cantidadFlores = {};

  coleccion.forEach((item) => {
    const nombreMiembro = item.miembros?.nombre;

    if (!nombreMiembro) return;

    cantidadFlores[nombreMiembro] = (cantidadFlores[nombreMiembro] || 0) + 1;
  });

  return (
    <div className="container mx-auto px-4 py-18 flex flex-col gap-3 bg-[#F9EAF0]">
      <h2 className="text-center text-3xl font-bold mb-4">
        🌷 Colección del Gremio
      </h2>

      <div className="flex justify-center mb-4 ">
        <Button variant="primary" onClick={() => setMostrarModal(true)}>
          ➕ Asignar Flor
        </Button>
      </div>

      <SearchBar
        value={busquedaFlor}
        onChange={(e) => setBusquedaFlor(e.target.value)}
        placeholder="🔍 Buscar una flor..."
      />

      {busquedaFlor && (
        <div className="space-y-4 mb-6 flex flex-col items-center">
          {Object.entries(floresAgrupadas).map(([flor, miembros]) => (
            <div
              key={flor}
              className="bg-pink-100 rounded-3xl shadow p-5 w-full max-w-5xl flex flex-col"
            >
              <h3 className="font-bold text-xl text-center mb-4 shrink-0">
                🌸 {flor}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-100 overflow-y-auto pr-2 justify-items-center">
                {miembros.map((miembro, index) => (
                  <MiembroCard
                    key={`${miembro.id}-${index}`}
                    mostrarRol={false}
                    miembro={miembro}
                  />
                ))}
              </div>
            </div>
          ))}

          {resultadosFlor.length === 0 && (
            <div className="bg-white rounded-3xl shadow p-5 text-center">
              😢 Nadie tiene esa flor
            </div>
          )}
        </div>
      )}

      {mostrarModal && (
        <ModalAsignarFlor
          onClose={() => setMostrarModal(false)}
          mostrarToast={mostrarToast}
          mostrarError={mostrarError}
        />
      )}

      {toast && <Toast mensaje={toast} />}

      {errorModal && <ErrorModal mensaje={errorModal} />}

      {mostrarColeccion && (
        <ModalColeccionMiembro
          miembro={miembroSeleccionado}
          usuario={usuario}
          onClose={() => setMostrarColeccion(false)}
        />
      )}

      <p className="text-center text-gray-500">
        Aquí aparecerán las flores de cada miembro.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {miembros.map((miembro) => (
          <MiembroCard
            key={miembro.id}
            mostrarRol={false}
            miembro={miembro}
            botonTexto="🌷 Ver colección"
            onBotonClick={() => abrirColeccion(miembro)}
            cantidadFlores={cantidadFlores[miembro.nombre] || 0}
          />
        ))}
      </div>
    </div>
  );
}

export default Coleccion;
