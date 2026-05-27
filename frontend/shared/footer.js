document.addEventListener('DOMContentLoaded', () => {
  const footer = document.getElementById('footer');
  if (!footer) return;

  footer.innerHTML = `
    <footer class="menu-footer">
      <div class="container menu-footer-container">

        <div class="row align-items-center gy-3">

          <!-- Redes sociales (izquierda) -->
          <div class="col-12 col-md-6 d-flex align-items-center gap-3">
            <a href="https://facebook.com"  target="_blank" aria-label="Facebook"  class="menu-social-link">
              <i class="fab fa-facebook-f fs-5"></i>
            </a>
            <a href="https://instagram.com" target="_blank" aria-label="Instagram" class="menu-social-link">
              <i class="fab fa-instagram fs-5"></i>
            </a>
            <a href="https://youtube.com"   target="_blank" aria-label="YouTube"   class="menu-social-link">
              <i class="fab fa-youtube fs-5"></i>
            </a>
            <a href="https://tiktok.com"    target="_blank" aria-label="TikTok"    class="menu-social-link">
              <i class="fab fa-tiktok fs-5"></i>
            </a>
          </div>

          <!-- Contacto (derecha) -->
          <div class="col-12 col-md-6 d-flex flex-column align-items-md-end gap-1">
            <p class="mb-0 small">
              <i class="fas fa-phone me-2 menu-icon-color"></i>+51 987 654 321
            </p>
            <p class="mb-0 small">
              <i class="fas fa-envelope me-2 menu-icon-color"></i>contacto@riconderango.com.pe
            </p>
          </div>

        </div>

        <hr class="menu-footer-divider mt-3 mb-2" />

        <!-- Copyright -->
        <p class="text-center small text-secondary mb-0">
          &copy; RINCÓN DE RANGO 2026. Todos los derechos reservados.
        </p>

      </div>
    </footer>
  `;
});