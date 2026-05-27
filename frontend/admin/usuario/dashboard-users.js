// ============================================================
// Variable global para guardar el ID del usuario a editar
// ============================================================
let idUsuarioAEditar = null;

document.addEventListener("DOMContentLoaded", () => {

    cargarUsuarios(); // Carga la tabla al iniciar

    // Botón "Sí, editar" del modal
    document.getElementById("btn-si-editar-user").addEventListener("click", () => {
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("modalEditarUsuario")
        );
        modal.hide();
        window.location.href = `editar-users.html?id=${idUsuarioAEditar}`;
    });

});

// ============================================================
// CARGAR USUARIOS desde el backend
// ============================================================
function cargarUsuarios() {
    fetch("http://localhost:8080/api/usuarios")
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(data => renderTabla(data))
        .catch(error => {
            console.error("Error al cargar usuarios:", error);
            document.getElementById("tabla-usuario").innerHTML = `
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
    const tbody = document.getElementById("tabla-usuario");
    tbody.innerHTML = "";

    const usuariosProtegidos = [1];

    datos.forEach((usuario) => {
        const fila = document.createElement("tr");
        const esProtegido = usuariosProtegidos.includes(usuario.id);

        // ← activo = fechaBaja es null
        const estaActivo = usuario.fechaBaja === null || usuario.fechaBaja === undefined;

        const botonEstado = esProtegido
            ? `<button class="btn btn-accion btn-sm" disabled title="No se puede modificar">
                   <i class="fa-solid fa-toggle-on"></i>
               </button>`
            : `<button class="btn btn-accion btn-sm"
                   data-id="${usuario.id}"
                   data-activo="${estaActivo}"
                   title="${estaActivo ? 'Desactivar' : 'Activar'}"
                   onclick="toggleEstado(this)">
                   <i class="fa-solid ${estaActivo ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
               </button>`;

        const botonEditar = esProtegido
            ? `<button class="btn btn-accion btn-sm" disabled title="No se puede editar">
                   <i class="fa-solid fa-pen-to-square"></i>
               </button>`
            : `<button class="btn btn-accion btn-sm"
                   data-id="${usuario.id}"
                   title="Editar usuario"
                   onclick="editarUsuario(this)">
                   <i class="fa-solid fa-pen-to-square"></i>
               </button>`;

        fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.apellido}</td>
            <td>${usuario.rol}</td>
            <td>${usuario.ultimoLogin ?? "—"}</td>
            <td class="text-center">${botonEstado}</td>
            <td>${usuario.fechaBaja ?? "—"}</td>
            <td class="text-center">${botonEditar}</td>
        `;

        tbody.appendChild(fila);
    });
}

// ============================================================
// TOGGLE ESTADO - Borrado lógico (activar/desactivar)
// ============================================================
window.toggleEstado = function(btn) {
    const id = btn.dataset.id;
    const activo = btn.dataset.activo === "true";

    // Si está activo → desactivar | Si está desactivado → activar
    const endpoint = activo
        ? `http://localhost:8080/api/usuarios/${id}/desactivar`
        : `http://localhost:8080/api/usuarios/${id}/activar`;

    fetch(endpoint, { method: "PUT" })
        .then(response => {
            if (!response.ok) throw new Error("Error al cambiar estado");
            cargarUsuarios(); // Recarga la tabla con los datos actualizados
        })
        .catch(error => console.error("Error:", error));
};

// ============================================================
// EDITAR USUARIO - Abre el modal de confirmación
// ============================================================
window.editarUsuario = function(btn) {
    idUsuarioAEditar = btn.dataset.id;

    const modal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalEditarUsuario")
    );
    modal.show();
};

// ============================================================
// CREAR USUARIO - Abre modal con formulario
// ============================================================
window.abrirModalCrear = function() {
    const modal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalCrearUsuario")
    );
    modal.show();
};

document.getElementById("btn-confirmar-crear").addEventListener("click", () => {

    const nombre   = document.getElementById("crear-nombre").value.trim();
    const apellido = document.getElementById("crear-apellido").value.trim();
    const rol      = document.getElementById("crear-rol").value.trim();
    const clave    = document.getElementById("crear-clave").value.trim();
    const confirmar = document.getElementById("crear-confirmar-clave").value.trim();

    // Validaciones
    if (!nombre || !apellido || !rol || !clave) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    if (clave !== confirmar) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    const datos = { nombre, apellido, rol, clave };

    fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al crear usuario");
        return response.json();
    })
    .then(() => {
        bootstrap.Modal.getInstance(
            document.getElementById("modalCrearUsuario")
        ).hide();

        // Limpia el formulario
        document.getElementById("form-crear-usuario").reset();

        alert("Usuario creado correctamente.");
        cargarUsuarios(); // Recarga la tabla
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Ocurrió un error al crear el usuario.");
    });
});