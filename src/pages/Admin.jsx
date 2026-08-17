import { useState } from "react";

function Admin({ usuario }) {

  const [mensaje, setMensaje] = useState("");

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-3xl shadow-xl p-8">

        <div className="text-center mb-8">

          <div className="text-6xl mb-3">
            ⚙️
          </div>

          <h1 className="text-3xl font-bold">
            Panel de Administración
          </h1>

          <p className="text-gray-600 mt-2">
            Bienvenida, {usuario.nombre} 💜
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

          <button
            onClick={() => setMensaje("Aquí podremos gestionar usuarios 👥")}
            className="bg-white rounded-3xl shadow p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-4xl mb-3">
              👥
            </div>

            <h2 className="font-bold text-xl">
              Gestionar usuarios
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Administrar miembros y roles.
            </p>
          </button>


          <button
            onClick={() => setMensaje("Aquí podremos revisar las asignaciones 🌸")}
            className="bg-white rounded-3xl shadow p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-4xl mb-3">
              🌸
            </div>

            <h2 className="font-bold text-xl">
              Gestionar colecciones
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Revisar y corregir asignaciones de flores.
            </p>
          </button>


          <button
            onClick={() => setMensaje("Aquí podremos gestionar las flores 🌷")}
            className="bg-white rounded-3xl shadow p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-4xl mb-3">
              🌷
            </div>

            <h2 className="font-bold text-xl">
              Gestionar flores
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Crear, editar y administrar flores.
            </p>
          </button>


          <button
            onClick={() => setMensaje("Aquí podremos ver información del sistema 📊")}
            className="bg-white rounded-3xl shadow p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-4xl mb-3">
              📊
            </div>

            <h2 className="font-bold text-xl">
              Estadísticas
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Información general del gremio.
            </p>
          </button>


          <button
            onClick={() => setMensaje("Aquí podremos revisar problemas del sistema 🔧")}
            className="bg-white rounded-3xl shadow p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-4xl mb-3">
              🔧
            </div>

            <h2 className="font-bold text-xl">
              Herramientas
            </h2>

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

      </div>

    </div>
  );
}

export default Admin;