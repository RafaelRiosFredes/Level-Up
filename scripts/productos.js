const DEFAULT_EXCEL_URL = "../data/lista_productos.xlsx";
const contenedor = document.getElementById("contenedor-productos");

let allProducts = []; // guardamos todos los productos aquí

document.addEventListener("DOMContentLoaded", () => {
  fetchDefaultExcel(DEFAULT_EXCEL_URL);

  // eventos de categorías
  document.querySelectorAll(".categorias .list-group-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".categorias .list-group-item")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const categoria = btn.getAttribute("data-categoria");
      filterProducts(categoria);
    });
  });

  // búsqueda por query string (desde busqueda.js → productos.html?busqueda=xxx)
  const params = new URLSearchParams(window.location.search);
  const search = params.get("busqueda");
  if (search) {
    const query = normalize(search);
    filterBySearch(query);
  }
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

    allProducts = json;

    // 👇 revisar si la URL trae parámetro de búsqueda
    const params = new URLSearchParams(window.location.search);
    const search = params.get("busqueda");
    if (search) {
      filterBySearch(normalize(search));
    } else {
      filterProducts("all"); // solo mostrar todo si NO hay búsqueda
    }
  } catch (err) {
    console.error("Error procesando workbook:", err);
    showNoProductsMessage("Error al procesar el archivo.");
  }
}


function clearProducts() {
  contenedor.innerHTML = "";
}

function createProductElement(prod) {
  const nombre = prod.nombre_producto || prod.nombre || "Producto";
  const precioRaw = prod.precio || prod.price || "";
  const categoria = (prod.categoria || "").replace(/\s+/g, "-");
  const imagen =
    prod.imagen ||
    prod.imagen_url ||
    "https://via.placeholder.com/300x300?text=Sin+imagen";

  const article = document.createElement("article");
  article.className = `col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center producto-item ${categoria}`;

  const productoDiv = document.createElement("div");
  productoDiv.className = "producto";
  productoDiv.style.cursor = "pointer";

  const img = document.createElement("img");
  img.className = "imagen-producto";
  img.src = imagen;
  img.alt = nombre;

  const nombreDiv = document.createElement("div");
  nombreDiv.className = "nombre-producto";
  nombreDiv.textContent = nombre;

  const precioDiv = document.createElement("div");
  precioDiv.className = "precio-producto";
  precioDiv.textContent = formatPrice(precioRaw);

  const descripcionDiv = document.createElement("div");
  descripcionDiv.className = "descripcion-producto d-none";
  descripcionDiv.textContent = prod.descripcion_prod || prod.descripcion || "";

  const btn = document.createElement("a");
  btn.className = "btn btn-custom anadir-carrito";
  btn.href = "#";
  btn.textContent = "Añadir al carrito";

  productoDiv.addEventListener("click", (e) => {
    if (e.target === btn) return; // evitar conflicto con botón
    const prodId = encodeURIComponent(String(prod.id).trim());
    window.location.href = `producto.html?id=${prodId}`;
  });

  productoDiv.append(img, nombreDiv, precioDiv, descripcionDiv, btn);
  article.appendChild(productoDiv);

  return article;
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

  filtered.forEach((prod) =>
    contenedor.appendChild(createProductElement(prod))
  );
}

function filterBySearch(query) {
  clearProducts();
  const filtered = allProducts.filter((p) =>
    normalize(p.nombre_producto || p.nombre).includes(query)
  );

  if (filtered.length === 0) {
    showNoProductsMessage("No se encontraron productos para tu búsqueda.");
    return;
  }

  filtered.forEach((prod) =>
    contenedor.appendChild(createProductElement(prod))
  );
}

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

function showNoProductsMessage(msg = "No se encontraron productos.") {
  clearProducts();
  const div = document.createElement("div");
  div.className = "col-12";
  div.innerHTML = `<div class="alert alert-info">${msg}</div>`;
  contenedor.appendChild(div);
}

function normalize(str) {
  return str
    ? str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    : "";
}
