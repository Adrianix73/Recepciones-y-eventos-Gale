document.getElementById("btnIngresar").addEventListener("click", () => { 
    

    // Captura lo que se escribió en los imputs
    const userValue = document.getElementById("usuario").value;
    const passValue = document.getElementById("clave").value;

    // Arma el objeto JSON que JAVA espera recibir
    const loginData = {
        nombre: userValue, // coincide con getNombre() en java
        clave: passValue // coincide con getClave() en java
    };

    // Envía ese JSON al backend usando fetch
    fetch("http://localhost:8080/api/auth/login", {
        method: "POST", // Método para enviar datos
        headers: { "Content-Type": "application/json" }, // le dice al backend que es JSON
        body: JSON.stringify(loginData) // Covierte el JS a texto JSON
    })

    // Cunado el backend responde, lee la respuesta como texto
    .then(response => {
        // Si la respuesta es exitosa (200), leemos el JSON
        if (response.ok) {
            return response.json();
        } else {
            // Si hay error (401 o 404), leemos el texto del error
            return response.text().then(text => { throw new Error(text) });
        }
    })

    .then(usuario => {
        console.log("Usuario logueado:", usuario.rol);
        alert("¡Bienvenid@, " + usuario.nombre + "!");

        // Guardamos el nombre del usuario en la sesión del navegador para usarlo en otras páginas
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

        // Redireción según rol
        if (usuario.rol === "Admin") {
            window.location.href = "../admin/producto/dashboard-product.html";
        } else if (usuario.rol === "Cajero") {
            window.location.href = "../cajero/caja.html";
        } else {
            window.location.href = "../mozo/menu-mozo.html";
        }
    })

    // Si hay error de conexión (backend apagado, etc)
    .catch(error => {
        alert("Error: " + error.message);
    });
});

document.getElementById("btn-volver").addEventListener("click", () => {
    window.location.href = "../index.html";
});