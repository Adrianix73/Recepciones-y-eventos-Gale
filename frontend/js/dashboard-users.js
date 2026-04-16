document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // renderTabla y toggleEstado se declaran FUERA del fetch
    // para que sean accesibles globalmente (el onclick las necesita)
    // ============================================================

    function renderTabla(datos) {
    const tbody = document.getElementById("tabla-usuario");
    tbody.innerHTML = "";

    // IDs protegidos: no se pueden activar/desactivar
    const usuariosProtegidos = [1];

    datos.forEach((usuario) => {
        const fila = document.createElement("tr");

        const esProtegido = usuariosProtegidos.includes(usuario.id);

        const botonEstado = esProtegido
            ? `
                <button 
                    class="btn btn-accion btn-sm"
                    title="Este usuario no se puede modificar"
                    disabled>
                    <i class="fa-solid ${usuario.activo ? 'fa-toggle-off' : 'fa-toggle-on'}"></i>
                </button>
              `
            : `
                <button 
                    class="btn btn-accion btn-sm"
                    data-id="${usuario.id}"
                    data-activo="${usuario.activo}"
                    title="${usuario.activo ? 'Desactivar' : 'Activar'}"
                    onclick="toggleEstado(this)">
                    <i class="fa-solid ${usuario.activo ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
                </button>
              `;

              const botonEditar = esProtegido
    ? `<button class="btn btn-accion btn-sm" title="No se puede editar" disabled>
           <i class="fa-solid fa-pen-to-square"></i>
       </button>`
    : `<button class="btn btn-accion btn-sm" data-id="${usuario.id}" title="Editar usuario" onclick="editarUsuario(this)">
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
    // toggleEstado DEBE estar en el scope global (window)
    // porque el onclick="toggleEstado(this)" del HTML lo busca
    // en el objeto window, no dentro del DOMContentLoaded
    // ============================================================
    window.toggleEstado = function(btn) {
        const activo = btn.dataset.activo === "true";
        const nuevoEstado = !activo;

        btn.dataset.activo = nuevoEstado;
        btn.title = nuevoEstado ? "Desactivar" : "Activar";

        const icono = btn.querySelector("i");
        icono.className = `fa-solid ${nuevoEstado ? "fa-toggle-on" : "fa-toggle-off"}`;

        // Guardamos el ID del usuario que se quiere editar
let idUsuarioAEditar = null;

window.editarUsuario = function(btn) {
    // Guarda el ID para usarlo cuando el usuario confirme
    idUsuarioAEditar = btn.dataset.id;

    // Abre el modal usando la API de Bootstrap
    // bootstrap.Modal.getOrCreateInstance() busca el modal en el DOM y lo abre
    const modal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalEditarUsuario")
    );
    modal.show();
};

// Cuando el usuario presiona "Sí, editar"
document.getElementById("btn-si-editar-user").addEventListener("click", () => {
    // Cierra el modal
    const modal = bootstrap.Modal.getInstance(
        document.getElementById("modalEditarUsuario")
    );
    modal.hide();

    // Aquí va tu lógica de edición con el ID guardado
    console.log(`Confirmado: editar usuario ID ${idUsuarioAEditar}`);
    window.location.href = `editar-users.html?id=${idUsuarioAEditar}`;

});

        console.log(`Usuario ID ${btn.dataset.id} → ${nuevoEstado ? "Activado" : "Desactivado"}`);
    };

    // ============================================================
    // FETCH - Conexión con tu BD a través de la API
    // ============================================================
    fetch("http://localhost:8080/api/usuarios")
        .then((response) => {
            // Verifica que la respuesta sea exitosa (status 200-299)
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json(); // Convierte la respuesta a JSON
        })
        .then((data) => {
            // "data" es el array de usuarios que devuelve tu BD
            // Lo pasas directamente a renderTabla
            renderTabla(data);
        })
        .catch((error) => {
            // Si falla el fetch (BD caída, CORS, etc.) muestra error en tabla
            console.error("Error al cargar usuarios:", error);

            const tbody = document.getElementById("tabla-usuario");
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