// login.js

document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.querySelector(".login-box form");

  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const contraseña = document.getElementById("contraseña").value.trim();

    if (!email || !contraseña) {
      alert("Por favor, ingresa tu correo y contraseña.");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario = usuarios.find(
      (u) => u.email === email && u.contraseña === contraseña
    );

  if (usuario) {
    alert(`¡Bienvenido, ${usuario.nombre}!`);

    // Guardar en localStorage para usarlo en index y otras páginas
    localStorage.setItem("usuario", usuario.nombre);

    // También puedes guardar todo el objeto si quieres
    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

    // Redirigir luego de 1 segundo
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);

      } else {
      // Mensaje de error si usuario no existe o contraseña incorrecta
      alert("Correo o contraseña incorrectos o usuario no registrado.");
    }
  
  });
});

