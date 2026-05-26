// ============================================================
// CONFIG
// ============================================================
const API_BASE = "http://localhost:8080/api";

// ============================================================
// VARIABLES GLOBALES
// ============================================================
let filtroNombre = "";
let idProductoAEditar = null;
let idProductoEliminar = null;
let idProductoRestaurar = null;
let filtroEstadoActual = "activos";
let todasLasCategorias = [];
let todosLosProductos = [];

let archivoImagenCrear = null;
let archivoImagenEditar = null;

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  cargarCategorias();

  configurarBuscador();
  configurarZonaImagen("crear");
  configurarZonaImagen("editar");

  document.getElementById("btn-confirmar-crear").addEventListener("click", registrarProducto);
  document.getElementById("btn-guardar-edicion").addEventListener("click", guardarEdicionProducto);

  document.getElementById("btn-confirmar-eliminar").addEventListener("click", async () => {
    try {
      const r = await fetch(`${API_BASE}/productos/${idProductoEliminar}/desactivar`, {
        method: "PUT"
      });
      if (!r.ok) throw new Error();

      bootstrap.Modal.getInstance(document.getElementById("modalEliminarProducto")).hide();
      await cargarProductos();
    } catch {
      alert("Error al retirar el producto.");
    }
  });

  document.getElementById("btn-confirmar-restaurar").addEventListener("click", async () => {
    try {
      const r = await fetch(`${API_BASE}/productos/${idProductoRestaurar}/activar`, {
        method: "PUT"
      });
      if (!r.ok) throw new Error();

      bootstrap.Modal.getInstance(document.getElementById("modalRestaurarProducto")).hide();
      await cargarProductos();
    } catch {
      alert("Error al restaurar el producto.");
    }
  });
});

// ============================================================
// BUSCADOR
// ============================================================
function configurarBuscador() {
  const inputBuscar = document.getElementById("buscador-producto");
  const btnLimpiar = document.getElementById("btn-limpiar-busqueda");

  inputBuscar.addEventListener("input", () => {
    filtroNombre = inputBuscar.value.trim().toLowerCase();
    aplicarFiltros();
  });

  btnLimpiar.addEventListener("click", () => {
    inputBuscar.value = "";
    filtroNombre = "";
    aplicarFiltros();
    inputBuscar.focus();
  });
}

// ============================================================
// CARGAR PRODUCTOS
// ============================================================
async function cargarProductos() {
  try {
    const r = await fetch(`${API_BASE}/productos`);
    if (!r.ok) throw new Error();

    const data = await r.json();
    todosLosProductos = data;
    aplicarFiltros();
  } catch {
    document.getElementById("tabla-producto").innerHTML = `
      <tr>
        <td colspan="8" class="text-center">Error al cargar los datos. Verifica tu servidor.</td>
      </tr>
    `;
  }
}

// ============================================================
// CARGAR CATEGORÍAS
// ============================================================
async function cargarCategorias() {
  try {
    const r = await fetch(`${API_BASE}/categorias`);
    if (!r.ok) throw new Error();

    const data = await r.json();
    todasLasCategorias = data;
    llenarSelectCategorias(data);
  } catch {
    console.error("Error al cargar categorías");
  }
}

function llenarSelectCategorias(categorias) {
  const selectFiltro = document.getElementById("filtro-categoria");
  const selectCrear = document.getElementById("crear-categoria");
  const selectEditar = document.getElementById("editar-categoria");

  const valorFiltroActual = selectFiltro.value;
  const valorCrearActual = selectCrear.value;
  const valorEditarActual = selectEditar ? selectEditar.value : "";

  selectFiltro.innerHTML = `<option value="">Todas las categorías</option>`;
  selectCrear.innerHTML = `<option value="">Seleccionar categoría...</option>`;
  if (selectEditar) {
    selectEditar.innerHTML = `<option value="">Seleccionar categoría...</option>`;
  }

  categorias.forEach(categoria => {
    const optionFiltro = document.createElement("option");
    optionFiltro.value = categoria.nombreCategoria;
    optionFiltro.textContent = categoria.nombreCategoria;
    selectFiltro.appendChild(optionFiltro);

    const optionCrear = document.createElement("option");
    optionCrear.value = categoria.id;
    optionCrear.textContent = categoria.nombreCategoria;
    selectCrear.appendChild(optionCrear);

    if (selectEditar) {
      const optionEditar = document.createElement("option");
      optionEditar.value = categoria.id;
      optionEditar.textContent = categoria.nombreCategoria;
      selectEditar.appendChild(optionEditar);
    }
  });

  selectFiltro.value = valorFiltroActual;
  selectCrear.value = valorCrearActual;
  if (selectEditar && valorEditarActual) {
    selectEditar.value = valorEditarActual;
  }
}

