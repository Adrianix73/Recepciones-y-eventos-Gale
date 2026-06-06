// ============================================================
// CONFIG
// ============================================================
const API_BASE = "http://localhost:8080/api";

// ============================================================
// ESTADO GLOBAL DEL MÓDULO
// ============================================================
let todosLosUsuarios = [];
let idUsuarioAEditar = null;

let filtroEstadoUsuario = "habilitados";
let filtroRolUsuario = "";
let filtroBusquedaUsuario = "";

// Usuarios protegidos: no se editan ni se deshabilitan
const usuariosProtegidos = [1];

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  configurarBuscadorUsuario();
  configurarEventosPrincipales();
  cargarUsuarios();
});

// ============================================================
// EVENTOS PRINCIPALES
// ============================================================
function configurarEventosPrincipales() {
  const btnCrear = document.getElementById("btn-confirmar-crear");
  const btnGuardarEdicion = document.getElementById("btn-guardar-edicion-usuario");

  if (btnCrear) {
    btnCrear.addEventListener("click", registrarUsuario);
  }

  if (btnGuardarEdicion) {
    btnGuardarEdicion.addEventListener("click", guardarEdicionUsuario);
  }
}

// ============================================================
// BUSCADOR
// ============================================================
function configurarBuscadorUsuario() {
  const inputBuscar = document.getElementById("buscador-usuario");
  const btnLimpiar = document.getElementById("btn-limpiar-busqueda-usuario");

  if (!inputBuscar || !btnLimpiar) return;

  inputBuscar.addEventListener("input", () => {
    filtroBusquedaUsuario = normalizarTexto(inputBuscar.value.trim());
    aplicarFiltrosUsuarios();
  });

  btnLimpiar.addEventListener("click", () => {
    inputBuscar.value = "";
    filtroBusquedaUsuario = "";
    aplicarFiltrosUsuarios();
    inputBuscar.focus();
  });
}

// ============================================================
// CARGAR USUARIOS
// ============================================================
async function cargarUsuarios() {
  try {
    const response = await fetch(`${API_BASE}/usuarios`);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    todosLosUsuarios = data;

    llenarFiltroRoles(data);
    actualizarVisibilidadColumnaFecha();
    aplicarFiltrosUsuarios();
  } catch (error) {
    console.error("Error al cargar usuarios:", error);

    document.getElementById("tabla-usuario").innerHTML = `
      <tr>
        <td colspan="8" class="text-center">
          Error al cargar los datos. Verifica tu servidor.
        </td>
      </tr>
    `;
  }
}

// ============================================================
// FILTRO DE ROLES
// ============================================================
function llenarFiltroRoles(usuarios) {
  const selectRol = document.getElementById("filtro-rol");
  if (!selectRol) return;

  const valorActual = selectRol.value;

  const rolesUnicos = [...new Set(
    usuarios
      .map((usuario) => (usuario.rol ?? "").trim())
      .filter((rol) => rol !== "")
  )].sort((a, b) => a.localeCompare(b));

  selectRol.innerHTML = `<option value="">Todos los roles</option>`;

  rolesUnicos.forEach((rol) => {
    const option = document.createElement("option");
    option.value = rol;
    option.textContent = rol;
    selectRol.appendChild(option);
  });

  if (rolesUnicos.includes(valorActual)) {
    selectRol.value = valorActual;
  } else {
    selectRol.value = "";
    filtroRolUsuario = "";
  }
}

// ============================================================
// FILTROS
// ============================================================
window.aplicarFiltroEstado = function (tipo, btn) {
  filtroEstadoUsuario = tipo;

  document.querySelectorAll(".btn-filtro").forEach((boton) => {
    boton.classList.remove("activo");
  });

  if (btn) {
    btn.classList.add("activo");
  }

  actualizarVisibilidadColumnaFecha();
  aplicarFiltrosUsuarios();
};

window.aplicarFiltroRol = function () {
  const selectRol = document.getElementById("filtro-rol");
  filtroRolUsuario = selectRol ? selectRol.value : "";
  aplicarFiltrosUsuarios();
};

function actualizarVisibilidadColumnaFecha() {
  const mostrarFecha = filtroEstadoUsuario === "deshabilitados";

  document.querySelectorAll(".col-fecha-retiro").forEach((elemento) => {
    elemento.classList.toggle("d-none", !mostrarFecha);
  });
}

