import { useEffect, useMemo, useState } from "react";

const formatoMoneda = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

function obtenerIniciales(nombre = "") {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return "?";
  if (palabras.length === 1) return palabras[0].slice(0, 2).toUpperCase();
  return (palabras[0][0] + palabras[1][0]).toUpperCase();
}

function estadoStock(stock) {
  const cantidad = Number(stock) || 0;
  if (cantidad <= 0) return { clase: "is-out", etiqueta: "Agotado" };
  if (cantidad <= 5) return { clase: "is-low", etiqueta: "Bajo stock" };
  return { clase: "is-ok", etiqueta: "Disponible" };
}

async function pedirProductos() {
  const respuesta = await fetch("http://127.0.0.1:8000/api/productos");
  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los productos");
  }
  const datos = await respuesta.json();
  return Array.isArray(datos) ? datos : datos?.data ?? [];
}

function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");

  async function reintentar() {
    setCargando(true);
    setError("");
    try {
      setProductos(await pedirProductos());
    } catch (error) {
      setError(error.message || "Ocurrió un error inesperado");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    let activo = true;
    pedirProductos()
      .then((lista) => {
        if (activo) setProductos(lista);
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

  const productosVisibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return productos.filter((producto) => {
      const coincideTexto = !texto || (producto.nombre ?? "").toLowerCase().includes(texto);
      const stock = Number(producto.stock) || 0;
      const coincideFiltro =
        filtro === "todos" ||
        (filtro === "disponibles" ? stock > 0 : stock === 0);
      return coincideTexto && coincideFiltro;
    });
  }, [productos, busqueda, filtro]);

  return (
    <section>
      <header className="page-head">
        <div>
          <span className="eyebrow">Inventario</span>
          <h1 className="page-title">Catálogo de productos</h1>
          <p className="page-subtitle">
            Consulta disponibilidad, stock y precios actualizados de todos los productos registrados.
          </p>
        </div>

        {!cargando && !error && (
          <span className="count-pill">
            <strong>{productos.length}</strong> productos
          </span>
        )}
      </header>

      {cargando && (
        <div className="product-grid" aria-busy="true" aria-label="Cargando productos">
          {Array.from({ length: 6 }).map((_, indice) => (
            <div className="skeleton-card" key={indice}>
              <div className="skeleton skeleton-thumb" />
              <div className="skeleton-body">
                <div className="skeleton skeleton-line is-title" />
                <div className="skeleton skeleton-line" />
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
          <h2 className="state-title">No pudimos cargar los productos</h2>
          <p className="state-text">{error}</p>
          <button type="button" className="btn btn-primary" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && productos.length === 0 && (
        <div className="state-card">
          <span className="state-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
              <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="m4.4 8.7 7.6 4.3 7.6-4.3M12 13v6.6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 className="state-title">Aún no hay productos</h2>
          <p className="state-text">Cuando registres productos, aparecerán aquí automáticamente.</p>
        </div>
      )}

      {!cargando && !error && productos.length > 0 && (
        <>
          <div className="toolbar">
            <label className="search-field">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
                <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Buscar producto por nombre…"
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
                aria-label="Buscar productos"
              />
            </label>

            <div className="filter-group" role="group" aria-label="Filtrar por disponibilidad">
              {[
                { valor: "todos", etiqueta: "Todos" },
                { valor: "disponibles", etiqueta: "Disponibles" },
                { valor: "agotados", etiqueta: "Agotados" },
              ].map((opcion) => (
                <button
                  key={opcion.valor}
                  type="button"
                  className={`chip${filtro === opcion.valor ? " is-active" : ""}`}
                  onClick={() => setFiltro(opcion.valor)}
                  aria-pressed={filtro === opcion.valor}
                >
                  {opcion.etiqueta}
                </button>
              ))}
            </div>
          </div>

          <p className="results-note">
            Mostrando <strong>{productosVisibles.length}</strong> de {productos.length} productos
          </p>

          {productosVisibles.length === 0 ? (
            <div className="state-card">
              <span className="state-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
                  <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </span>
              <h2 className="state-title">Sin resultados</h2>
              <p className="state-text">
                No encontramos productos que coincidan con la búsqueda o el filtro seleccionado.
              </p>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setBusqueda("");
                  setFiltro("todos");
                }}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {productosVisibles.map((producto) => {
                const stock = Number(producto.stock) || 0;
                const estado = estadoStock(stock);
                return (
                  <article className="product-card" key={producto.id}>
                    <div className="product-thumb" aria-hidden="true">
                      <span className="thumb-initials">{obtenerIniciales(producto.nombre)}</span>
                    </div>

                    <div className="product-body">
                      <div className="product-head">
                        <h2 className="product-name">{producto.nombre}</h2>
                        <span className={`stock-badge ${estado.clase}`}>{estado.etiqueta}</span>
                      </div>

                      {producto.descripcion && (
                        <p className="product-desc">{producto.descripcion}</p>
                      )}

                      <div className="product-footer">
                        <span className="product-price">
                          {formatoMoneda.format(Number(producto.precio) || 0)}
                        </span>
                        <span className="product-stock">
                          Stock: <span>{stock}</span>
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Productos;