// ============================================================
// FILTROS
// ============================================================
window.aplicarFiltro = function(tipo, btn) {
  filtroEstadoActual = tipo;

  document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("activo"));
  btn.classList.add("activo");

  const colFecha = document.querySelectorAll(".col-fecha-retiro");
  colFecha.forEach(col => {
    col.classList.toggle("d-none", tipo !== "inactivos");
  });

  aplicarFiltros();
};

window.aplicarFiltroCategoria = function() {
  aplicarFiltros();
};

function aplicarFiltros() {
  const categoria = document.getElementById("filtro-categoria").value;
  let datos = [...todosLosProductos];

  if (filtroEstadoActual === "activos") {
    datos = datos.filter(p => p.fechaDesactivacion === null || p.fechaDesactivacion === undefined);
  } else if (filtroEstadoActual === "inactivos") {
    datos = datos.filter(p => p.fechaDesactivacion !== null && p.fechaDesactivacion !== undefined);
  }

  if (categoria) {
    datos = datos.filter(p => p.categoria?.nombreCategoria === categoria);
  }

  if (filtroNombre) {
    datos = datos.filter(p =>
      (p.nombreProducto ?? "").toLowerCase().includes(filtroNombre)
    );
  }

  renderTabla(datos);
}

// ============================================================
// RENDER TABLA
// ============================================================
function renderTabla(datos) {
  const tbody = document.getElementById("tabla-producto");
  tbody.innerHTML = "";

  if (datos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center">No hay productos para mostrar.</td>
      </tr>
    `;
    return;
  }

  datos.forEach(producto => {
    const estaActivo = producto.fechaDesactivacion === null || producto.fechaDesactivacion === undefined;

    const badge = estaActivo
      ? `<span class="badge bg-success">Disponible</span>`
      : `<span class="badge bg-secondary">No disponible</span>`;

    const botones = estaActivo
      ? `
        <button class="btn btn-sm btn-accion me-2"
                data-id="${producto.id}"
                onclick="editarProducto(this)">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn btn-sm btn-accion"
                data-id="${producto.id}"
                data-nombre="${producto.nombreProducto}"
                onclick="eliminarProducto(this)">
          <i class="fa-solid fa-trash"></i>
        </button>
      `
      : `
        <button class="btn btn-sm btn-accion"
                data-id="${producto.id}"
                data-nombre="${producto.nombreProducto}"
                onclick="restaurarProducto(this)">
          <i class="fa-solid fa-rotate-left"></i>
        </button>
      `;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.categoria?.nombreCategoria ?? "—"}</td>
      <td>${producto.nombreProducto ?? "—"}</td>
      <td>S/ ${Number(producto.precioActual ?? 0).toFixed(2)}</td>
      <td>${producto.descripcion ?? "—"}</td>
      <td>${badge}</td>
      <td class="col-fecha-retiro ${filtroEstadoActual !== "inactivos" ? "d-none" : ""}">
        ${producto.fechaDesactivacion ?? "—"}
      </td>
      <td>${botones}</td>
    `;

    tbody.appendChild(fila);
  });
}

// ============================================================
// ABRIR MODAL CREAR
// ============================================================
window.abrirModalCrear = function() {
  limpiarFormularioCrear();
  bootstrap.Modal.getOrCreateInstance(document.getElementById("modalCrearProducto")).show();
};

