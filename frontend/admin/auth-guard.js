// Si no hay sesión guardada o el rol no es Admin,
// redirige al login automáticamente.

(function () {
  const usuarioGuardado = localStorage.getItem("usuarioLogueado");

  // Si no hay nadie logueado, manda al login
  if (!usuarioGuardado) {
    window.location.replace("../../auth/login.html");
    return;
  }

  const usuario = JSON.parse(usuarioGuardado);

  // Si el rol no es Admin, manda al login
  if (usuario.rol !== "Admin") {
    window.location.replace("../../auth/login.html");
  }
})();