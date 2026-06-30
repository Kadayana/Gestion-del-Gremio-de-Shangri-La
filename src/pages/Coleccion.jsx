import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import Button from "../components/Button";
import ModalAsignarFlor from "../components/ModalAsignarFlor";
import MiembroCard from "../components/MiembroCard";
import ModalColeccionMiembro from "../components/ModalColeccionMiembro";
import Toast from "../components/SuccessModal";
import SearchBar from "../components/SearchBar";
import ErrorModal from "../components/ErrorModal";


function Coleccion({ usuario }) {

  const [mostrarModal, setMostrarModal] = useState(false);
  const [miembros, setMiembros] = useState([]);
  const [miembroSeleccionado, setMiembroSeleccionado] = useState(null);
  const [mostrarColeccion, setMostrarColeccion] = useState(false);
  const [toast, setToast] = useState("");
  const [coleccion, setColeccion] = useState([]);
  const [busquedaFlor, setBusquedaFlor] = useState("");
  const [errorModal, setErrorModal] = useState("");

  const resultadosFlor = coleccion.filter(
    (item) =>
      item.flores?.nombre
        ?.toLowerCase()
        .includes(
          busquedaFlor.toLowerCase()
        )
  );


  const floresAgrupadas = {};

  resultadosFlor.forEach((item) => {

    const nombreFlor =
      item.flores.nombre;

    if (!floresAgrupadas[nombreFlor]) {
      floresAgrupadas[nombreFlor] = [];
    }

    floresAgrupadas[nombreFlor].push(
      item.miembros.nombre
    );
  });

  function abrirColeccion(miembro) {
    console.log(miembro);
  }

  useEffect(() => {
    obtenerMiembros();
    obtenerColeccion();
  }, []);



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
    const { data, error } =
      await supabase
        .from("miembros")
        .select("*");

    if (!error) {

      data.sort((a, b) =>
        a.nombre.localeCompare(
          b.nombre,
          "es",
          { sensitivity: "base" }
        )
      );

      setMiembros(data);
    }
  }

  async function obtenerColeccion() {
    const { data, error } = await supabase
      .from("miembro_flores")
      .select(`
      id,
      miembros(nombre),
      flores(nombre)
    `);

    if (!error) {
      setColeccion(data);
    }
  }

  const cantidadFlores = {};

  coleccion.forEach((item) => {

    cantidadFlores[item.miembros.nombre] =
      (cantidadFlores[item.miembros.nombre] || 0) + 1;

  });


  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-3">

      <h2 className="text-center text-3xl font-bold mb-4 ">
        🌷 Colección del Gremio
      </h2>

      <div className="flex justify-center mb-4">
        <Button variant="primary"
          onClick={() =>
            setMostrarModal(true)
          }
        >
          ➕ Asignar Flor
        </Button>
      </div>



      <SearchBar
        value={busquedaFlor}
        onChange={(e) =>
          setBusquedaFlor(e.target.value)
        }
        placeholder="🔍 Buscar una flor..."
      />

      {
        busquedaFlor && (
          <div className="space-y-4 mb-6 flex flex-col items-center">

            {
              Object.entries(
                floresAgrupadas
              ).map(
                ([flor, miembros]) => (


                  <div key={flor} className="content-center bg-pink-100 rounded-3xl shadow p-5  flex justify-center flex-col items-center
                                max-w-5xl
                                max-h-[80vh]
                                overflow-y-auto">

                    <h3 className="font-bold text-xl mb-3">
                      🌸 {flor}
                    </h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {miembros.map((nombre) => (
                        <MiembroCard
                          key={nombre}
                          mostrarRol={false}
                          miembro={{ nombre }}

                        />
                      ))}
                    </div>
                  </div>
                )
              )
            }

            {
              resultadosFlor.length === 0 && (
                <div
                  className="
                  bg-white
                  rounded-3xl
                  shadow
                  p-5
                  text-center
                "
                >
                  😢 Nadie tiene esa flor
                </div>
              )
            }

          </div>
        )
      }

      {
        mostrarModal && (
          <ModalAsignarFlor
            onClose={() => setMostrarModal(false)}
            mostrarToast={mostrarToast}
            mostrarError={mostrarError}
          />
        )}


      {
        toast && (
          <Toast mensaje={toast} />
        )
      }

      {
        errorModal && (
          <ErrorModal mensaje={errorModal} />
        )
      }


      {
        mostrarColeccion && (
          <ModalColeccionMiembro
            miembro={miembroSeleccionado}
            usuario={usuario}
            onClose={() =>
              setMostrarColeccion(false)
            }
          />
        )
      }



      <p className="text-center text-gray-500">
        Aquí aparecerán las flores de cada miembro.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {miembros.map((miembro) => (
          <MiembroCard
            mostrarRol={false}
            miembro={miembro}
            botonTexto="🌷 Ver colección"
            onBotonClick={() =>
              abrirColeccion(miembro)
            }
            cantidadFlores={
              cantidadFlores[miembro.nombre] || 0
            }

          />
        ))}
      </div>


    </div>
  );
}


export default Coleccion;


