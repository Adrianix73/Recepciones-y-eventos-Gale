document.addEventListener('DOMContentLoaded', () => {
  // Buscamos los elementos del HTML con los que vamos a trabajar
  const body = document.body;
  const header = document.getElementById('header');

  // Si no existe el contenedor del header, detenemos el script
  if (!header) return;

  // Aquí construimos TODO el HTML del header desde JavaScript
  header.innerHTML = `
    <img src="img/logo-rdr-madera.webp" alt="Logo" class="logo">

        <div class="categoria">
            <select name="categorias" id="categorias">
                <option value="categoria">Categorías</option>
            </select>
        </div>

        <div class="buscador">
            <input type="text" id="input-buscar" placeholder="Buscar plato">
            <button type="submit">
                <i class="fa-solid fa-magnifying-glass"></i>
            </button>  
        </div>

        <div class="cuenta">
        <button type="submit" id="loginInicial">
            <i class="fa-solid fa-user"></i>
        </button>
        </div>
  `;
});