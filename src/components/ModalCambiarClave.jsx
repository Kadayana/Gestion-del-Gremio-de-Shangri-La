import { useState } from "react";
import { supabase } from "../services/supabase.js";
import Button from "./Button.jsx";
import Input from "./Input.jsx";

function ModalCambiarClave({ usuario, onSuccess }) {
  const [nuevaClave, setNuevaClave] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function guardarClave() {
    if (!nuevaClave || nuevaClave.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setGuardando(true);

    // Actualizar la contraseña en Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
      password: nuevaClave,
    });

    if (authError) {
      console.error(authError);
      alert("No se pudo actualizar la contraseña: " + authError.message);
      setGuardando(false);
      return;
    }

    // Marcar que el primer ingreso ya fue completado
    const { error: dbError } = await supabase
      .from("miembros")
      .update({ primer_ingreso: false })
      .eq("id", usuario.id);

    if (dbError) {
      console.error(dbError);
      alert(
        "La contraseña cambió, pero no se pudo actualizar el registro. Contacta al administrador.",
      );
      setGuardando(false);
      return;
    }

    onSuccess({
      ...usuario,
      primer_ingreso: false,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-3xl p-6 w-[88%] max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          🔒 Cambiar Contraseña
        </h2>

        <p className="text-center text-gray-500 mb-4">
          Es tu primer ingreso. Crea una contraseña nueva.
        </p>

        <Input
          type="password"
          value={nuevaClave}
          onChange={(e) => setNuevaClave(e.target.value)}
          placeholder="Nueva contraseña"
        />

        <div className="flex justify-center mt-4">
          <Button variant="primary" onClick={guardarClave} disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModalCambiarClave;
