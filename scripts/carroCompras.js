// FUNCIONES GENERALES DEL CARRITO

// Actualiza el badge del carrito en el navbar
function actualizarBadgeCarrito() {
  const badge = document.getElementById("cantidad-carrito");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  if (badge) badge.innerText = totalCantidad;
}

// Muestra el carrito en la página carrito
function mostrarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  if (!lista) return;

  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = "<p class='text-white'>Tu carrito está vacío 🛒</p>";
    document.getElementById("totalCarrito").innerText = "$0";
    return;
  }

  let total = 0;

  carrito.forEach((item, index) => {
    total += item.precio * item.cantidad;

    let div = document.createElement("div");
    div.classList.add("d-flex", "align-items-center", "bg-dark", "p-3", "rounded", "mb-3");
    div.innerHTML = `
      <img src="${item.imagen}" class="rounded me-3" alt="${item.nombre}" style="width:100px;">
      <div class="flex-grow-1">
        <h5 class="mb-1">${item.nombre}</h5>
        <p class="text-muted small">Precio unitario: $${item.precio}</p>
        <div class="d-flex align-items-center">
          <button class="btn btn-sm btn-outline-light" onclick="cambiarCantidad(${index}, -1)"><i class="bi bi-dash"></i></button>
          <input type="number" value="${item.cantidad}" min="1" class="form-control mx-1 text-center" style="width:60px;" disabled>
          <button class="btn btn-sm btn-outline-light" onclick="cambiarCantidad(${index}, 1)"><i class="bi bi-plus"></i></button>
        </div>
      </div>
      <p class="price me-3">$${item.precio * item.cantidad}</p>
      <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${index})">
        <i class="bi bi-trash"></i>
      </button>
    `;
    lista.appendChild(div);
  });

  document.getElementById("totalCarrito").innerText = "$" + total;
}

// Elimina un producto del carrito
function eliminarProducto(index) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarBadgeCarrito();
  mostrarCarrito();
}

// Cambia la cantidad de un producto en el carrito
function cambiarCantidad(index, cambio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito[index].cantidad += cambio;
  if (carrito[index].cantidad < 1) carrito[index].cantidad = 1;
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarBadgeCarrito();
  mostrarCarrito();
}

// AGREGA PRODUCTO AL CARRITO DESDE PÁGINA DE PRODUCTO
function agregarAlCarrito(producto) {
  // producto = { nombre, precio, cantidad, imagen }
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Si el producto ya existe, solo actualiza la cantidad
  const index = carrito.findIndex(item => item.nombre === producto.nombre);
  if (index !== -1) {
    carrito[index].cantidad += producto.cantidad;
  } else {
    carrito.push(producto);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarBadgeCarrito();
  alert(`${producto.nombre} agregado al carrito 🛒`);
}

// EVENT LISTENER PARA EL BOTÓN "AÑADIR AL CARRITO" EN PRODUCTO
document.addEventListener("DOMContentLoaded", () => {
  actualizarBadgeCarrito();
  mostrarCarrito();

  const btnAgregar = document.querySelector(".btn-custom");
  if (btnAgregar) {
    btnAgregar.addEventListener("click", (e) => {
      e.preventDefault();
      const nombre = document.querySelector("h1.highlight").innerText || "Producto";
      const precioStr = document.querySelector(".price").innerText.replace("$", "").replace(".", "");
      const precio = parseInt(precioStr) || 0;
      const cantidad = parseInt(document.getElementById("cantidad").value) || 1;
      const imagen = document.querySelector(".img-fluid").src || "";

      const producto = { nombre, precio, cantidad, imagen };
      agregarAlCarrito(producto);
    });
  }
});
