(function () {
  function renderAdminFilters({
    containerId,
    searchPlaceholder = "Buscar...",
    showCategory = true,
    showStatus = true,
    initialStatus = "activos"
  }) {
    const container = document.getElementById(containerId);

    if (!container) {
      console.warn(`No se encontró el contenedor de filtros: #${containerId}`);
      return;
    }

    container.innerHTML = `
      <section class="admin-filters">
        <div class="admin-filters__row">
          <div class="admin-filters__search">
            <label class="admin-filters__label" for="${containerId}-search">Buscar</label>
            <div class="admin-filters__search-box">
              <input
                type="text"
                id="${containerId}-search"
                class="form-control"
                placeholder="${searchPlaceholder}"
                data-role="search"
              />
              <button
                type="button"
                class="btn btn-outline-secondary"
                data-role="clear-search"
              >
                Limpiar
              </button>
            </div>
          </div>

          ${
            showCategory
              ? `
              <div class="admin-filters__group">
                <label class="admin-filters__label" for="${containerId}-category">Categoría</label>
                <select
                  id="${containerId}-category"
                  class="form-select"
                  data-role="category"
                >
                  <option value="">Todas las categorías</option>
                </select>
              </div>
            `
              : ""
          }
        </div>

        ${
          showStatus
            ? `
            <div class="admin-filters__row">
              <div class="admin-filters__status" data-role="status-group">
                <button
                  type="button"
                  class="btn btn-filtro-admin ${initialStatus === "activos" ? "activo" : ""}"
                  data-role="status"
                  data-status="activos"
                >
                  Activos
                </button>

                <button
                  type="button"
                  class="btn btn-filtro-admin ${initialStatus === "inactivos" ? "activo" : ""}"
                  data-role="status"
                  data-status="inactivos"
                >
                  Inactivos
                </button>

                <button
                  type="button"
                  class="btn btn-filtro-admin ${initialStatus === "todos" ? "activo" : ""}"
                  data-role="status"
                  data-status="todos"
                >
                  Todos
                </button>
              </div>
            </div>
          `
            : ""
        }
      </section>
    `;
  }

  window.renderAdminFilters = renderAdminFilters;
})();