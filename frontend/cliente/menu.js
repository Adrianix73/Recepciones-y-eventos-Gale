document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'http://localhost:8080';
  const ENDPOINTS = {
    categorias: `${API_BASE}/api/categorias`,
    productos:  `${API_BASE}/api/productos`
  };

  const categoriasContainer = document.getElementById('categorias-container');
  const menuStatus          = document.getElementById('menu-status');
  const noResults           = document.getElementById('search-no-results');
  const searchInput    = document.getElementById('header-search');
  const categoryFilter = document.getElementById('header-categorias');

  const modalEl          = document.getElementById('product-modal');
  const modalImg         = document.getElementById('modal-img');
  const modalTitle       = document.getElementById('modal-title');
  const modalCategory    = document.getElementById('modal-category');
  const modalDescription = document.getElementById('modal-description');
  const modalPrice       = document.getElementById('modal-price');

  // Bootstrap se encarga de abrir/cerrar el modal
  const bsModal = new bootstrap.Modal(modalEl);

  const state = {
    categorias:           [],
    productos:            [],
    textoBusqueda:        '',
    categoriaSeleccionada: 'todas'
  };

  init();

  async function init() {
    bindEvents();
    await cargarDatos();
  }

  function bindEvents() {
    searchInput.addEventListener('input', (e) => {
      state.textoBusqueda = e.target.value.trim().toLowerCase();
      renderizarMenu();
    });

    categoryFilter.addEventListener('change', (e) => {
      state.categoriaSeleccionada = e.target.value;
      renderizarMenu();
    });

    // Delegación de eventos: un solo listener para todos los botones
    categoriasContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-producto-id]');
      if (!btn) return;

      const producto = state.productos.find(p => p.id === Number(btn.dataset.productoId));
      if (producto) abrirModal(producto);
    });
  }

  async function cargarDatos() {
    try {
      mostrarEstado('Cargando menú...');
      ocultarNoResultados();

      const [resCat, resProd] = await Promise.all([
        fetch(ENDPOINTS.categorias),
        fetch(ENDPOINTS.productos)
      ]);

      if (!resCat.ok)  throw new Error('Error al cargar categorías');
      if (!resProd.ok) throw new Error('Error al cargar productos');

      const categorias = await resCat.json();
      const productos  = await resProd.json();

      state.categorias = Array.isArray(categorias) ? categorias : [];
      state.productos  = Array.isArray(productos)
        ? productos.filter(p => p.fechaDesactivacion === null)
        : [];

      llenarFiltroCategorias();
      renderizarMenu();
    } catch (error) {
      console.error(error);
      mostrarEstado('Error al cargar el menú. Verifica que el backend esté encendido.');
      categoriasContainer.innerHTML = '';
    }
  }

  function llenarFiltroCategorias() {
  const options = state.categorias
    .map(c => `<option value="${c.id}">${escapeHtml(c.nombreCategoria)}</option>`)
    .join('');

  categoryFilter.innerHTML = `<option value="todas">Categorías</option>${options}`;
}

  function renderizarMenu() {
    const productos = filtrarProductos();

    if (productos.length === 0) {
      categoriasContainer.innerHTML = '';
      ocultarEstado();
      mostrarNoResultados();
      return;
    }

    ocultarNoResultados();
    ocultarEstado();

    categoriasContainer.innerHTML = state.categorias
      .map(categoria => {
        const items = productos.filter(p =>
          p.categoria && String(p.categoria.id) === String(categoria.id)
        );

        if (items.length === 0) return '';

        return `
          <section>
            <div class="d-flex align-items-center gap-3 flex-wrap mb-3">
              <h2 class="categoria-title">${escapeHtml(categoria.nombreCategoria)}</h2>
              <span class="menu-badge">${items.length} producto(s)</span>
            </div>

            <div class="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-xl-5 g-3">
              ${items.map(crearCardProducto).join('')}
            </div>
          </section>
        `;
      })
      .join('');
  }

  function filtrarProductos() {
    return state.productos.filter(p => {
      const coincideCategoria =
        state.categoriaSeleccionada === 'todas' ||
        (p.categoria && String(p.categoria.id) === String(state.categoriaSeleccionada));

      const texto = `${p.nombreProducto || ''} ${p.descripcion || ''} ${p.categoria?.nombreCategoria || ''}`
        .toLowerCase();

      return coincideCategoria && texto.includes(state.textoBusqueda);
    });
  }

  function crearCardProducto(p) {
    const img = resolverImagen(p.imagen);

    return `
      <div class="col">
        <div class="card h-100 product-card" data-producto-id="${p.id}">
          <div class="product-image-wrap">
            <img
              src="${img}"
              alt="${escapeHtml(p.nombreProducto || 'Producto')}"
              class="product-image"
              onerror="this.src='img/logo-rdr-madera.webp'"
            />
          </div>

          <div class="card-body d-flex flex-column gap-2 p-3">
            <h6 class="card-title mb-0">${escapeHtml(p.nombreProducto || 'Sin nombre')}</h6>
            <p class="card-text text-secondary small flex-grow-1">
              ${escapeHtml(p.descripcion || 'Sin descripción.')}
            </p>
            <p class="product-price mb-0">${formatearPrecio(p.precioActual)}</p>
          </div>
        </div>
      </div>
    `;
  }

  function abrirModal(p) {
    modalImg.src         = resolverImagen(p.imagen);
    modalImg.alt         = p.nombreProducto || 'Producto';
    modalTitle.textContent       = p.nombreProducto || 'Sin nombre';
    modalCategory.textContent    = p.categoria?.nombreCategoria || 'Sin categoría';
    modalDescription.textContent = p.descripcion || 'Sin descripción.';
    modalPrice.textContent       = formatearPrecio(p.precioActual);

    bsModal.show();
  }

  function resolverImagen(ruta) {
    if (!ruta) return 'img/logo-rdr-madera.webp';
    if (ruta.startsWith('http://') || ruta.startsWith('https://')) return ruta;
    if (ruta.startsWith('/')) return `${API_BASE}${ruta}`;
    return `${API_BASE}/${ruta}`;
  }

  function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(Number(precio || 0));
  }

  function mostrarEstado(msg) {
    menuStatus.textContent = msg;
    menuStatus.classList.remove('hidden');
  }

  function ocultarEstado()       { menuStatus.classList.add('hidden'); }
  function mostrarNoResultados() { noResults.classList.remove('hidden'); }
  function ocultarNoResultados() { noResults.classList.add('hidden'); }

  function escapeHtml(texto) {
    return String(texto)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}); 