import { useEffect, useState } from "react";
import { supabase } from "../services/supabase.js";

function Dashboard({ usuario }) {
  const [totalFlores, setTotalFlores] = useState(0);
  const [totalMiembros, setTotalMiembros] = useState(0);
  const [loading, setLoading] = useState(true);
  const [raras, setRaras] = useState(0);
  const [superRaras, setSuperRaras] = useState(0);
  const [superSuperRaras, setSuperSuperRaras] = useState(0);
  const [ultraRaras, setUltraRaras] = useState(0);

  useEffect(() => {
    async function cargarDatos() {
      setLoading(true);

      try {
        const [
          { data: flores, error: errorFlores },
          { data: miembros, error: errorMiembros },
        ] = await Promise.all([
          supabase.from("flores").select("*"),
          supabase.from("miembros").select("*"),
        ]);

        if (errorFlores || errorMiembros) {
          console.error("Error al cargar los datos:", {
            errorFlores,
            errorMiembros,
          });
          return;
        }

        const safeFlores = flores || [];
        const safeMiembros = miembros || [];

        setTotalFlores(safeFlores.length);
        setTotalMiembros(safeMiembros.length);

        setRaras(
          safeFlores.filter((f) => f.rareza?.trim().toUpperCase() === "R")
            .length,
        );

        setSuperRaras(
          safeFlores.filter((f) => f.rareza?.trim().toUpperCase() === "SR")
            .length,
        );

        setSuperSuperRaras(
          safeFlores.filter((f) => f.rareza?.trim().toUpperCase() === "SSR")
            .length,
        );

        setUltraRaras(
          safeFlores.filter((f) => f.rareza?.trim().toUpperCase() === "UR")
            .length,
        );
      } catch (error) {
        console.error("Error inesperado:", error);
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  const nombre = usuario?.nombre || "amiga";

  const estadisticasRareza = [
    {
      codigo: "UR",
      nombre: "Ultra Rara",
      cantidad: ultraRaras,
      color: "bg-red-50 text-red-600",
      punto: "bg-red-400",
    },
    {
      codigo: "SSR",
      nombre: "Super Super Rara",
      cantidad: superSuperRaras,
      color: "bg-amber-50 text-amber-600",
      punto: "bg-amber-400",
    },
    {
      codigo: "SR",
      nombre: "Super Rara",
      cantidad: superRaras,
      color: "bg-purple-50 text-purple-600",
      punto: "bg-purple-400",
    },
    {
      codigo: "R",
      nombre: "Rara",
      cantidad: raras,
      color: "bg-blue-50 text-blue-600",
      punto: "bg-blue-400",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FFFAFC]">
        <p className="text-[#B77B96] text-lg">🌸 Preparando tu jardín...</p>
      </div>
    );
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#F9EAF0] px-4 py-8 md:px-8">
      {/* FLORECITAS DECORATIVAS DE TODO EL FONDO */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <span className="absolute top-[3%] right-[8%] text-[130px] text-[#C58AA4] opacity-10">
          ✿
        </span>

        <span className="absolute top-[10%] left-[4%] text-[85px] text-[#C58AA4] opacity-10">
          ❀
        </span>

        <span className="absolute top-[25%] right-[3%] text-[100px] text-[#C58AA4] opacity-10">
          ✿
        </span>

        <span className="absolute top-[35%] left-[7%] text-[115px] text-[#C58AA4] opacity-10">
          ❀
        </span>

        <span className="absolute top-[48%] right-[12%] text-[75px] text-[#C58AA4] opacity-10">
          ✿
        </span>

        <span className="absolute top-[58%] left-[2%] text-[130px] text-[#C58AA4] opacity-10">
          ✿
        </span>

        <span className="absolute top-[70%] right-[5%] text-[110px] text-[#C58AA4] opacity-10">
          ❀
        </span>

        <span className="absolute top-[78%] left-[12%] text-[80px] text-[#C58AA4] opacity-10">
          ✿
        </span>

        <span className="absolute top-[90%] right-[20%] text-[120px] text-[#C58AA4] opacity-10">
          ✿
        </span>

        <span className="absolute top-[95%] left-[3%] text-[90px] text-[#C58AA4] opacity-10">
          ❀
        </span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Bienvenida */}
        <section className="relative overflow-hidden rounded-2rem bg-[#F9EAF0] p-7 md:p-12 flex items-center justify-center flex-col text-center">
          {/* Flores decorativas de la sección */}
          <span className="absolute top-2 left-4 text-6xl text-[#C58AA4] opacity-20 pointer-events-none">
            ✿
          </span>
          <span className="absolute bottom-2 right-4 text-7xl text-[#C58AA4] opacity-20 pointer-events-none">
            ❀
          </span>

          <div className="relative z-10 max-w-2xl">
            <p className="text-sm tracking-[0.25em] uppercase text-black font-semibold mb-4">
              Bienvenida a nuestra APP de gestion
            </p>

            <h1 className="text-5xl md:text-5xl font-sue text-black leading-tight mb-4">
              ¡{nombre}!
            </h1>

            <p className="text-black leading-relaxed max-w-lg mt-5">
              Aqui podras gestionar tu coleccion de flores, ver las flores de
              las demas miembros, mantenerte al tanto de los objetivos y eventos
              del gremio.
            </p>
          </div>
        </section>

        <div className="flex items-center gap-3 my-8 mt-3">
          <span className="text-[#C58AA4] text-xl">✿</span>
          <div className="flex-1 h-px bg-[#E8C7D5]"></div>
          <span className="text-[#C58AA4] text-xl">✿</span>
          <div className="flex-1 h-px bg-[#E8C7D5]"></div>
          <span className="text-[#C58AA4] text-xl">✿</span>
          <div className="flex-1 h-px bg-[#E8C7D5]"></div>
          <span className="text-[#C58AA4] text-xl">✿</span>
          <div className="flex-1 h-px bg-[#E8C7D5]"></div>
          <span className="text-[#C58AA4] text-xl">✿</span>
        </div>

        {/* Estadísticas */}
        <section>
            <span className="absolute top-2 left-4 text-6xl text-[#C58AA4] opacity-20 pointer-events-none">
              ✿
            </span>
            <span className="absolute bottom-2 right-4 text-7xl text-[#C58AA4] opacity-20 pointer-events-none">
              ❀
            </span>
          <div className="mb-5 flex items-center justify-center flex-col text-center">
            {/* Flores decorativas de la sección */}
          
            <h2 className="text-4xl font-sue text-[#74485D] mt-1">
              Shangri-La en números
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-5">
            <div className="bg-white border border-[#F3E5EB] rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#B99AAA] text-sm mt-2">Miembros</p>
                  <h3 className="text-[#74485D] text-4xl font-semibold mt-2">
                    {totalMiembros}
                    <span className="text-lg text-[#C4A5B4] font-normal">
                      {" "}
                      / 34
                    </span>
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#EDE5F5] rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#AE9ABD] text-sm mt-2">
                    Flores registradas
                  </p>
                  <h3 className="text-[#80669B] text-4xl font-semibold mt-2">
                    {totalFlores}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-3 my-8">
          <span className="text-[#C58AA4] text-xl">✿</span>
          <div className="flex-1 h-px bg-[#E8C7D5]"></div>
          <span className="text-[#C58AA4] text-xl">✿</span>
          <div className="flex-1 h-px bg-[#E8C7D5]"></div>
          <span className="text-[#C58AA4] text-xl">✿</span>
          <div className="flex-1 h-px bg-[#E8C7D5]"></div>
          <span className="text-[#C58AA4] text-xl">✿</span>
          <div className="flex-1 h-px bg-[#E8C7D5]"></div>
          <span className="text-[#C58AA4] text-xl">✿</span>
        </div>

        {/* Rarezas */}
        <section>
          
          <div className="mb-5 flex items-center justify-center flex-col text-center">
             <span className="absolute top-2 left-4 text-6xl text-[#C58AA4] opacity-20 pointer-events-none">
              ✿
            </span>
            <span className="absolute bottom-2 right-4 text-7xl text-[#C58AA4] opacity-20 pointer-events-none">
              ❀
            </span>
            <p className="text-4xl text-[#74485D] font-sue">
              Nuestra colección
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {estadisticasRareza.map((rareza) => (
              <div
                key={rareza.codigo}
                className="bg-white border border-[#F3E5EB] rounded-3xl p-5 shadow-sm"
              >
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${rareza.color}`}
                >
                  {rareza.codigo}
                </div>

                <p className="text-[#98778A] text-sm mt-4">{rareza.nombre}</p>

                <p className="text-3xl font-semibold text-[#74485D] mt-1">
                  {rareza.cantidad}
                </p>

                <div className={`w-8 h-1 rounded-full mt-4 ${rareza.punto}`} />
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-3 my-8">
          <span className="text-[#C58AA4] text-xl">✿</span>
          <div className="flex-1 h-px bg-[#E8C7D5]"></div>
          <span className="text-[#C58AA4] text-xl">✿</span>
          <div className="flex-1 h-px bg-[#E8C7D5]"></div>
          <span className="text-[#C58AA4] text-xl">✿</span>
          <div className="flex-1 h-px bg-[#E8C7D5]"></div>
          <span className="text-[#C58AA4] text-xl">✿</span>
          <div className="flex-1 h-px bg-[#E8C7D5]"></div>
          <span className="text-[#C58AA4] text-xl">✿</span>
        </div>

        {/* Despedida */}
        <footer className="text-center ">
          <p className="text-black text-sm">
            Hecho con cariño para nuestro gremio
          </p>
          <p className="text-sm font-sue text-black mt-1">YAYA</p>
          <p className="text-[#D1A9BA] text-xl mt-2">✿ ❀ ✿</p>
        </footer>
      </div>
    </main>
  );
}

export default Dashboard;
