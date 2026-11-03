import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Flores from "./pages/Flores.jsx";
import Miembros from "./pages/Miembros.jsx";
import Coleccion from "./pages/Coleccion.jsx";
import Objetivos from "./pages/Objetivos.jsx";
import Admin from "./pages/Admin.jsx";

function App() {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem("usuario");
    return guardado ? JSON.parse(guardado) : null;
  });

  if (!usuario) {
    return <Login iniciarSesion={setUsuario} />;
  }

  return (
    <div>
      <Navbar usuario={usuario} />

      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/objetivos" element={<Objetivos usuario={usuario} />} />

          <Route path="/flores" element={<Flores usuario={usuario} />} />

          <Route path="/miembros" element={<Miembros usuario={usuario} />} />

          <Route path="/coleccion" element={<Coleccion usuario={usuario} />} />

          <Route
            path="/admin"
            element={
              <AdminRoute usuario={usuario}>
                <Admin usuario={usuario} />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
