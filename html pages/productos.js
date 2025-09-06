document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idProducto = urlParams.get("id");
  console.log("ID recibido:", idProducto);

  if (!idProducto) return;

  try {
    const res = await fetch("../data/lista_productos.xlsx");
    const ab = await res.arrayBuffer();
    const data = new Uint8Array(ab);
    const workbook = XLSX.read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const productos = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    console.log("Productos cargados:", productos);

    const producto = productos.find(
      (p) => String(p.id).trim() === String(idProducto).trim()
    );
    console.log("Producto encontrado:", producto);

    if (!producto) {
      alert("Producto no encontrado");
      return;
    }

    document.querySelector(".highlight").textContent =
      producto.nombre_producto || producto.nombre || "Nombre no disponible";
    document.querySelector(".price").textContent =
      producto.precio || "Precio no disponible";
    document.querySelector(".desc").textContent =
      producto.descripcion_prod ||
      producto.descripcion ||
      "Descripción no disponible";

    const mainImg = document.querySelector(".img-fluid");
    mainImg.src =
      producto.imagen ||
      producto.imagen_url ||
      "https://via.placeholder.com/500x400";
  } catch (err) {
    console.error("Error cargando producto:", err);
  }
});
