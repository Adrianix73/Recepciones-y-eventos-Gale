// ============================================================
// VARIABLES GLOBALES
// ============================================================
let filtroNombre = "";
let idProductoAEditar   = null;
let idProductoEliminar  = null;
let idProductoRestaurar = null;
let filtroEstadoActual  = "activos";
let todosLosProductos   = [];

document.addEventListener("DOMContentLoaded", () => {

    cargarProductos();

    // ── BUSCADOR: filtra mientras escribes ───────────────────────
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

    // ── MODAL EDITAR ──────────────────────────────────────────
    document.getElementById("btn-si-editar-prod").addEventListener("click", () => {
        bootstrap.Modal.getInstance(
            document.getElementById("modalEditarProducto")
        ).hide();
        window.location.href = `editar-producto.html?id=${idProductoAEditar}`;
    });

    // ── MODAL CREAR ───────────────────────────────────────────
    document.getElementById("btn-confirmar-crear").addEventListener("click", () => {

        const nombre      = document.getElementById("crear-nombre").value.trim();
        const precio      = document.getElementById("crear-precio").value.trim();
        const descripcion = document.getElementById("crear-descripcion").value.trim();
        const categoriaId = document.getElementById("crear-categoria").value;

        if (!nombre || !precio || !categoriaId) {
            alert("Nombre, precio y categoría son obligatorios.");
            return;
        }

        fetch("http://localhost:8080/api/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombreProducto: nombre,
                precioActual:   parseFloat(precio),
                descripcion:    descripcion,
                categoria: { id: parseInt(categoriaId) }
            })
        })
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(() => {
            bootstrap.Modal.getInstance(
                document.getElementById("modalCrearProducto")
            ).hide();
            document.getElementById("form-crear-producto").reset();
            alert("Producto registrado correctamente.");
            cargarProductos();
        })
        .catch(() => alert("Error al registrar el producto."));
    });

    // ── MODAL ELIMINAR ────────────────────────────────────────
    document.getElementById("btn-confirmar-eliminar").addEventListener("click", () => {
        fetch(`http://localhost:8080/api/productos/${idProductoEliminar}/desactivar`, {
            method: "PUT"
        })
        .then(r => { if (!r.ok) throw new Error(); })
        .then(() => {
            bootstrap.Modal.getInstance(
                document.getElementById("modalEliminarProducto")
            ).hide();
            cargarProductos();
        })
        .catch(() => alert("Error al retirar el producto."));
    });

    // ── MODAL RESTAURAR ───────────────────────────────────────
    document.getElementById("btn-confirmar-restaurar").addEventListener("click", () => {
        fetch(`http://localhost:8080/api/productos/${idProductoRestaurar}/activar`, {
            method: "PUT"
        })
        .then(r => { if (!r.ok) throw new Error(); })
        .then(() => {
            bootstrap.Modal.getInstance(
                document.getElementById("modalRestaurarProducto")
            ).hide();
            cargarProductos();
        })
        .catch(() => alert("Error al restaurar el producto."));
    });

});

// ============================================================
// CARGAR PRODUCTOS
// ============================================================
function cargarProductos() {
    fetch("http://localhost:8080/api/productos")
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(data => {
            todosLosProductos = data;
            aplicarFiltros();
        })
        .catch(() => {
            document.getElementById("tabla-producto").innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-danger">
                        <i class="fa-solid fa-triangle-exclamation me-2"></i>
                        Error al cargar los datos. Verifica tu servidor.
                    </td>
                </tr>`;
        });
}

// ============================================================
// FILTROS
// ============================================================
window.aplicarFiltro = function(tipo, btn) {
    filtroEstadoActual = tipo;

    // Resalta el botón activo
    document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");

    // Muestra/oculta columna fecha retiro
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

    let datos = todosLosProductos;

    // Filtro estado
    if (filtroEstadoActual === "activos") {
        datos = datos.filter(p => p.fechaDesactivacion === null || p.fechaDesactivacion === undefined);
    } else if (filtroEstadoActual === "inactivos") {
        datos = datos.filter(p => p.fechaDesactivacion !== null && p.fechaDesactivacion !== undefined);
    }

    // Filtro categoría
    if (categoria) {
        datos = datos.filter(p => p.categoria?.nombreCategoria === categoria);
    }

    // Filtro por nombre (buscador)
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
                <td colspan="8" class="text-center text-muted">
                    No hay productos para mostrar.
                </td>
            </tr>`;
        return;
    }

    datos.forEach(producto => {
        const estaActivo = producto.fechaDesactivacion === null ||
                           producto.fechaDesactivacion === undefined;

        // Badge de estado
        const badge = estaActivo
            ? `<span class="badge bg-success">Disponible</span>`
            : `<span class="badge bg-danger">No disponible</span>`;

        // Botones según estado
        const botones = estaActivo
            ? `
                <button class="btn btn-accion btn-sm" title="Editar"
                    data-id="${producto.id}" onclick="editarProducto(this)">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn btn-accion btn-sm btn-danger-soft" title="Retirar del menú"
                    data-id="${producto.id}" data-nombre="${producto.nombreProducto}"
                    onclick="eliminarProducto(this)">
                    <i class="fa-solid fa-trash"></i>
                </button>`
            : `
                <button class="btn btn-accion btn-sm btn-success-soft" title="Restaurar al menú"
                    data-id="${producto.id}" data-nombre="${producto.nombreProducto}"
                    onclick="restaurarProducto(this)">
                    <i class="fa-solid fa-rotate-left"></i>
                </button>`;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.categoria?.nombreCategoria ?? "—"}</td>
            <td>${producto.nombreProducto}</td>
            <td>S/ ${producto.precioActual.toFixed(2)}</td>
            <td>${producto.descripcion ?? "—"}</td>
            <td class="text-center">${badge}</td>
            <td class="col-fecha-retiro ${filtroEstadoActual !== 'inactivos' ? 'd-none' : ''}">
                ${producto.fechaDesactivacion ?? "—"}
            </td>
            <td class="text-center">${botones}</td>
        `;

        tbody.appendChild(fila);
    });
}

// ============================================================
// ACCIONES
// ============================================================
window.editarProducto = function(btn) {
    idProductoAEditar = btn.dataset.id;
    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalEditarProducto")
    ).show();
};

window.eliminarProducto = function(btn) {
    idProductoEliminar = btn.dataset.id;
    document.getElementById("modal-eliminar-mensaje").textContent =
        `¿Retirar "${btn.dataset.nombre}" del menú? El producto no se eliminará permanentemente.`;
    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalEliminarProducto")
    ).show();
};

window.restaurarProducto = function(btn) {
    idProductoRestaurar = btn.dataset.id;
    document.getElementById("modal-restaurar-mensaje").textContent =
        `¿Restaurar "${btn.dataset.nombre}" al menú?`;
    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalRestaurarProducto")
    ).show();
};

window.abrirModalCrear = function() {
    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalCrearProducto")
    ).show();
};