function aplicarFiltrosUsuarios() {
  let datos = [...todosLosUsuarios];

  // 1. Filtrar por estado
  if (filtroEstadoUsuario === "habilitados") {
    datos = datos.filter(
      (usuario) => usuario.fechaBaja === null || usuario.fechaBaja === undefined
    );
  } else if (filtroEstadoUsuario === "deshabilitados") {
    datos = datos.filter(
      (usuario) => usuario.fechaBaja !== null && usuario.fechaBaja !== undefined
    );
  }

  // 2. Filtrar por rol
  if (filtroRolUsuario) {
    datos = datos.filter((usuario) => usuario.rol === filtroRolUsuario);
  }

  // 3. Filtrar por nombre o apellido
  if (filtroBusquedaUsuario) {
    datos = datos.filter((usuario) => {
      const nombre = normalizarTexto(usuario.nombre ?? "");
      const apellido = normalizarTexto(usuario.apellido ?? "");
      const nombreCompleto = `${nombre} ${apellido}`.trim();

      return (
        nombre.includes(filtroBusquedaUsuario) ||
        apellido.includes(filtroBusquedaUsuario) ||
        nombreCompleto.includes(filtroBusquedaUsuario)
      );
    });
  }

  renderTablaUsuarios(datos);
}

// ============================================================
// RENDER TABLA
// ============================================================
function renderTablaUsuarios(datos) {
  const tbody = document.getElementById("tabla-usuario");
  tbody.innerHTML = "";

  if (datos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center">
          No hay usuarios para mostrar.
        </td>
      </tr>
    `;
    return;
  }

  datos.forEach((usuario) => {
    const fila = document.createElement("tr");

    const esProtegido = usuariosProtegidos.includes(Number(usuario.id));
    const estaHabilitado =
      usuario.fechaBaja === null || usuario.fechaBaja === undefined;

    const badgeEstado = estaHabilitado
      ? `<span class="badge bg-success">Habilitado</span>`
      : `<span class="badge bg-secondary">Deshabilitado</span>`;

    let botones = "";

    if (esProtegido) {
      botones = `
        <button
          class="btn btn-sm btn-accion me-2"
          type="button"
          disabled
          title="Usuario protegido"
        >
          <i class="fa-solid fa-lock"></i>
        </button>

        <button
          class="btn btn-sm btn-accion"
          type="button"
          disabled
          title="Usuario protegido"
        >
          <i class="fa-solid fa-shield-halved"></i>
        </button>
      `;
    } else {
      const botonEstado = estaHabilitado
        ? `
          <button
            class="btn btn-sm btn-accion me-2"
            type="button"
            data-id="${usuario.id}"
            data-activo="true"
            data-nombre="${escapeHtml(usuario.nombre ?? "")}"
            data-apellido="${escapeHtml(usuario.apellido ?? "")}"
            onclick="toggleEstadoUsuario(this)"
            title="Deshabilitar usuario"
          >
            <i class="fa-solid fa-user-slash"></i>
          </button>
        `
        : `
          <button
            class="btn btn-sm btn-accion me-2"
            type="button"
            data-id="${usuario.id}"
            data-activo="false"
            data-nombre="${escapeHtml(usuario.nombre ?? "")}"
            data-apellido="${escapeHtml(usuario.apellido ?? "")}"
            onclick="toggleEstadoUsuario(this)"
            title="Habilitar usuario"
          >
            <i class="fa-solid fa-user-check"></i>
          </button>
        `;

      const botonEditar = `
        <button
          class="btn btn-sm btn-accion"
          type="button"
          data-id="${usuario.id}"
          onclick="editarUsuario(this)"
          title="Editar usuario"
        >
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
      `;

      botones = `${botonEstado}${botonEditar}`;
    }

    fila.innerHTML = `
      <td>${usuario.id ?? "—"}</td>
      <td>${usuario.nombre ?? "—"}</td>
      <td>${usuario.apellido ?? "—"}</td>
      <td>${usuario.rol ?? "—"}</td>
      <td>${formatearFecha(usuario.ultimoLogin)}</td>
      <td>${badgeEstado}</td>
      <td class="col-fecha-retiro ${filtroEstadoUsuario !== "deshabilitados" ? "d-none" : ""}">
        ${formatearFecha(usuario.fechaBaja)}
      </td>
      <td>${botones}</td>
    `;

    tbody.appendChild(fila);
  });
}

// ============================================================
// CAMBIAR ESTADO
// ============================================================
window.toggleEstadoUsuario = async function (btn) {
  const id = btn.dataset.id;
  const activo = btn.dataset.activo === "true";
  const nombre = btn.dataset.nombre ?? "";
  const apellido = btn.dataset.apellido ?? "";
  const nombreCompleto = `${nombre} ${apellido}`.trim();

  const mensaje = activo
    ? `¿Deseas deshabilitar a ${nombreCompleto}?`
    : `¿Deseas habilitar a ${nombreCompleto}?`;

  const confirmado = window.confirm(mensaje);
  if (!confirmado) return;

  const endpoint = activo
    ? `${API_BASE}/usuarios/${id}/desactivar`
    : `${API_BASE}/usuarios/${id}/activar`;

  try {
    const response = await fetch(endpoint, { method: "PUT" });

    if (!response.ok) {
      throw new Error("Error al cambiar estado");
    }

    await cargarUsuarios();
  } catch (error) {
    console.error("Error:", error);
    alert("No se pudo cambiar el estado del usuario.");
  }
};

// ============================================================
// ABRIR MODAL CREAR
// ============================================================
window.abrirModalCrear = function () {
  limpiarFormularioCrearUsuario();

  const modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById("modalCrearUsuario")
  );

  modal.show();
};

// ============================================================
// CREAR USUARIO
// ============================================================
async function registrarUsuario() {
  const nombre = document.getElementById("crear-nombre").value.trim();
  const apellido = document.getElementById("crear-apellido").value.trim();
  const rol = document.getElementById("crear-rol").value.trim();
  const clave = document.getElementById("crear-clave").value.trim();
  const confirmar = document.getElementById("crear-confirmar-clave").value.trim();

  if (!nombre || !apellido || !rol || !clave || !confirmar) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  if (clave !== confirmar) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  const datos = { nombre, apellido, rol, clave };

  try {
    const response = await fetch(`${API_BASE}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (!response.ok) {
      throw new Error("Error al crear usuario");
    }

    bootstrap.Modal.getInstance(
      document.getElementById("modalCrearUsuario")
    ).hide();

    limpiarFormularioCrearUsuario();
    alert("Usuario creado correctamente.");
    await cargarUsuarios();
  } catch (error) {
    console.error("Error:", error);
    alert("Ocurrió un error al crear el usuario.");
  }
}

