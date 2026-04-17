// ============================================================
// Variable global para guardar el ID del producto a editar
// ============================================================
let idProductoAEditar = null;

document.addEventListener("DOMContentLoaded", () => {

    cargarProductos();

    // ── MODAL EDITAR: botón "Sí, editar" ──────────────────────
    document.getElementById("btn-si-editar-prod").addEventListener("click", () => {
        bootstrap.Modal.getInstance(
            document.getElementById("modalEditarProducto")
        ).hide();
        window.location.href = `editar-producto.html?id=${idProductoAEditar}`;
    });

    // ── MODAL CREAR: botón "Registrar" ────────────────────────
    document.getElementById("btn-confirmar-crear").addEventListener("click", () => {

        const nombre      = document.getElementById("crear-nombre").value.trim();
        const precio      = document.getElementById("crear-precio").value.trim();
        const descripcion = document.getElementById("crear-descripcion").value.trim();
        const categoriaId = document.getElementById("crear-categoria").value;

        // Validaciones
        if (!nombre || !precio || !categoriaId) {
            alert("Nombre, precio y categoría son obligatorios.");
            return;
        }

        const datos = {
            nombreProducto: nombre,
            precioActual:   parseFloat(precio),
            descripcion:    descripcion,
            categoria: {
                id: parseInt(categoriaId)
            }
        };

        fetch("http://localhost:8080/api/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al crear producto");
            return response.json();
        })
        .then(() => {
            bootstrap.Modal.getInstance(
                document.getElementById("modalCrearProducto")
            ).hide();
            document.getElementById("form-crear-producto").reset();
            alert("Producto creado correctamente.");
            cargarProductos();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Ocurrió un error al crear el producto.");
        });
    });

});

// ============================================================
// CARGAR PRODUCTOS
// ============================================================
function cargarProductos() {
    fetch("http://localhost:8080/api/productos")
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(data => renderTabla(data))
        .catch(error => {
            console.error("Error al cargar productos:", error);
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
// RENDER TABLA
// ============================================================
function renderTabla(datos) {
    const tbody = document.getElementById("tabla-producto");
    tbody.innerHTML = "";

    datos.forEach((producto) => {
        const fila = document.createElement("tr");

        // Activo = fechaDesactivada es null
        const estaActivo = producto.fechaDesactivada === null || 
                           producto.fechaDesactivada === undefined;

        const botonEstado = `
            <button
                class="btn btn-accion btn-sm"
                data-id="${producto.id}"
                data-activo="${estaActivo}"
                title="${estaActivo ? 'Desactivar' : 'Activar'}"
                onclick="toggleEstadoProducto(this)">
                <i class="fa-solid ${estaActivo ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
            </button>`;

        const botonEditar = `
            <button
                class="btn btn-accion btn-sm"
                data-id="${producto.id}"
                title="Editar producto"
                onclick="editarProducto(this)">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>`;

        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.categoria?.nombreCategoria ?? "—"}</td>
            <td>${producto.nombreProducto}</td>
            <td>S/ ${producto.precioActual.toFixed(2)}</td>
            <td>${producto.descripcion ?? "—"}</td>
            <td class="text-center">${botonEstado}</td>
            <td>${producto.fechaDesactivada ?? "—"}</td>
            <td class="text-center">${botonEditar}</td>
        `;

        tbody.appendChild(fila);
    });
}

// ============================================================
// TOGGLE ESTADO — activar / desactivar
// ============================================================
window.toggleEstadoProducto = function(btn) {
    const id     = btn.dataset.id;
    const activo = btn.dataset.activo === "true";

    const endpoint = activo
        ? `http://localhost:8080/api/productos/${id}/desactivar`
        : `http://localhost:8080/api/productos/${id}/activar`;

    fetch(endpoint, { method: "PUT" })
        .then(response => {
            if (!response.ok) throw new Error("Error al cambiar estado");
            cargarProductos(); // Recarga tabla con datos reales
        })
        .catch(error => console.error("Error:", error));
};

// ============================================================
// EDITAR PRODUCTO — abre modal de confirmación
// ============================================================
window.editarProducto = function(btn) {
    idProductoAEditar = btn.dataset.id;

    const modal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalEditarProducto")
    );
    modal.show();
};

// ============================================================
// ABRIR MODAL CREAR
// ============================================================
window.abrirModalCrear = function() {
    const modal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalCrearProducto")
    );
    modal.show();
};