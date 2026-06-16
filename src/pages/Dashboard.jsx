import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

function Dashboard() {

  const [totalFlores, setTotalFlores] = useState(0);
  const [totalMiembros, setTotalMiembros] = useState(0);

  const [raras, setRaras] = useState(0);
  const [superRaras, setSuperRaras] = useState(0);
  const [superSuperRaras, setSuperSuperRaras] = useState(0);
  const [ultraRaras, setUltraRaras] = useState(0);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {

    const { data: flores } = await supabase
      .from("flores")
      .select("*");

    const { data: miembros } = await supabase
      .from("miembros")
      .select("*");

    setTotalFlores(flores?.length || 0);
    setTotalMiembros(miembros?.length || 0);

    setRaras(
      flores?.filter((flor) => flor.rareza === "R").length || 0
    );

    setSuperRaras(
      flores?.filter((flor) => flor.rareza === "SR").length || 0
    );

    setSuperSuperRaras(
      flores?.filter((flor) => flor.rareza === "SSR").length || 0
    );

    setUltraRaras(
      flores?.filter((flor) => flor.rareza === "UR").length || 0
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
            {totalMiembros} / 28
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