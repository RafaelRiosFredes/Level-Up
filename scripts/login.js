const formLogin = document.querySelector(".login-box form");

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const contraseña = document.getElementById("contraseña").value.trim();

  if (!email || !contraseña) {
    alert("Ingresa tu correo y contraseña");
    return;
  }

  // Obtener usuarios del LocalStorage
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Buscar usuario
  const usuario = usuarios.find(u => u.email === email && u.contraseña === contraseña);

  if (usuario) {
    alert(`¡Bienvenido, ${usuario.nombre}!`);
    formLogin.reset();
    // window.location.href = "index.html"; // Redirigir si quieres
  } else {
    alert("Correo o contraseña incorrectos");
  }
});
