// ============================================================
// Lee el ID de la URL → editar-users.html?id=3
// ============================================================
const params = new URLSearchParams(window.location.search);
const idUsuario = params.get("id");

// Si no hay ID en la URL, regresa al dashboard
if (!idUsuario) {
    alert("No se especificó un usuario.");
    window.location.href = "dashboard-users.html";
}

// ============================================================
// Al cargar la página → trae los datos del usuario por ID
// ============================================================
document.addEventListener("DOMContentLoaded", () => {

    fetch(`http://localhost:8080/api/usuarios/${idUsuario}`)
        .then(response => {
            if (!response.ok) throw new Error("Usuario no encontrado");
            return response.json();
        })
        .then(usuario => {
            // Rellena el subtítulo con el nombre actual
            document.getElementById("editar-subtitulo").textContent =
                `Editando: ${usuario.nombre} ${usuario.apellido}`;

            // Rellena los campos del formulario
            document.getElementById("campo-nombre").value   = usuario.nombre   ?? "";
            document.getElementById("campo-apellido").value = usuario.apellido ?? "";
            document.getElementById("campo-rol").value      = usuario.rol      ?? "";
            // Las claves NO se rellenan — campo vacío por seguridad
        })
        .catch(error => {
            console.error("Error al cargar usuario:", error);
            document.getElementById("editar-subtitulo").textContent = "Error al cargar datos.";
        });

    // ============================================================
    // Botón "Guardar cambios" → abre el modal de confirmación
    // ============================================================
    document.getElementById("btn-abrir-modal-guardar").addEventListener("click", () => {

        // Validación: contraseñas deben coincidir si se escribió algo
        const clave    = document.getElementById("campo-clave").value;
        const confirmar = document.getElementById("campo-confirmar-clave").value;

        if (clave !== confirmar) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        // Mensaje dinámico en el modal
        const nombre = document.getElementById("campo-nombre").value;
        document.getElementById("modal-mensaje").textContent =
            `¿Confirmas que deseas guardar los cambios de "${nombre}"?`;

        // Abre el modal
        const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById("modalConfirmarGuardar")
        );
        modal.show();
    });

    // ============================================================
    // Botón "Sí, guardar" del modal → hace el PUT al backend
    // ============================================================
    document.getElementById("btn-confirmar-guardar").addEventListener("click", () => {

        const clave = document.getElementById("campo-clave").value;

        // Arma el objeto con los datos editados
        const datos = {
            nombre:   document.getElementById("campo-nombre").value,
            apellido: document.getElementById("campo-apellido").value,
            rol:      document.getElementById("campo-rol").value,
        };

        // Solo agrega la clave si se escribió algo
        if (clave.trim() !== "") {
            datos.clave = clave;
        }

        fetch(`http://localhost:8080/api/usuarios/${idUsuario}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al guardar");
            return response.json();
        })
        .then(() => {
            // Cierra el modal y regresa al dashboard
            bootstrap.Modal.getInstance(
                document.getElementById("modalConfirmarGuardar")
            ).hide();

            alert("Usuario actualizado correctamente.");
            window.location.href = "dashboard-users.html";
        })
        .catch(error => {
            console.error("Error al actualizar:", error);
            alert("Ocurrió un error al guardar los cambios.");
        });
    });

});