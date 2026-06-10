document.addEventListener('DOMContentLoaded', () => {
  // 1) Buscamos los elementos del HTML con los que vamos a trabajar
  const body = document.body;
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const btnHamburger = document.getElementById('btn-hamburger');

  // Si no existe el contenedor del sidebar, detenemos el script
  if (!sidebar) return;

  // 2) Leemos en qué página estamos desde el HTML a través de: <body data-page="productos">
  const currentPage = body.dataset.page || '';

  // 3) Centralizamos aquí las rutas del sidebar
  const routes = {
    reportes:  '../reporte/dashboard-report.html',
    productos: '../producto/dashboard-product.html',
    usuarios:  '../usuario/dashboard-users.html',
    categorias:'../categoria/dashboard-categoria.html',
    ventas:    '../venta/dashboard-venta.html',
    bug:       '../soporte/report-bug.html',
    ayuda:     '../soporte/help.html',
  };

  // 4) Esta función devuelve la clase correcta para cada enlace
  //    Si la página actual coincide, agrega la clase activa
  function getLinkClass(pageName) {
    return currentPage === pageName
      ? 'sidebar-link activo'
      : 'sidebar-link';
  }

  // 5) Aquí construimos TODO el HTML del sidebar desde JavaScript
  sidebar.innerHTML = `
    <div class="sidebar-header">
      <img src="../../img/logo-rdr-madera.webp" alt="Logo" class="sidebar-logo-img">
      <div class="sidebar-business-name">El Rincón <br> de Rango</div>
    </div>

    <div class="sidebar-category-title">Reportes:</div>
    <a href="${routes.reportes}" class="${getLinkClass('reportes')}">
      <i class="fa-solid fa-chart-line"></i>
      <span>Reportes</span>
    </a>

    <div class="sidebar-category-title">Actualizar datos:</div>
    <a href="${routes.productos}" class="${getLinkClass('productos')}">
      <i class="fa-solid fa-box-open"></i>
      <span>Productos</span>
    </a>
    <a href="${routes.usuarios}" class="${getLinkClass('usuarios')}">
      <i class="fa-solid fa-users"></i>
      <span>Usuarios</span>
    </a>
    <a href="${routes.categorias}" class="${getLinkClass('categorias')}">
      <i class="fa-solid fa-layer-group"></i>
      <span>Categorías</span>
    </a>
    <a href="${routes.ventas}" class="${getLinkClass('ventas')}">
      <i class="fa-solid fa-tag"></i>
      <span>Ventas</span>
    </a>

    <div class="sidebar-footer">
      <a class="${getLinkClass('bug')}" id="btn-reportar-bug">
        <i class="fa-solid fa-bug"></i>
        <span>Reportar bug</span>
      </a>
      <a class="${getLinkClass('ayuda')}">
        <i class="fa-solid fa-circle-question"></i>
        <span>Ayuda</span>
      </a>
      <a class="${getLinkClass('logout')}" id="btn-cerrar-sesion">
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>Cerrar Sesión</span>
      </a>
    </div>
  `;

    // Botón de cerrar sesión
const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "../../auth/login.html";
  });
}

  // 6) Lógica del botón hamburguesa para mobile
  //    Cuando se hace click, abrimos/cerramos el sidebar
  if (btnHamburger && overlay) {
    btnHamburger.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar-open');
      overlay.classList.toggle('active');
    });

    // 7) Si el usuario hace click en el overlay, cerramos el sidebar
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('sidebar-open');
      overlay.classList.remove('active');
    });
  }
});