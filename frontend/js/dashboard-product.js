document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // RENDER TABLA
    // ============================================================
    function renderTabla(datos) {
        const tbody = document.getElementById("tabla-producto");
        tbody.innerHTML = "";

        datos.forEach((producto) => {
            const fila = document.createElement("tr");

            // ✅ Ícono correcto:
            // activo = true  → fa-toggle-ON  (se ve encendido)
            // activo = false → fa-toggle-OFF (se ve apagado)
            const botonEstado = `
                <button
                    class="btn btn-accion btn-sm"
                    data-id="${producto.id}"
                    data-activo="${producto.activo}"
                    title="${producto.activo ? 'Desactivar' : 'Activar'}"
                    onclick="toggleEstadoProducto(this)">
                    <i class="fa-solid ${producto.activo ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
                </button>`;

            const botonEditar = `
                <button
                    class="btn btn-accion btn-sm"
                    data-id="${producto.id}"
                    title="Editar producto"
                    onclick="editarProducto(this)">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>`;

            // ⚠️ Si ves [object Object] o undefined, significa que los nombres
            // de los campos no coinciden con los que devuelve tu BD.
            // Revisa con console.log(producto) cuáles son los nombres exactos.
            fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.categoria.nombreCategoria}</td>
                <td>${producto.nombreProducto}</td>
                <td>${producto.precioActual}</td>
                <td>${producto.descripcion ?? "—"}</td>
                <td class="text-center">${botonEstado}</td>
                <td>${producto.fechaDesactivada ?? "—"}</td>
                <td class="text-center">${botonEditar}</td>
            `;

            tbody.appendChild(fila);
        });
    }

    // ============================================================
    // TOGGLE ESTADO — en window para que onclick lo encuentre
    // ============================================================
    window.toggleEstadoProducto = function(btn) {
        const activo = btn.dataset.activo === "true";
        const nuevoEstado = !activo;

        btn.dataset.activo = nuevoEstado;
        btn.title = nuevoEstado ? "Desactivar" : "Activar";

        const icono = btn.querySelector("i");
        icono.className = `fa-solid ${nuevoEstado ? "fa-toggle-on" : "fa-toggle-off"}`;

        console.log(`Producto ID ${btn.dataset.id} → ${nuevoEstado ? "Activado" : "Desactivado"}`);

        // Cuando tengas el endpoint:
        // fetch(`http://localhost:8080/api/productos/${btn.dataset.id}/toggle`, {
        //     method: "PUT"
        // });
    };

    // ============================================================
    // MODAL EDITAR — en window para que onclick lo encuentre
    // ============================================================
    let idProductoAEditar = null;

    window.editarProducto = function(btn) {
        idProductoAEditar = btn.dataset.id;

        const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById("modalEditarProducto")
        );
        modal.show();
    };

    document.getElementById("btn-si-editar-prod").addEventListener("click", () => {
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("modalEditarProducto")
        );
        modal.hide();

        console.log(`Confirmado: editar producto ID ${idProductoAEditar}`);
        window.location.href = `editar-producto.html?id=${idProductoAEditar}`;
    });

    // ============================================================
    // FETCH
    // ============================================================
    fetch("http://localhost:8080/api/productos")
        .then((response) => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then((data) => {
            console.log("Primer producto:", data[0]); // 👈 Agrega esto temporalmente
            renderTabla(data);
        })
        .catch((error) => {
            console.error("Error al cargar productos:", error);
            const tbody = document.getElementById("tabla-producto");
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-danger">
                        <i class="fa-solid fa-triangle-exclamation me-2"></i>
                        Error al cargar los datos. Verifica tu servidor.
                    </td>
                </tr>
            `;
        });

});