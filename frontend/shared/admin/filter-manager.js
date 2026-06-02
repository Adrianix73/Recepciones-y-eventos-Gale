(function () {
  function createAdminFilterManager({
    containerId,
    initialFilters = {},
    onChange = () => {}
  }) {
    const container = document.getElementById(containerId);

    if (!container) {
      console.warn(`No se encontró el contenedor de filtros: #${containerId}`);
      return null;
    }

    const searchInput = container.querySelector('[data-role="search"]');
    const clearButton = container.querySelector('[data-role="clear-search"]');
    const categorySelect = container.querySelector('[data-role="category"]');
    const statusButtons = container.querySelectorAll('[data-role="status"]');

    const state = {
      search: initialFilters.search ?? "",
      category: initialFilters.category ?? "",
      status: initialFilters.status ?? "activos"
    };

    function emitChange() {
      onChange({ ...state });
    }

    function syncUI() {
      if (searchInput) {
        searchInput.value = state.search;
      }

      if (categorySelect) {
        categorySelect.value = state.category;
      }

      statusButtons.forEach((btn) => {
        btn.classList.toggle("activo", btn.dataset.status === state.status);
      });
    }

    function setCategoryOptions(options, placeholder = "Todas las categorías") {
      if (!categorySelect) return;

      const currentValue = state.category;

      categorySelect.innerHTML = `<option value="">${placeholder}</option>`;

      options.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option.value;
        opt.textContent = option.label;
        categorySelect.appendChild(opt);
      });

      if ([...categorySelect.options].some((opt) => opt.value === currentValue)) {
        categorySelect.value = currentValue;
      } else {
        categorySelect.value = "";
        state.category = "";
      }
    }

    function reset() {
      state.search = "";
      state.category = "";
      state.status = "activos";
      syncUI();
      emitChange();
    }

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        state.search = searchInput.value.trim();
        emitChange();
      });
    }

    if (clearButton) {
      clearButton.addEventListener("click", () => {
        state.search = "";
        if (searchInput) {
          searchInput.value = "";
          searchInput.focus();
        }
        emitChange();
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener("change", () => {
        state.category = categorySelect.value;
        emitChange();
      });
    }

    statusButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        state.status = btn.dataset.status;
        syncUI();
        emitChange();
      });
    });

    syncUI();

    return {
      getFilters() {
        return { ...state };
      },
      setFilters(nextFilters = {}) {
        state.search = nextFilters.search ?? state.search;
        state.category = nextFilters.category ?? state.category;
        state.status = nextFilters.status ?? state.status;
        syncUI();
        emitChange();
      },
      setCategoryOptions
    };
  }

  window.createAdminFilterManager = createAdminFilterManager;
})();