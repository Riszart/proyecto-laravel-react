import { useEffect, useMemo, useState } from "react";

const TONOS = ["#4f46e5", "#0b8f63", "#b26a00", "#c2374b", "#0e7490", "#7c3aed"];

async function pedirCategorias() {
  const respuesta = await fetch("http://127.0.0.1:8000/api/categorias");
  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener las categorías");
  }
  const datos = await respuesta.json();
  return Array.isArray(datos) ? datos : datos?.data ?? [];
}

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  async function reintentar() {
    setCargando(true);
    setError("");
    try {
      setCategorias(await pedirCategorias());
    } catch (error) {
      setError(error.message || "Ocurrió un error inesperado");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    let activo = true;
    pedirCategorias()
      .then((lista) => {
        if (activo) setCategorias(lista);
      })
      .catch((error) => {
        if (activo) setError(error.message || "Ocurrió un error inesperado");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  const categoriasVisibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return categorias;
    return categorias.filter((categoria) =>
      (categoria.nombre ?? "").toLowerCase().includes(texto)
    );
  }, [categorias, busqueda]);

  return (
    <section>
      <header className="page-head">
        <div>
          <span className="eyebrow">Organización</span>
          <h1 className="page-title">Categorías</h1>
          <p className="page-subtitle">
            Agrupa y organiza tu catálogo para que los clientes encuentren cada producto con facilidad.
          </p>
        </div>

        {!cargando && !error && (
          <span className="count-pill">
            <strong>{categorias.length}</strong> categorías
          </span>
        )}
      </header>

      {cargando && (
        <div className="category-grid" aria-busy="true" aria-label="Cargando categorías">
          {Array.from({ length: 6 }).map((_, indice) => (
            <div className="skeleton-card" key={indice}>
              <div className="skeleton-body">
                <div className="skeleton skeleton-line is-title" />
                <div className="skeleton skeleton-line is-short" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!cargando && error && (
        <div className="state-card is-error" role="alert">
          <span className="state-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
              <path d="M12 8v5m0 3.5h.01M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 className="state-title">No pudimos cargar las categorías</h2>
          <p className="state-text">{error}</p>
          <button type="button" className="btn btn-primary" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && categorias.length === 0 && (
        <div className="state-card">
          <span className="state-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
              <path d="M4 5.5h6l1.6 2H20v11H4v-13Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 className="state-title">Aún no hay categorías</h2>
          <p className="state-text">Cuando registres categorías, aparecerán aquí automáticamente.</p>
        </div>
      )}

      {!cargando && !error && categorias.length > 0 && (
        <>
          <div className="toolbar">
            <label className="search-field">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
                <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Buscar categoría…"
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
                aria-label="Buscar categorías"
              />
            </label>

            <p className="results-note" style={{ margin: 0 }}>
              <strong>{categoriasVisibles.length}</strong> de {categorias.length} categorías
            </p>
          </div>

          {categoriasVisibles.length === 0 ? (
            <div className="state-card">
              <span className="state-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
                  <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </span>
              <h2 className="state-title">Sin resultados</h2>
              <p className="state-text">No encontramos categorías que coincidan con tu búsqueda.</p>
              <button type="button" className="btn btn-ghost" onClick={() => setBusqueda("")}>
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div className="category-grid">
              {categoriasVisibles.map((categoria, indice) => (
                <article
                  className="category-card"
                  key={categoria.id}
                  style={{ "--tone": TONOS[indice % TONOS.length] }}
                >
                  <span className="category-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                      <path d="M4 5.5h6l1.6 2H20v11H4v-13Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                      <path d="M8 12.5h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div className="category-body">
                    <h2 className="category-name">{categoria.nombre}</h2>
                    <p className="category-meta">Categoría de productos</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Categorias;
