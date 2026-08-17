export function esAdmin(usuario) {
  return usuario?.rol === "Admin";
}

export function esLider(usuario) {
  return usuario?.rol === "Lider";
}

export function esAdminOLider(usuario) {
  return (
    usuario?.rol === "Admin" ||
    usuario?.rol === "Lider"
  );
}