// ============================================================
// ABRIR MODAL EDITAR
// ============================================================
window.editarUsuario = async function (btn) {
  const id = btn.dataset.id;
  idUsuarioAEditar = id;

  try {
    const response = await fetch(`${API_BASE}/usuarios/${id}`);

    if (!response.ok) {
      throw new Error("No se pudo obtener el usuario");
    }

    const usuario = await response.json();

    document.getElementById("editar-nombre-usuario").value = usuario.nombre ?? "";
    document.getElementById("editar-apellido-usuario").value = usuario.apellido ?? "";
    document.getElementById("editar-rol-usuario").value = usuario.rol ?? "";
    document.getElementById("editar-clave-usuario").value = "";
    document.getElementById("editar-confirmar-clave-usuario").value = "";

    const subtitulo = document.getElementById("editar-usuario-subtitulo");
    if (subtitulo) {
      subtitulo.textContent = `Editando: ${usuario.nombre ?? ""} ${usuario.apellido ?? ""}`.trim();
    }

    const modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById("modalEditarUsuario")
    );

    modal.show();
  } catch (error) {
    console.error("Error al cargar usuario:", error);
    alert("No se pudo cargar la información del usuario.");
  }
};

// ============================================================
// GUARDAR EDICIÓN
// ============================================================
async function guardarEdicionUsuario() {
  if (!idUsuarioAEditar) {
    alert("No se encontró el usuario a editar.");
    return;
  }

  const nombre = document.getElementById("editar-nombre-usuario").value.trim();
  const apellido = document.getElementById("editar-apellido-usuario").value.trim();
  const rol = document.getElementById("editar-rol-usuario").value.trim();
  const clave = document.getElementById("editar-clave-usuario").value.trim();
  const confirmar = document.getElementById("editar-confirmar-clave-usuario").value.trim();

  if (!nombre || !apellido || !rol) {
    alert("Nombre, apellido y rol son obligatorios.");
    return;
  }

  if ((clave || confirmar) && clave !== confirmar) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  const datos = { nombre, apellido, rol };

  if (clave !== "") {
    datos.clave = clave;
  }

  try {
    const response = await fetch(`${API_BASE}/usuarios/${idUsuarioAEditar}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (!response.ok) {
      throw new Error("Error al actualizar usuario");
    }

    bootstrap.Modal.getInstance(
      document.getElementById("modalEditarUsuario")
    ).hide();

    limpiarFormularioEditarUsuario();
    alert("Usuario actualizado correctamente.");
    await cargarUsuarios();
  } catch (error) {
    console.error("Error al actualizar:", error);
    alert("Ocurrió un error al guardar los cambios.");
  }
}

// ============================================================
// HELPERS
// ============================================================
function limpiarFormularioCrearUsuario() {
  const form = document.getElementById("form-crear-usuario");
  if (form) form.reset();
}

function limpiarFormularioEditarUsuario() {
  const form = document.getElementById("form-editar-usuario");
  if (form) form.reset();

  const subtitulo = document.getElementById("editar-usuario-subtitulo");
  if (subtitulo) {
    subtitulo.textContent = "Modifique solo lo que necesite.";
  }
}

function normalizarTexto(texto) {
  return (texto ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatearFecha(valor) {
  if (!valor) return "—";

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return valor;
  }

  return fecha.toLocaleString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function escapeHtml(texto) {
  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}