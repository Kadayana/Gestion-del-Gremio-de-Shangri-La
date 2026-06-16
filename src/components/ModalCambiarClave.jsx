import { useState } from "react";
import { supabase } from "../services/supabase";
import Button from "./Button";
import Input from "./Input";

function ModalCambiarClave({
  usuario,
  onSuccess,
}) {

  const [nuevaClave, setNuevaClave] =
    useState("");

  async function guardarClave() {

    if (!nuevaClave) return;

    const { error } =
      await supabase
        .from("miembros")
        .update({
          clave: nuevaClave,
          primer_ingreso: false,
        })
        .eq("id", usuario.id);

    if (error) {
      console.error(error);
      return;
    }

    onSuccess();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-3xl p-6 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-4">
          🔒 Cambiar Contraseña
        </h2>

        <p className="text-center text-gray-500 mb-4">
          Es tu primer ingreso.
        </p>

        <Input
          type="password"
          value={nuevaClave}
          onChange={(e) =>
            setNuevaClave(e.target.value)
          }
          placeholder="Nueva contraseña"
        />

        <div className="flex justify-center mt-4">

          <Button
            variant="primary"
            onClick={guardarClave}
          >
            Guardar
          </Button>

        </div>

      </div>

    </div>
  );
}

export default ModalCambiarClave;