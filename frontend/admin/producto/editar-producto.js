// ============================================================
// Lee el ID de la URL → editar-producto.html?id=3
// ============================================================
const params     = new URLSearchParams(window.location.search);
const idProducto = params.get("id");

// Si no hay ID en la URL, regresa al dashboard
if (!idProducto) {
    alert("No se especificó un producto.");
    window.location.href = "dashboard-product.html";
}

// ============================================================
// Al cargar la página → trae los datos del producto por ID
// ============================================================
document.addEventListener("DOMContentLoaded", () => {

    fetch(`http://localhost:8080/api/productos/${idProducto}`)
        .then(response => {
            if (!response.ok) throw new Error("Producto no encontrado");
            return response.json();
        })
        .then(producto => {
            // Subtítulo dinámico
            document.getElementById("editar-subtitulo").textContent =
                `Editando: ${producto.nombreProducto}`;

            // Rellena los campos
            document.getElementById("campo-nombreProducto").value = producto.nombreProducto ?? "";
            document.getElementById("campo-precioActual").value   = producto.precioActual   ?? "";
            document.getElementById("campo-descripcion").value    = producto.descripcion    ?? "";

            // Selecciona la categoría correcta en el select
            const selectCategoria = document.getElementById("campo-categoria");
            if (producto.categoria?.id) {
                selectCategoria.value = producto.categoria.id;
            }
        })
        .catch(error => {
            console.error("Error al cargar producto:", error);
            document.getElementById("editar-subtitulo").textContent = "Error al cargar datos.";
        });

    // ============================================================
    // Botón "Guardar cambios" → valida y abre modal
    // ============================================================
    document.getElementById("btn-abrir-modal-guardar").addEventListener("click", () => {

        const nombre    = document.getElementById("campo-nombreProducto").value.trim();
        const precio    = document.getElementById("campo-precioActual").value.trim();
        const categoria = document.getElementById("campo-categoria").value;

        // Validaciones básicas
        if (!nombre || !precio || !categoria) {
            alert("Nombre, precio y categoría son obligatorios.");
            return;
        }

        // Mensaje dinámico en el modal
        document.getElementById("modal-mensaje").textContent =
            `¿Confirmas que deseas guardar los cambios de "${nombre}"?`;

        bootstrap.Modal.getOrCreateInstance(
            document.getElementById("modalConfirmarGuardar")
        ).show();
    });

    // ============================================================
    // Botón "Sí, guardar" → hace el PUT al backend
    // ============================================================
    document.getElementById("btn-confirmar-guardar").addEventListener("click", () => {

        const datos = {
            nombreProducto: document.getElementById("campo-nombreProducto").value.trim(),
            precioActual:   parseFloat(document.getElementById("campo-precioActual").value),
            descripcion:    document.getElementById("campo-descripcion").value.trim(),
            categoria: {
                id: parseInt(document.getElementById("campo-categoria").value)
            }
        };

        fetch(`http://localhost:8080/api/productos/${idProducto}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al guardar");
            return response.json();
        })
        .then(() => {
            bootstrap.Modal.getInstance(
                document.getElementById("modalConfirmarGuardar")
            ).hide();

            alert("Producto actualizado correctamente.");
            window.location.href = "dashboard-product.html";
        })
        .catch(error => {
            console.error("Error al actualizar:", error);
            alert("Ocurrió un error al guardar los cambios.");
        });
    });

});