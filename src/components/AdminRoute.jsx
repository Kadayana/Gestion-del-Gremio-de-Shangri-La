import { Navigate } from "react-router-dom";
import { esAdmin } from "../utils/permisos.js";

function AdminRoute({ usuario, children }) {

  if (!esAdmin(usuario)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;