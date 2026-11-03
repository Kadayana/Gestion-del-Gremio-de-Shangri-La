import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function respuesta(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return respuesta({ error: "Método no permitido." }, 405);
  }

  try {
    const url = Deno.env.get("SUPABASE_URL");
    const publishableKeys = JSON.parse(
      Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") || "{}",
    );
    const secretKeys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");

    const publishableKey =
      publishableKeys.default || Deno.env.get("SUPABASE_ANON_KEY");

    const secretKey =
      secretKeys.default || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!url || !publishableKey || !secretKey) {
      return respuesta({ error: "Falta configuración del servidor." }, 500);
    }

    // Comprobar la sesión de quien llama a la función.
    const authHeader = req.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return respuesta({ error: "Debes iniciar sesión." }, 401);
    }

    const token = authHeader.slice(7);

    const supabaseAuth = createClient(url, publishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: authData, error: authError } =
      await supabaseAuth.auth.getUser(token);

    if (authError || !authData.user) {
      return respuesta({ error: "Sesión no válida." }, 401);
    }

    // Cliente administrativo: solo se utiliza dentro del servidor.
    const supabaseAdmin = createClient(url, secretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Verificar que quien ejecuta sea exactamente el Admin ID 2.
    const { data: admin, error: adminError } = await supabaseAdmin
      .from("miembros")
      .select("id, rol, auth_user_id")
      .eq("id", 2)
      .maybeSingle();

    if (
      adminError ||
      !admin ||
      admin.rol !== "Admin" ||
      admin.auth_user_id !== authData.user.id
    ) {
      return respuesta(
        { error: "No tienes permiso para migrar cuentas." },
        403,
      );
    }

    // Obtener miembros que todavía no tienen cuenta Auth.
    const { data: miembros, error: miembrosError } = await supabaseAdmin
      .from("miembros")
      .select("id, nombre, clave, auth_user_id")
      .is("auth_user_id", null)
      .not("clave", "is", null)
      .order("id");

    if (miembrosError) {
      return respuesta(
        { error: "No se pudieron consultar los miembros." },
        500,
      );
    }

    // Consultar usuarios Auth existentes para poder reanudar una migración.
    const { data: usuariosAuth, error: usuariosError } =
      await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

    if (usuariosError) {
      return respuesta(
        { error: "No se pudieron consultar las cuentas Auth." },
        500,
      );
    }

    let creadas = 0;
    let vinculadas = 0;
    let omitidas = 0;
    const errores: { id: number; nombre: string }[] = [];

    for (const miembro of miembros || []) {
      const correo = `miembro-${miembro.id}@cozyguild.invalid`;

      if (!miembro.clave) {
        omitidas++;
        continue;
      }

      // Si la cuenta ya existe, reutilizarla en lugar de duplicarla.
      let usuarioAuth = usuariosAuth.users.find(
        (user: { email?: string }) => user.email === correo,
      );

      if (!usuarioAuth) {
        const { data: nuevaCuenta, error: crearError } =
          await supabaseAdmin.auth.admin.createUser({
            email: correo,
            password: miembro.clave,
            email_confirm: true,
          });

        if (crearError || !nuevaCuenta.user) {
          errores.push({ id: miembro.id, nombre: miembro.nombre });
          continue;
        }

        usuarioAuth = nuevaCuenta.user;
        creadas++;
      }

      // Vincular la cuenta Auth al miembro.
      const { error: vincularError } = await supabaseAdmin
        .from("miembros")
        .update({ auth_user_id: usuarioAuth.id })
        .eq("id", miembro.id)
        .is("auth_user_id", null);

      if (vincularError) {
        errores.push({ id: miembro.id, nombre: miembro.nombre });
        continue;
      }

      vinculadas++;
    }

    return respuesta({
      mensaje: "Proceso de migración finalizado.",
      cuentasCreadas: creadas,
      cuentasVinculadas: vinculadas,
      omitidas,
      errores,
      totalProcesadas: (miembros || []).length,
    });
  } catch (error) {
    console.error("Error en migrar-miembros:", error);
    return respuesta({ error: "Error interno durante la migración." }, 500);
  }
});
