// ============================================================
// VARIABLES GLOBALES
// ============================================================
let filtroNombre = "";
let idCategoriaEditar = null;
let idCategoriaEliminar = null;
let todasLasCategorias = [];

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  cargarCategorias();

  // ── BUSCADOR ──────────────────────────────────────────────
  const inputBuscar = document.getElementById("buscador-categoria");
  const btnLimpiar = document.getElementById("btn-limpiar-busqueda");

  if (inputBuscar) {
    inputBuscar.addEventListener("input", () => {
      filtroNombre = normalizarTexto(inputBuscar.value.trim());
      aplicarFiltros();
    });
  }

  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", () => {
      if (inputBuscar) {
        inputBuscar.value = "";
        inputBuscar.focus();
      }

      filtroNombre = "";
      aplicarFiltros();
    });
  }

  // ── MODAL EDITAR — confirmar ──────────────────────────────
  const btnEditar = document.getElementById("btn-si-editar-categoria");
  if (btnEditar) {
    btnEditar.addEventListener("click", () => {
      const nuevoNombre = document.getElementById("editar-nombre").value.trim();

      if (!nuevoNombre) {
        alert("El nombre no puede estar vacío.");
        return;
      }

      fetch(`http://localhost:8080/api/categorias/${idCategoriaEditar}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCategoria: nuevoNombre
        })
      })
        .then((r) => {
          if (!r.ok) throw new Error();
          return r.json();
        })
        .then(() => {
          bootstrap.Modal.getInstance(
            document.getElementById("modalEditarCategoria")
          ).hide();

          alert("Categoría actualizada correctamente.");
          cargarCategorias();
        })
        .catch(() => alert("Error al editar la categoría."));
    });
  }

  // ── MODAL CREAR — confirmar ───────────────────────────────
  const btnCrear = document.getElementById("btn-confirmar-crear");
  if (btnCrear) {
    btnCrear.addEventListener("click", () => {
      const nombre = document.getElementById("crear-nombre").value.trim();

      if (!nombre) {
        alert("El nombre de la categoría es obligatorio.");
        return;
      }

      fetch("http://localhost:8080/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCategoria: nombre
        })
      })
        .then((r) => {
          if (!r.ok) throw new Error();
          return r.json();
        })
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
  }

  // ── MODAL ELIMINAR — confirmar ────────────────────────────
  const btnEliminar = document.getElementById("btn-confirmar-eliminar");
  if (btnEliminar) {
    btnEliminar.addEventListener("click", () => {
      fetch(`http://localhost:8080/api/categorias/${idCategoriaEliminar}`, {
        method: "DELETE"
      })
        .then((r) => {
          if (!r.ok) {
            return r.text().then((msg) => {
              throw new Error(msg);
            });
          }
        })
        .then(() => {
          bootstrap.Modal.getInstance(
            document.getElementById("modalEliminarCategoria")
          ).hide();

          alert("Categoría eliminada correctamente.");
          cargarCategorias();
        })
        .catch((err) =>
          alert(err.message || "Error al eliminar la categoría.")
        );
    });
  }
});

// ============================================================
// CARGAR CATEGORÍAS
// ============================================================
function cargarCategorias() {
  fetch("http://localhost:8080/api/categorias")
    .then((r) => {
      if (!r.ok) throw new Error();
      return r.json();
    })
    .then((data) => {
      todasLasCategorias = data;
      aplicarFiltros();
    })
    .catch(() => {
      document.getElementById("tabla-categoria").innerHTML = `
        <tr>
          <td colspan="3" class="text-center">
            Error al cargar los datos. Verifica tu servidor.
          </td>
        </tr>
      `;
    });
}

// ============================================================
// FILTROS
// ============================================================
function aplicarFiltros() {
  let datos = [...todasLasCategorias];

  if (filtroNombre) {
    datos = datos.filter((categoria) =>
      normalizarTexto(categoria.nombreCategoria ?? "").includes(filtroNombre)
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
        <td colspan="3" class="text-center">
          No hay categorías para mostrar.
        </td>
      </tr>
    `;
    return;
  }

  datos.forEach((categoria) => {
    const botones = `
      <button
        class="btn btn-sm btn-accion me-2"
        type="button"
        data-id="${categoria.id}"
        data-nombre="${escapeHtml(categoria.nombreCategoria ?? "")}"
        onclick="editarCategoria(this)"
        title="Editar categoría"
      >
        <i class="fa-solid fa-pen-to-square"></i>
      </button>

      <button
        class="btn btn-sm btn-accion"
        type="button"
        data-id="${categoria.id}"
        data-nombre="${escapeHtml(categoria.nombreCategoria ?? "")}"
        onclick="eliminarCategoria(this)"
        title="Eliminar categoría"
      >
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${categoria.id ?? "—"}</td>
      <td>${categoria.nombreCategoria ?? "—"}</td>
      <td>${botones}</td>
    `;

    tbody.appendChild(fila);
  });
}

// ============================================================
// ACCIONES
// ============================================================
window.editarCategoria = function (btn) {
  idCategoriaEditar = btn.dataset.id;

  document.getElementById("editar-nombre").value = btn.dataset.nombre ?? "";

  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("modalEditarCategoria")
  ).show();
};

window.eliminarCategoria = function (btn) {
  idCategoriaEliminar = btn.dataset.id;

  document.getElementById("modal-eliminar-mensaje").textContent =
    `¿Eliminar la categoría "${btn.dataset.nombre}"? Solo es posible si no tiene productos asignados.`;

  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("modalEliminarCategoria")
  ).show();
};

window.abrirModalCrear = function () {
  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("modalCrearCategoria")
  ).show();
};

// ============================================================
// HELPERS
// ============================================================
function normalizarTexto(texto) {
  return (texto ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeHtml(texto) {
  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}