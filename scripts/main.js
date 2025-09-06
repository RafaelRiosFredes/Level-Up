const DEFAULT_EXCEL_URL = "../data/lista_productos.xlsx"; // <-- Ajusta si el Excel por defecto está en otra ruta
const contenedor = document.getElementById("contenedor-productos");
const fileInput = document.getElementById("excel-file");

document.addEventListener("DOMContentLoaded", () => {
  // Intentar cargar el Excel por defecto
  fetchDefaultExcel(DEFAULT_EXCEL_URL);

});

async function fetchDefaultExcel(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("No encontrado");
    const ab = await res.arrayBuffer();
    handleWorkbook(ab);
  } catch (err) {
    console.warn("No se pudo cargar el Excel por defecto:", err);
    showNoProductsMessage();
  }
}

function handleWorkbook(arrayBuffer) {
  try {
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    renderProducts(json);
  } catch (err) {
    console.error("Error procesando workbook:", err);
    showNoProductsMessage("Error al procesar el archivo.");
  }
}

function clearProducts() {
  contenedor.innerHTML = "";
}

function renderProducts(products) {
  clearProducts();
  if (!products || products.length === 0) {
    showNoProductsMessage();
    return;
  }

  products.forEach((prod) => {
    const node = createProductElement(prod);
    contenedor.appendChild(node);
  });
}

function createProductElement(prod) {
  // Esperamos campos: nombre_producto, descripcion_prod, precio, categoria, imagen
  const nombre = prod.nombre_producto || prod.nombre || "Producto";
  const descripcion = prod.descripcion_prod || prod.descripcion || "";
  const precioRaw = prod.precio || prod.price || "";
  const categoria = (prod.categoria || "").replace(/\s+/g, "-"); // clase
  const imagen =
    prod.imagen ||
    prod.imagen_url ||
    prod.image ||
    "https://via.placeholder.com/300x300?text=Sin+imagen";

  // Crear article
  const article = document.createElement("article");
  article.className = `col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center producto-item ${categoria}`;


  const productoDiv = document.createElement("div");
  productoDiv.className = "producto";

  const imgWrapper = document.createElement("div");
  imgWrapper.className = "imagen-wrapper";

  const img = document.createElement("img");
  img.className = "imagen-producto";
  img.src = imagen;
  img.alt = nombre;
  img.onerror = () => {
    img.src = "https://via.placeholder.com/300x300?text=Sin+imagen";
  };

  const nombreDiv = document.createElement("div");
  nombreDiv.className = "nombre-producto";
  nombreDiv.textContent = nombre;

  const precioDiv = document.createElement("div");
  precioDiv.className = "precio-producto";
  precioDiv.textContent = formatPrice(precioRaw);

  const descripcionDiv = document.createElement("div");
  descripcionDiv.className = "descripcion-producto d-none"; // para mostrar, quitar d-none
  descripcionDiv.textContent = descripcion;

  const btn = document.createElement("a");
  btn.className = "btn btn-custom anadir-carrito";
  btn.href = "#";
  btn.textContent = "Añadir al carrito";

  imgWrapper.appendChild(img);
  productoDiv.appendChild(imgWrapper);
  productoDiv.appendChild(nombreDiv);
  productoDiv.appendChild(precioDiv);
  productoDiv.appendChild(descripcionDiv);
  productoDiv.appendChild(btn);
  article.appendChild(productoDiv);

  return article;
}

function formatPrice(value) {
  // acepta número o string. Si es vacío retorna 'Consultar'
  if (value === null || value === undefined || value === "") return "Consultar";
  // si viene con símbolos, limpiar y parsear
  let n = String(value)
    .replace(/[^\d,-]/g, "")
    .replace(",", ".");
  let num = Number(n);
  if (isNaN(num)) return String(value); // devolver tal cual si no es parseable
  // redondear a entero y formatear con puntos de miles
  const entero = Math.round(num);
  return "$" + entero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function showNoProductsMessage(
  msg = "No se encontraron productos."
) {
  clearProducts();
  const div = document.createElement("div");
  div.className = "col-12";
  div.innerHTML = `<div class="alert alert-info">${msg}</div>`;
  contenedor.appendChild(div);
}

let allProducts = []; // guardamos todos los productos aquí

function renderProducts(products) {
  clearProducts();
  if (!products || products.length === 0) {
    showNoProductsMessage();
    return;
  }

  allProducts = products; // guardar para poder filtrar después
  filterProducts("all"); // mostrar todos al inicio
}

function filterProducts(categoria) {
  clearProducts();
  let filtered = [];

  if (categoria === "all") {
    filtered = allProducts;
  } else {
    filtered = allProducts.filter((p) => {
      const cat = (p.categoria || "").toLowerCase().replace(/\s+/g, "-");
      return cat === categoria;
    });
  }

  if (filtered.length === 0) {
    showNoProductsMessage("No hay productos en esta categoría.");
    return;
  }

  filtered.forEach((prod) => {
    const node = createProductElement(prod);
    contenedor.appendChild(node);
  });
}

// ---- evento para los botones de categoría ----
document.addEventListener("DOMContentLoaded", () => {
  fetchDefaultExcel(DEFAULT_EXCEL_URL);

  document.querySelectorAll(".categorias .list-group-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      // cambiar clase active
      document
        .querySelectorAll(".categorias .list-group-item")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // filtrar
      const categoria = btn.getAttribute("data-categoria");
      filterProducts(categoria);
    });
  });
});
