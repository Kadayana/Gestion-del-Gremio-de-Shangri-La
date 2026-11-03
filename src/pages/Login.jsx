import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import { supabase } from "../services/supabase.js";
import ModalCambiarClave from "../components/ModalCambiarClave.jsx";

function Login({ iniciarSesion }) {
  const [nombre, setNombre] = useState("");
  const [clave, setClave] = useState("");
  const [mostrarCambioClave, setMostrarCambioClave] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  async function manejarLogin() {
    if (!nombre.trim() || !clave) {
      alert("Escribe tu nombre y contraseña.");
      return;
    }

    setCargando(true);

    try {
      // Buscar únicamente los datos necesarios del miembro
      const { data: miembro, error: errorMiembro } = await supabase
        .from("miembros")
        .select("id, nombre, rol, primer_ingreso, auth_user_id")
        .eq("nombre", nombre.trim())
        .maybeSingle();

      if (errorMiembro || !miembro) {
        alert("❌ Usuario o contraseña incorrectos.");
        return;
      }

      // Comprobar que la cuenta ya fue migrada
      if (!miembro.auth_user_id) {
        alert(
          "Esta cuenta todavía no ha sido migrada. Contacta al administrador.",
        );
        return;
      }

      // Generar el correo interno usando el ID del miembro
      const correoInterno = `miembro-${miembro.id}@cozyguild.invalid`;

      // Iniciar sesión mediante Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: correoInterno,
          password: clave,
        });

      if (authError || !authData.user) {
        alert("❌ Usuario o contraseña incorrectos.");
        return;
      }

      // Verificar que la cuenta Auth corresponde al miembro
      if (authData.user.id !== miembro.auth_user_id) {
        await supabase.auth.signOut();
        alert("No se pudo verificar la cuenta. Contacta al administrador.");
        return;
      }

      const usuario = {
        id: miembro.id,
        nombre: miembro.nombre,
        rol: miembro.rol,
        primer_ingreso: miembro.primer_ingreso,
        auth_user_id: miembro.auth_user_id,
      };

      if (miembro.primer_ingreso) {
        setUsuarioActual(usuario);
        setMostrarCambioClave(true);
        return;
      }

      localStorage.setItem("usuario", JSON.stringify(usuario));
      iniciarSesion(usuario);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al iniciar sesión.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F9EAF0] flex justify-center items-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🌸</div>

          <h1 className="text-5xl font-sue text-pink-600">Shangri-La</h1>

          <p className="text-gray-600 mt-4">Sistema de gestión del gremio</p>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          🌸 Iniciar Sesión
        </h2>

        <div className="space-y-4">
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="👤 Nombre"
          />

          <Input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="🔒 Contraseña"
          />

          <div className="flex justify-center">
            <Button
              variant="primary"
              onClick={manejarLogin}
              disabled={cargando}
            >
              {cargando ? "Ingresando..." : "Ingresar"}
            </Button>
          </div>
        </div>
      </div>

      {mostrarCambioClave && (
        <ModalCambiarClave
          usuario={usuarioActual}
          onSuccess={(usuarioActualizado) => {
            localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

            iniciarSesion(usuarioActualizado);
            setMostrarCambioClave(false);
            navigate("/");
          }}
        />
      )}
    </div>
  );
}

export default Login;