// ============================================================
// CREAR PRODUCTO
// ============================================================
async function registrarProducto() {
  const nombre = document.getElementById("crear-nombre").value.trim();
  const precio = document.getElementById("crear-precio").value.trim();
  const descripcion = document.getElementById("crear-descripcion").value.trim();
  const categoriaId = document.getElementById("crear-categoria").value;

  if (!nombre || !precio || !categoriaId) {
    alert("Nombre, precio y categoría son obligatorios.");
    return;
  }

  try {
    const r = await fetch(`${API_BASE}/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombreProducto: nombre,
        precioActual: parseFloat(precio),
        descripcion: descripcion,
        categoriaId: parseInt(categoriaId)
      })
    });

    if (!r.ok) throw new Error("Error al crear producto");

    const productoCreado = await r.json();

    if (archivoImagenCrear) {
      await subirImagenProducto(productoCreado.id, archivoImagenCrear, "POST");
    }

    bootstrap.Modal.getInstance(document.getElementById("modalCrearProducto")).hide();
    limpiarFormularioCrear();
    await cargarProductos();
    alert("Producto registrado correctamente.");
  } catch (error) {
    console.error(error);
    alert("Error al registrar el producto.");
  }
}

// ============================================================
// ABRIR MODAL EDITAR
// ============================================================
window.editarProducto = function(btn) {
  idProductoAEditar = Number(btn.dataset.id);

  const producto = todosLosProductos.find(p => Number(p.id) === idProductoAEditar);
  if (!producto) {
    alert("No se encontró el producto a editar.");
    return;
  }

  document.getElementById("editar-nombre").value = producto.nombreProducto ?? "";
  document.getElementById("editar-precio").value = producto.precioActual ?? "";
  document.getElementById("editar-descripcion").value = producto.descripcion ?? "";
  document.getElementById("editar-categoria").value = producto.categoria?.id ?? "";

  archivoImagenEditar = null;

  const urlImagenActual = construirUrlImagen(producto);
  if (urlImagenActual) {
    mostrarPreviewExistente("editar", urlImagenActual, "Imagen actual del producto");
  } else {
    resetZonaImagen("editar");
  }

  bootstrap.Modal.getOrCreateInstance(document.getElementById("modalEditarProducto")).show();
};

// ============================================================
// GUARDAR EDICIÓN
// ============================================================
async function guardarEdicionProducto() {
  if (!idProductoAEditar) {
    alert("No hay producto seleccionado para editar.");
    return;
  }

  const nombre = document.getElementById("editar-nombre").value.trim();
  const precio = document.getElementById("editar-precio").value.trim();
  const descripcion = document.getElementById("editar-descripcion").value.trim();
  const categoriaId = document.getElementById("editar-categoria").value;

  if (!nombre || !precio || !categoriaId) {
    alert("Nombre, precio y categoría son obligatorios.");
    return;
  }

  try {
    const r = await fetch(`${API_BASE}/productos/${idProductoAEditar}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombreProducto: nombre,
        precioActual: parseFloat(precio),
        descripcion: descripcion,
        categoriaId: parseInt(categoriaId)
      })
    });

    if (!r.ok) throw new Error("Error al actualizar producto");

    if (archivoImagenEditar) {
      await subirImagenProducto(idProductoAEditar, archivoImagenEditar, "PUT");
    }

    bootstrap.Modal.getInstance(document.getElementById("modalEditarProducto")).hide();
    await cargarProductos();
    alert("Producto actualizado correctamente.");
  } catch (error) {
    console.error(error);
    alert("Ocurrió un error al guardar los cambios.");
  }
}

// ============================================================
// SUBIR / REEMPLAZAR IMAGEN
// ============================================================
async function subirImagenProducto(idProducto, archivo, metodo) {
  const formData = new FormData();
  formData.append("imagen", archivo);

  const r = await fetch(`${API_BASE}/productos/${idProducto}/imagen`, {
    method: metodo,
    body: formData
  });

  if (!r.ok) {
    throw new Error("No se pudo subir la imagen");
  }

  return await r.json();
}

// ============================================================
// ZONA DE IMAGEN
// ============================================================
function configurarZonaImagen(prefijo) {
  const input = document.getElementById(`${prefijo}-imagen`);
  const zone = document.getElementById(`${prefijo}-upload-zone`);
  const btnSeleccionar = document.getElementById(`${prefijo}-btn-seleccionar`);
  const btnQuitar = document.getElementById(`${prefijo}-btn-quitar-imagen`);

  btnSeleccionar.addEventListener("click", () => input.click());
  zone.addEventListener("click", () => input.click());

  zone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      input.click();
    }
  });

  input.addEventListener("change", () => {
    const archivo = input.files?.[0];
    if (!archivo) return;
    procesarArchivoImagen(prefijo, archivo);
  });

  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("dragover");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("dragover");
  });

  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("dragover");

    const archivo = e.dataTransfer.files?.[0];
    if (!archivo) return;

    input.files = e.dataTransfer.files;
    procesarArchivoImagen(prefijo, archivo);
  });

  btnQuitar.addEventListener("click", () => {
    input.value = "";

    if (prefijo === "crear") {
      archivoImagenCrear = null;
      resetZonaImagen("crear");
    } else {
      archivoImagenEditar = null;
      const producto = todosLosProductos.find(p => Number(p.id) === Number(idProductoAEditar));
      const urlImagenActual = construirUrlImagen(producto);

      if (urlImagenActual) {
        mostrarPreviewExistente("editar", urlImagenActual, "Imagen actual del producto");
      } else {
        resetZonaImagen("editar");
      }
    }
  });
}

