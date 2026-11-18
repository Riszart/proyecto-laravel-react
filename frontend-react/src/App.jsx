import { Link, NavLink, Navigate, Route, Routes } from "react-router-dom";
import Productos from "./pages/Productos";
import Categorias from "./pages/Categorias";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/productos" aria-label="Distribuidora Nova, ir al catálogo">
            <span className="brand-mark" aria-hidden="true">
              N
            </span>
            <span className="brand-text">
              <strong>Distribuidora</strong>
              <small>Nova</small>
            </span>
          </Link>

          <nav className="site-nav" aria-label="Navegación principal">
            <NavLink to="/productos" className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}>
              Productos
            </NavLink>
            <NavLink to="/categorias" className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}>
              Categorías
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/productos" replace />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="*" element={<Navigate to="/productos" replace />} />
          </Routes>
        </div>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} Distribuidora Nova · Catálogo</span>
          <span className="footer-dot" aria-hidden="true" />
          <span>Gestión de productos y categorías</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
