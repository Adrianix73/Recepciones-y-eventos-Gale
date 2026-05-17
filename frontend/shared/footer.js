document.addEventListener('DOMContentLoaded', () => {
  // Buscamos los elementos del HTML con los que vamos a trabajar
  const body = document.body;
  const footer = document.getElementById('footer');

  // Si no existe el contenedor del footer, detenemos el script
  if (!footer) return;

  // Aquí construimos TODO el HTML del footer desde JavaScript
  footer.innerHTML = `
    <div class="footer-content">
            <!-- Sección de Contacto Añadida -->
            <div class="footer-contact">

                <a href="contacto.html" class="btn">CONTACTO</a>

                <div class="social-icons">
                    <a href="https://instagram.com" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="https://facebook.com" target="_blank" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://tiktok.com" target="_blank" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>
                </div>
                <div class="contact-details">
                    <p><i class="fas fa-phone"></i> +51 987 654 321</p>
                    <p><i class="fas fa-envelope"></i> contacto@ecomarket.com.pe</p>
                </div>
            </div>

        <p>&copy; ECOMARKET 2025. Todos los derechos reservados.</p>
        </div>
  `;
});