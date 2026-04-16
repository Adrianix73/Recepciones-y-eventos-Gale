// Muestra u oculta la contraseña y cambia el ícono del ojo
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icono = btn.querySelector("i");

    if (input.type === "password") {
        input.type = "text";
        icono.className = "fa-solid fa-eye-slash"; // ojo cerrado
    } else {
        input.type = "password";
        icono.className = "fa-solid fa-eye"; // ojo abierto
    }
}