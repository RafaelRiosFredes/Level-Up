function filtrarProductos(categoria) {
    const productos = document.querySelectorAll('.producto-item');

    productos.forEach(producto => {
      if (categoria === 'todos' || producto.classList.contains(categoria)) {
        producto.style.display = 'block';
      } else {
        producto.style.display = 'none';
      }
    });
  }

  // Leer parámetro de la URL y aplicar filtro
  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get('categoria') || 'todos'; // Si no hay, muestra todos
    filtrarProductos(categoria);
  });

  producto = {
    id: 1,
    nombre: "Producto de ejemplo",
    precio: 1000,
    categoria: "juegos-mesa"

  }

  contenedor = document.getElementById("contenedor-productos");
  const productosEnCarrito = [];


  productosEnCarrito.filter(producto => producto.categoria == "juegos-mesa");
  
  const article = document.createElement("article");
  article.classList.add("col-6", "col-md-3", "producto-item", "juegos-mesa");
  const divProducto = document.createElement("div");
  article.appendChild(divProducto);

  contenedor.appendChild(li);