function procesarArchivoImagen(prefijo, archivo) {
  if (!archivo.type.startsWith("image/")) {
    alert("Solo se permiten archivos de imagen.");
    return;
  }

  if (prefijo === "crear") {
    archivoImagenCrear = archivo;
  } else {
    archivoImagenEditar = archivo;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    mostrarPreviewArchivo(prefijo, e.target.result, archivo.name);
  };
  reader.readAsDataURL(archivo);
}

function mostrarPreviewArchivo(prefijo, src, nombreArchivo) {
  const placeholder = document.getElementById(`${prefijo}-upload-placeholder`);
  const previewBox = document.getElementById(`${prefijo}-preview-box`);
  const previewImg = document.getElementById(`${prefijo}-preview-img`);
  const previewName = document.getElementById(`${prefijo}-preview-name`);
  const btnQuitar = document.getElementById(`${prefijo}-btn-quitar-imagen`);
  const previewHelp = document.getElementById(`${prefijo}-preview-help`);

  placeholder.classList.add("d-none");
  previewBox.classList.remove("d-none");
  previewImg.src = src;
  previewName.textContent = nombreArchivo;
  btnQuitar.classList.remove("d-none");

  if (previewHelp) {
    previewHelp.textContent = "Se reemplazará la imagen actual cuando guardes los cambios.";
  }
}

function mostrarPreviewExistente(prefijo, src, texto) {
  const placeholder = document.getElementById(`${prefijo}-upload-placeholder`);
  const previewBox = document.getElementById(`${prefijo}-preview-box`);
  const previewImg = document.getElementById(`${prefijo}-preview-img`);
  const previewName = document.getElementById(`${prefijo}-preview-name`);
  const btnQuitar = document.getElementById(`${prefijo}-btn-quitar-imagen`);
  const previewHelp = document.getElementById(`${prefijo}-preview-help`);

  placeholder.classList.add("d-none");
  previewBox.classList.remove("d-none");
  previewImg.src = src;
  previewName.textContent = texto;
  btnQuitar.classList.add("d-none");

  if (previewHelp) {
    previewHelp.textContent = "Si no seleccionas una nueva imagen, se conservará la actual.";
  }
}

function resetZonaImagen(prefijo) {
  const placeholder = document.getElementById(`${prefijo}-upload-placeholder`);
  const previewBox = document.getElementById(`${prefijo}-preview-box`);
  const previewImg = document.getElementById(`${prefijo}-preview-img`);
  const previewName = document.getElementById(`${prefijo}-preview-name`);
  const btnQuitar = document.getElementById(`${prefijo}-btn-quitar-imagen`);
  const previewHelp = document.getElementById(`${prefijo}-preview-help`);

  placeholder.classList.remove("d-none");
  previewBox.classList.add("d-none");
  previewImg.src = "";
  previewName.textContent = "";
  btnQuitar.classList.add("d-none");

  if (previewHelp) {
    previewHelp.textContent = "Si no seleccionas una nueva imagen, se conservará la actual.";
  }
}

// ============================================================
// HELPERS
// ============================================================
function limpiarFormularioCrear() {
  document.getElementById("form-crear-producto").reset();
  archivoImagenCrear = null;
  resetZonaImagen("crear");
}

function construirUrlImagen(producto) {
  if (!producto) return null;

  if (producto.imagen && typeof producto.imagen === "string") {
    if (producto.imagen.startsWith("http")) {
      return producto.imagen;
    }
    return `http://localhost:8080${producto.imagen}`;
  }

  return null;
}

// ============================================================
// ELIMINAR / RESTAURAR
// ============================================================
window.eliminarProducto = function(btn) {
  idProductoEliminar = btn.dataset.id;
  document.getElementById("modal-eliminar-mensaje").textContent =
    `¿Retirar "${btn.dataset.nombre}" del menú? El producto no se eliminará permanentemente.`;

  bootstrap.Modal.getOrCreateInstance(document.getElementById("modalEliminarProducto")).show();
};

window.restaurarProducto = function(btn) {
  idProductoRestaurar = btn.dataset.id;
  document.getElementById("modal-restaurar-mensaje").textContent =
    `¿Restaurar "${btn.dataset.nombre}" al menú?`;

  bootstrap.Modal.getOrCreateInstance(document.getElementById("modalRestaurarProducto")).show();
};