import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "./Button.jsx";
import { supabase } from "../services/supabase.js";

function Navbar({ usuario }) {
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const iconos = {
    Admin: "🛠️",
    Lider: "👑",
    Colider: "⚔️",
    Veterano: "💎",
    Elite: "🤝",
    Miembro: "🌸",
  };

  const esAdmin = usuario?.rol === "Admin";

  async function cerrarSesion() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error al cerrar sesión:", error);
      alert("No se pudo cerrar la sesión. Inténtalo nuevamente.");
      return;
    }

    localStorage.removeItem("usuario");
    window.location.href = "/";
  }

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  return (
    <div className="p-3 justify-center flex fixed top-0 left-0 right-0 z-50 bg-[#F9EAF0]">
      <div className="absolute -right-8 -top-10 text-[130px] opacity-10 pointer-events-none">
        ✿
      </div>
      <div className="relative bg-linear-to-r from-pink-200 to-pink-400 shadow-md rounded-4xl w-full max-w-7xl font-sue text-2xl">
        <div className="p-4 flex items-center justify-between">
          {/* LOGO */}
          <div className="font-sue text-3xl text-black">🌸 Shangri-La</div>

          {/* MENÚ DESKTOP */}
          <div className="hidden md:flex gap-3 ">
            <Link to="/">
              <Button active={location.pathname === "/"}>🏠 Inicio</Button>
            </Link>

            <Link to="/flores">
              <Button active={location.pathname === "/flores"}>
                🌸 Flores
              </Button>
            </Link>

            <Link to="/miembros">
              <Button active={location.pathname === "/miembros"}>
                👥 Miembros
              </Button>
            </Link>

            <Link to="/coleccion">
              <Button active={location.pathname === "/coleccion"}>
                🌷 Colección
              </Button>
            </Link>

            <Link to="/objetivos">
              <Button active={location.pathname === "/objetivos"}>
                🎯 Objetivos
              </Button>
            </Link>

            {esAdmin && (
              <Link to="/admin">
                <Button active={location.pathname === "/admin"}>
                  🛠️ Admin
                </Button>
              </Link>
            )}
          </div>

          {/* USUARIO DESKTOP */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-lg text-gray-500">
                {iconos[usuario?.rol] || "👤"} {usuario?.rol}
              </p>
              <p className="font-semibold">{usuario?.nombre}</p>
            </div>

            <Button variant="danger" onClick={cerrarSesion}>
              📤
            </Button>
          </div>

          {/* BOTÓN MOBILE */}
          <button
            type="button"
            className="md:hidden text-3xl bg-white rounded-2xl px-3 py-1 shadow"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            ☰
          </button>

          {/* MENÚ MOBILE */}
          {menuAbierto && (
            <>
              <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={cerrarMenu}
              />

              <div className="absolute top-20 right-4 w-54 bg-white rounded-3xl shadow-xl p-4 flex flex-col items-center gap-3 z-50">
                <Link to="/" onClick={cerrarMenu}>
                  <Button>🏠 Inicio</Button>
                </Link>

                <Link to="/flores" onClick={cerrarMenu}>
                  <Button>🌸 Flores</Button>
                </Link>

                <Link to="/miembros" onClick={cerrarMenu}>
                  <Button>👥 Miembros</Button>
                </Link>

                <Link to="/coleccion" onClick={cerrarMenu}>
                  <Button>🌷 Colección</Button>
                </Link>

                <Link to="/objetivos" onClick={cerrarMenu}>
                  <Button>🎯 Objetivos</Button>
                </Link>

                {esAdmin && (
                  <Link to="/admin" onClick={cerrarMenu}>
                    <Button>🛠️ Admin</Button>
                  </Link>
                )}

                <div className="text-center mt-2">
                  <p>
                    {iconos[usuario?.rol] || "👤"} {usuario?.nombre}
                  </p>
                  <p className="text-sm text-gray-500">{usuario?.rol}</p>
                </div>

                <Button variant="danger" onClick={cerrarSesion}>
                  📤 Cerrar sesión
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
