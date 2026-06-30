import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

function Dashboard() {

  const [totalFlores, setTotalFlores] = useState(0);
  const [totalMiembros, setTotalMiembros] = useState(0);
  const [loading, setLoading] = useState(true);
  const [raras, setRaras] = useState(0);
  const [superRaras, setSuperRaras] = useState(0);
  const [superSuperRaras, setSuperSuperRaras] = useState(0);
  const [ultraRaras, setUltraRaras] = useState(0);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setLoading(true);

    const { data: flores, error: errorFlores } = await supabase
      .from("flores")
      .select("*");

    const { data: miembros, error: errorMiembros } = await supabase
      .from("miembros")
      .select("*");

    if (errorFlores || errorMiembros) {
      console.log("Error flores:", errorFlores);
      console.log("Error miembros:", errorMiembros);
      setLoading(false);
      return;
    }

    const safeFlores = flores || [];
    const safeMiembros = miembros || [];

    setTotalFlores(safeFlores.length);
    setTotalMiembros(safeMiembros.length);

    setRaras(safeFlores.filter(f => f.rareza?.trim().toUpperCase() === "R").length);
    setSuperRaras(safeFlores.filter(f => f.rareza?.trim().toUpperCase() === "SR").length);
    setSuperSuperRaras(safeFlores.filter(f => f.rareza?.trim().toUpperCase() === "SSR").length);
    setUltraRaras(safeFlores.filter(f => f.rareza?.trim().toUpperCase() === "UR").length);

    setLoading(false);
  }


  if (loading) {
    return (
      <div className="text-center p-10">
        Cargando datos...
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">

      {/* Bienvenida */}
      <div className="bg-pink-100 rounded-3xl p-6 shadow mb-8 text-center">

        <h1 className="text-4xl font-bold mb-2">
          🌸 Shangri-La 🌸
        </h1>

        <p className="text-gray-600">
          👋 Bienvenido al gremio
        </p>

      </div>

      {/* Estadísticas principales */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">

        <div className="bg-white rounded-3xl shadow p-6 text-center">
          <h2 className="text-xl font-semibold">
            👥 Miembros
          </h2>

          <p className="text-4xl mt-2 font-bold">
            {totalMiembros} / 31
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow p-6 text-center">
          <h2 className="text-xl font-semibold">
            🌷 Flores
          </h2>

          <p className="text-4xl mt-2 font-bold">
            {totalFlores}
          </p>
        </div>

      </div>

      {/* Rarezas */}
      <div className="bg-white rounded-3xl shadow p-6">

        <h2 className="text-2xl font-semibold mb-4">
          🌟 Rarezas
        </h2>

        <div className="space-y-3">

          <p>❤️ UR - Ultra Rara: {ultraRaras}</p>

          <p>💛 SSR - Super Super Rara: {superSuperRaras}</p>

          <p>💜 SR - Super Rara: {superRaras}</p>

          <p>💙 R - Rara: {raras}</p>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;