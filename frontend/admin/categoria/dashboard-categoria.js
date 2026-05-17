// ============================================================
// VARIABLES GLOBALES
// ============================================================
let filtroNombre        = "";
let idCategoriaEditar   = null;
let idCategoriaEliminar = null;
let todasLasCategorias  = [];

document.addEventListener("DOMContentLoaded", () => {

    cargarCategorias();

    // ── BUSCADOR ──────────────────────────────────────────────
    const inputBuscar = document.getElementById("buscador-categoria");
    const btnLimpiar  = document.getElementById("btn-limpiar-busqueda");

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

    // ── MODAL EDITAR — confirmar ──────────────────────────────
    document.getElementById("btn-si-editar-categoria").addEventListener("click", () => {

        const nuevoNombre = document.getElementById("editar-nombre").value.trim();

        if (!nuevoNombre) {
            alert("El nombre no puede estar vacío.");
            return;
        }

        fetch(`http://localhost:8080/api/categorias/${idCategoriaEditar}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nuevoNombre })
        })
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(() => {
            bootstrap.Modal.getInstance(
                document.getElementById("modalEditarCategoria")
            ).hide();
            alert("Categoría actualizada correctamente.");
            cargarCategorias();
        })
        .catch(() => alert("Error al editar la categoría."));
    });

    // ── MODAL CREAR — confirmar ───────────────────────────────
    document.getElementById("btn-confirmar-crear").addEventListener("click", () => {

        const nombre = document.getElementById("crear-nombre").value.trim();

        if (!nombre) {
            alert("El nombre de la categoría es obligatorio.");
            return;
        }

        fetch("http://localhost:8080/api/categorias", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nombre })
        })
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(() => {
            bootstrap.Modal.getInstance(
                document.getElementById("modalCrearCategoria")
            ).hide();
            document.getElementById("form-crear-categoria").reset();
            alert("Categoría registrada correctamente.");
            cargarCategorias();
        })
        .catch(() => alert("Error al registrar la categoría."));
    });

    // ── MODAL ELIMINAR — confirmar ────────────────────────────
    document.getElementById("btn-confirmar-eliminar").addEventListener("click", () => {

        fetch(`http://localhost:8080/api/categorias/${idCategoriaEliminar}`, {
            method: "DELETE"
        })
        .then(r => {
            if (!r.ok) return r.text().then(msg => { throw new Error(msg); });
        })
        .then(() => {
            bootstrap.Modal.getInstance(
                document.getElementById("modalEliminarCategoria")
            ).hide();
            alert("Categoría eliminada correctamente.");
            cargarCategorias();
        })
        .catch(err => alert(err.message || "Error al eliminar la categoría."));
    });

});

// ============================================================
// CARGAR CATEGORÍAS
// ============================================================
function cargarCategorias() {
    fetch("http://localhost:8080/api/categorias")
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(data => {
            todasLasCategorias = data;   // ← guarda para filtros
            aplicarFiltros();            // ← renderiza con filtros activos
        })
        .catch(() => {
            document.getElementById("tabla-categoria").innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-danger">
                        <i class="fa-solid fa-triangle-exclamation me-2"></i>
                        Error al cargar los datos. Verifica tu servidor.
                    </td>
                </tr>`;
        });
}

// ============================================================
// FILTROS
// ============================================================
function aplicarFiltros() {
    let datos = [...todasLasCategorias];   // ← copia del array global

    if (filtroNombre) {
        datos = datos.filter(c =>
            (c.nombre ?? "").toLowerCase().includes(filtroNombre)
        );
    }

    renderTabla(datos);
}

// ============================================================
// RENDER TABLA
// ============================================================
function renderTabla(datos) {
    const tbody = document.getElementById("tabla-categoria");
    tbody.innerHTML = "";

    if (datos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-muted">
                    No hay categorías para mostrar.
                </td>
            </tr>`;
        return;
    }

    datos.forEach(categoria => {

        const botones = `
            <button class="btn btn-accion btn-sm me-1"
                    data-id="${categoria.id}"
                    data-nombre="${categoria.nombreCategoria}"
                    onclick="editarCategoria(this)">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn btn-accion btn-sm"
                    data-id="${categoria.id}"
                    data-nombre="${categoria.nombreCategoria}"
                    onclick="eliminarCategoria(this)">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${categoria.id}</td>
            <td>${categoria.nombreCategoria ?? "—"}</td>
            <td class="text-center">${botones}</td>
        `;

        tbody.appendChild(fila);
    });
}

// ============================================================
// ACCIONES
// ============================================================
window.editarCategoria = function(btn) {
    idCategoriaEditar = btn.dataset.id;
    // Pre-carga el nombre actual en el input del modal
    document.getElementById("editar-nombre").value = btn.dataset.nombre;
    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalEditarCategoria")
    ).show();
};

window.eliminarCategoria = function(btn) {
    idCategoriaEliminar = btn.dataset.id;
    document.getElementById("modal-eliminar-mensaje").textContent =
        `¿Eliminar la categoría "${btn.dataset.nombre}"? Solo es posible si no tiene productos asignados.`;
    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalEliminarCategoria")
    ).show();
};

window.abrirModalCrear = function() {
    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalCrearCategoria")
    ).show();
};