document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  if (!header) return;

  header.innerHTML = `
    <nav class="navbar navbar-expand-md sticky-top menu-navbar">
      <div class="container menu-navbar-container">

        <a class="navbar-brand d-flex align-items-center gap-2">
          <img
            src="img/logo-rdr-madera.webp"
            alt="Logo Rincón de Rango"
            class="menu-logo"
          />
          <span class="menu-brand-name">Rincón de Rango</span>
        </a>

        <button
          class="navbar-toggler menu-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <i class="fa-solid fa-bars"></i>
        </button>

        <div class="collapse navbar-collapse" id="navbarMenu">
          <div class="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2 ms-auto py-2 py-md-0 w-100">

            <div class="input-group menu-search-group">
              <span class="input-group-text bg-white border-end-0">
                <i class="fa-solid fa-magnifying-glass menu-icon-color"></i>
              </span>

              <input
                type="text"
                id="header-search"
                class="form-control border-start-0 border-end-0"
                placeholder="Buscar plato..."
                autocomplete="off"
              />

              <button
                type="button"
                id="header-search-clear"
                class="input-group-text bg-white border-start-0 menu-search-clear"
                aria-label="Limpiar búsqueda"
                style="display: none;"
              >
                <i class="fa-solid fa-xmark menu-icon-color"></i>
              </button>
            </div>

            <div class="input-group menu-select-group">
              <span class="input-group-text bg-white border-end-0">
                <i class="fa-solid fa-layer-group menu-icon-color"></i>
              </span>
              <select id="header-categorias" class="form-select border-start-0">
                <option value="todas">Categorías</option>
              </select>
            </div>

            <a href="auth/login.html" class="btn menu-btn-login d-flex align-items-center gap-2 justify-content-center">
              <i class="fa-solid fa-user"></i>
              <span class="d-md-none">Mi cuenta</span>
            </a>

          </div>
        </div>

      </div>
    </nav>
  `;

  const searchInput = document.getElementById('header-search');
  const clearBtn = document.getElementById('header-search-clear');

  if (!searchInput || !clearBtn) return;

  searchInput.addEventListener('input', () => {
    const hasValue = searchInput.value.trim().length > 0;
    clearBtn.style.display = hasValue ? 'flex' : 'none';
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    searchInput.focus();
  });
});