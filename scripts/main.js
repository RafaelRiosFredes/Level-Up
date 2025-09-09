document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => {
    window.location.href = "productos.html";
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const usuarioGuardado = localStorage.getItem("usuario"); // <- nombre directamente
  const loginDropdown = document.getElementById("loginDropdown");
  const dropdownMenu = loginDropdown.nextElementSibling;

  if (usuarioGuardado && loginDropdown && dropdownMenu) {
    loginDropdown.textContent = "Hola, " + usuarioGuardado;

    // Ocultar login y registro
    dropdownMenu.querySelectorAll('a[href="login.html"], a[href="registroUsuario.html"]').forEach(link => {
      link.style.display = "none";
    });

    // Agregar "Cerrar sesión" si no existe
    if (!document.getElementById("logoutBtn")) {
      const liLogout = document.createElement("li");
      liLogout.innerHTML = `<a class="dropdown-item text-white" href="#" id="logoutBtn">Cerrar sesión</a>`;
      dropdownMenu.insertBefore(liLogout, dropdownMenu.firstChild);

      document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("usuario");
        window.location.reload();
      });
    }
  }
});
