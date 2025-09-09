document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idProducto = urlParams.get("id");

  if (!idProducto) return;

  try {
    const res = await fetch("../data/lista_productos.xlsx");
    const ab = await res.arrayBuffer();
    const data = new Uint8Array(ab);
    const workbook = XLSX.read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const productos = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    // Buscar producto actual
    const producto = productos.find(
      (p) => String(p.id).trim() === idProducto.trim()
    );

    if (!producto) {
      alert("Producto no encontrado");
      return;
    }

    // Llenar información del producto actual
    document.querySelector(".highlight").textContent =
      producto.nombre_producto || producto.nombre || "Producto";
    document.querySelector(".price").textContent = formatPrice(
      producto.precio || producto.price
    );
    document.querySelector(".desc").textContent =
      producto.descripcion_prod || producto.descripcion || "Sin descripción";

    const mainImg = document.querySelector(".img-fluid");
    mainImg.src =
      producto.imagen ||
      producto.imagen_url ||
      "https://via.placeholder.com/500x400";

    // Breadcrumb
    const breadcrumb = document.querySelector("section.container p");
    breadcrumb.innerHTML = `
      <a href="index.html" class="text-decoration-none text-info">Inicio</a> &gt;
      <span class="text-info">${
        producto.categoria || "Sin categoría"
      }</span> &gt;
      <span>${producto.nombre_producto || producto.nombre || "Producto"}</span>
    `;

    // 🔹 Mostrar productos relacionados
    mostrarRelacionados(producto, productos);
  } catch (err) {
    console.error("Error cargando producto:", err);
  }
});

// Función para formatear precio
function formatPrice(value) {
  if (!value) return "Consultar";
  let n = String(value)
    .replace(/[^\d,-]/g, "")
    .replace(",", ".");
  const num = Number(n);
  if (isNaN(num)) return String(value);
  return (
    "$" +
    Math.round(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
}

// 🔹 Renderizar relacionados
function mostrarRelacionados(productoActual, todos) {
  const contenedor = document.getElementById("contenedor-relacionados");
  contenedor.innerHTML = "";

  const relacionados = todos.filter(
    (p) =>
      p.categoria === productoActual.categoria &&
      String(p.id).trim() !== String(productoActual.id).trim()
  );

  if (relacionados.length === 0) {
    contenedor.innerHTML =
      '<p class="text-white">No hay productos relacionados.</p>';
    return;
  }

  relacionados.slice(0, 10).forEach((rel) => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-3 col-lg-2";

    col.innerHTML = `
      <div class="producto bg-dark p-2 rounded text-center h-100" style="cursor:pointer;">
        <div class="imagen-wrapper">
          <img src="${rel.imagen || "https://via.placeholder.com/200"}" 
               class="imagen-producto img-fluid" 
               alt="${rel.nombre_producto}">
        </div>
        <div class="nombre-producto text-white mt-2">${
          rel.nombre_producto
        }</div>
        <div class="precio-producto text-info">${formatPrice(rel.precio)}</div>
        <button class="btn btn-custom anadir-carrito mt-2">Añadir</button>
      </div>
    `;

    const divProducto = col.querySelector(".producto");
    const btn = col.querySelector(".anadir-carrito");

    // 🔹 Click en todo el producto abre el detalle
    divProducto.addEventListener("click", () => {
      window.location.href = `producto.html?id=${rel.id}`;
    });

    // 🔹 Botón añadir al carrito (no abre el detalle)
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // evita que dispare el click del div
      const productoCarrito = {
        nombre: rel.nombre_producto,
        precio: parseInt(rel.precio) || 0,
        cantidad: 1,
        imagen: rel.imagen || "https://via.placeholder.com/200",
      };
      agregarAlCarrito(productoCarrito);
    });

    contenedor.appendChild(col);
  });

 
}

// ⭐ Calificación con estrellas
document.addEventListener("DOMContentLoaded", () => {
  const estrellas = document.querySelectorAll("#estrellas i");
  let valorSeleccionado = 0;

  estrellas.forEach((estrella, index) => {
    // Hover: mostrar color hasta esa estrella
    estrella.addEventListener("mouseover", () => {
      estrellas.forEach((e, i) => {
        e.classList.toggle("hover", i <= index);
      });
    });

    // Salir del hover: quitar efecto
    estrella.addEventListener("mouseout", () => {
      estrellas.forEach((e, i) => {
        e.classList.remove("hover");
      });
    });

    // Click: marcar como seleccionadas
    estrella.addEventListener("click", () => {
      valorSeleccionado = index + 1;
      estrellas.forEach((e, i) => {
        e.classList.toggle("selected", i < valorSeleccionado);
      });

      console.log(`⭐ Calificación seleccionada: ${valorSeleccionado}`);
    });
  });
});