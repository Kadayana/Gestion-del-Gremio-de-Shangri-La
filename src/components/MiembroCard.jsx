import { useState, useEffect } from "react";
import Button from "./Button";

function MiembroCard({ miembro, botonTexto, onBotonClick, mostrarRol, onEditar, onEliminar, }) {


  const iconos = {
    Lider: "👑",
    Colider: "⚔️",
    Veterano: "💎",
    Elite: "🤝",
    Miembro: "🌸",
  };

  const estilos = {
    Lider: "bg-red-100 text-red-700",
    Colider: "bg-orange-100 text-orange-700",
    Veterano: "bg-purple-100 text-purple-700",
    Elite: "bg-blue-100 text-blue-700",
    Miembro: "bg-green-100 text-green-700",
  };

  return (
    <div className="bg-pink-50 rounded-3xl shadow p-5 hover:shadow-lg transition w-70 mx-auto">

      {
        mostrarRol !== false && (
          <p
            className={`
            text-center
          
            inline-block
            px-3
            py-1
            rounded-full
            text-sm
            ${estilos[miembro.rol]}
          `}
          >
            {iconos[miembro.rol]} {miembro.rol}
          </p>
        )
      }


      <h3 className="text-xl font-semibold text-center">
        {miembro.nombre}
      </h3>

      {botonTexto && (
        <div className="flex justify-center mt-4">
          <Button
            variant="primary"
            onClick={onBotonClick}
          >
            {botonTexto}
          </Button>
        </div>
      )}

    </div>
  );
}

export default MiembroCard;