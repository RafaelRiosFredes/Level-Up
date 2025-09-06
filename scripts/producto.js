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

    // DEBUG: ver IDs
    console.log("ID buscado:", idProducto);
    console.log(
      "IDs disponibles:",
      productos.map((p) => p.id)
    );

    // Búsqueda por ID más segura: trim y forzar string
    const producto = productos.find(
      (p) => String(p.id).trim() === idProducto.trim()
    );

    if (!producto) {
      alert("Producto no encontrado");
      return;
    }

    // Llenar información del producto
    document.querySelector(".highlight").textContent =
      producto.nombre_producto || producto.nombre || "Producto";
    document.querySelector(".price").textContent = formatPrice(
      producto.precio || producto.price
    );
    document.querySelector(".desc").textContent =
      producto.descripcion_prod || producto.descripcion || "Sin descripción";

    // Imagen principal
    const mainImg = document.querySelector(".img-fluid");
    mainImg.src =
      producto.imagen ||
      producto.imagen_url ||
      "https://via.placeholder.com/500x400";

    // Opcional: actualizar breadcrumb
    const breadcrumb = document.querySelector("section.container p");
    // Limpiar contenido actual
    breadcrumb.innerHTML = `
  <a href="index.html" class="text-decoration-none text-info">Inicio</a> &gt;
  <span class="text-info">${producto.categoria || "Sin categoría"}</span> &gt;
  <span>${producto.nombre_producto || producto.nombre || "Producto"}</span>
`;
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


