// sidebar.js
const btnHamburger = document.getElementById('btn-hamburger');
const sidebar      = document.getElementById('sidebar');
const overlay      = document.getElementById('overlay');

// ✅ Verifica que existan antes de agregar eventos
if (btnHamburger && sidebar && overlay) {

    btnHamburger.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-open');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('sidebar-open');
        overlay.classList.remove('active');
    });

}