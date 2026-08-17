import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Flores from "./pages/Flores";
import Miembros from "./pages/Miembros";
import Coleccion from "./pages/Coleccion";
import Objetivos from "./pages/Objetivos";
import Admin from "./pages/Admin";

function App() {

  const [usuario, setUsuario] = useState(() => {

    const usuarioGuardado =
      localStorage.getItem("usuario");

    return usuarioGuardado
      ? JSON.parse(usuarioGuardado)
      : null;
  });


  if (!usuario) {

    return (
      <Login
        iniciarSesion={setUsuario}
      />
    );

  }


  return (
    <div>

      <Navbar usuario={usuario} />

      <div className="pt-20">

        <Routes>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/objetivos"
            element={
              <Objetivos usuario={usuario} />
            }
          />

          <Route
            path="/flores"
            element={
              <Flores usuario={usuario} />
            }
          />

          <Route
            path="/miembros"
            element={
              <Miembros usuario={usuario} />
            }
          />

          <Route
            path="/coleccion"
            element={
              <Coleccion usuario={usuario} />
            }
          />

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