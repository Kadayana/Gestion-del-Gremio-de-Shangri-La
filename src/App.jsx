import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Flores from "./pages/Flores";
import Miembros from "./pages/Miembros";
import Coleccion from "./pages/Coleccion";

function App() {
  const [usuario, setUsuario] = useState(
    JSON.parse(
      localStorage.getItem("usuario")
    )
  );

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
            path="/flores"
            element={<Flores />}
          />

          <Route
            path="/miembros"
            element={<Miembros />}
          />

          <Route
            path="/coleccion"
            element={<Coleccion />}
          />



        </Routes>
      </div>
    </div>
  );
}

export default App;