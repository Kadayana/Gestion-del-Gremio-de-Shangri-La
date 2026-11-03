import { useState } from "react";
import { supabase } from "../services/supabase.js";

function Admin({ usuario }) {
  const [mensaje, setMensaje] = useState("");
  const [migrando, setMigrando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const esAdmin = usuario?.rol === "Admin";

  async function migrarCuentas() {
    if (!esAdmin) {
      setMensaje("No tienes permisos para realizar esta acción.");
      return;
    }

    const confirmar = globalThis.confirm(
      "¿Estás segura de iniciar la migración de las cuentas? Este proceso creará y vinculará usuarios en Supabase Auth.",
    );

    if (!confirmar) return;

    setMigrando(true);
    setMensaje("");
    setResultado(null);

    try {
      const { data: sesionData, error: sesionError } =
        await supabase.auth.getSession();

      if (sesionError || !sesionData.session) {
        throw new Error("Tu sesión no está activa. Inicia sesión nuevamente.");
      }

      const { data, error } =
        await supabase.functions.invoke("migrar-miembros");

      if (error) {
        throw new Error(error.message || "No se pudo ejecutar la migración.");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setResultado(data);
      setMensaje(data?.mensaje || "Proceso finalizado.");
    } catch (error) {
      const mensajeError =
        error instanceof Error ? error.message : "Ocurrió un error inesperado.";

      setMensaje(mensajeError);
    } finally {
      setMigrando(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-18 bg-[#F9EAF0]">
      <div className="bg-linear-to-r from-pink-200 to-purple-200 rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">⚙️</div>

          <h1 className="text-3xl font-bold">Panel de Administración</h1>

          <p className="text-gray-600 mt-2">
            Bienvenida, {usuario?.nombre || "Administradora"} 💜
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <button
            type="button"
            onClick={() => setMensaje("Aquí podremos gestionar usuarios 👥")}
            className="bg-white rounded-3xl shadow p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-4xl mb-3">👥</div>
            <h2 className="font-bold text-xl">Gestionar usuarios</h2>
            <p className="text-gray-500 text-sm mt-2">
              Administrar miembros y roles.
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setMensaje("Aquí podremos revisar las asignaciones 🌸")
            }
            className="bg-white rounded-3xl shadow p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-4xl mb-3">🌸</div>
            <h2 className="font-bold text-xl">Gestionar colecciones</h2>
            <p className="text-gray-500 text-sm mt-2">
              Revisar y corregir asignaciones de flores.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setMensaje("Aquí podremos gestionar las flores 🌷")}
            className="bg-white rounded-3xl shadow p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-4xl mb-3">🌷</div>
            <h2 className="font-bold text-xl">Gestionar flores</h2>
            <p className="text-gray-500 text-sm mt-2">
              Crear, editar y administrar flores.
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setMensaje("Aquí podremos ver información del sistema 📊")
            }
            className="bg-white rounded-3xl shadow p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-4xl mb-3">📊</div>
            <h2 className="font-bold text-xl">Estadísticas</h2>
            <p className="text-gray-500 text-sm mt-2">
              Información general del gremio.
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setMensaje("Aquí podremos revisar problemas del sistema 🔧")
            }
            className="bg-white rounded-3xl shadow p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-4xl mb-3">🔧</div>
            <h2 className="font-bold text-xl">Herramientas</h2>
            <p className="text-gray-500 text-sm mt-2">
              Herramientas para mantenimiento.
            </p>
          </button>
        </div>

        {mensaje && (
          <div className="mt-6 bg-white rounded-2xl p-4 text-center shadow">
            {mensaje}
          </div>
        )}

        {esAdmin && (
          <div className="mt-8 bg-white rounded-3xl shadow p-6">
            <div className="text-4xl mb-3">🔐</div>

            <h2 className="font-bold text-xl">Seguridad de cuentas</h2>

            <p className="text-gray-600 text-sm mt-2 mb-5">
              Migrar las cuentas existentes a Supabase Auth para proteger las
              contraseñas y vincularlas con sus miembros.
            </p>

            <button
              type="button"
              onClick={migrarCuentas}
              disabled={migrando}
              className="bg-purple-600 text-white font-bold rounded-2xl px-6 py-3 hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {migrando
                ? "Migrando cuentas..."
                : "Migrar cuentas a Supabase Auth"}
            </button>

            {resultado && (
              <div className="mt-5 bg-purple-50 rounded-2xl p-4">
                <h3 className="font-bold mb-3">Resultado de la migración</h3>

                <p>Cuentas creadas: {resultado.cuentasCreadas}</p>
                <p>Cuentas vinculadas: {resultado.cuentasVinculadas}</p>
                <p>Cuentas omitidas: {resultado.omitidas}</p>
                <p>Total procesadas: {resultado.totalProcesadas}</p>

                {resultado.errores?.length > 0 && (
                  <div className="mt-4 text-red-700">
                    <p className="font-bold">Cuentas con errores:</p>
                    {resultado.errores.map((item) => (
                      <p key={item.id}>
                        ID {item.id}: {item.nombre}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
