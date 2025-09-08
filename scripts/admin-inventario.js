const EXCEL_URL = "../data/lista_productos.xlsx";

document.addEventListener("DOMContentLoaded", () => {
  cargarInventario();
});

let inventarioGlobal = []; // guardamos inventario completo
let inventarioFiltrado = []; // Productos filtrados según búsqueda y categoría
let paginaActual = 1;
const productosPorPagina = 20;

async function cargarInventario() {
  try {
    const res = await fetch(EXCEL_URL);
    const ab = await res.arrayBuffer();
    const data = new Uint8Array(ab);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetProductos = workbook.Sheets[workbook.SheetNames[0]];
    const productos = XLSX.utils.sheet_to_json(sheetProductos, { defval: "" });

    const sheetStock = workbook.Sheets[workbook.SheetNames[1]];
    const stockData = XLSX.utils.sheet_to_json(sheetStock, { defval: "" });

    inventarioGlobal = productos.map((p) => {
      const s = stockData.find((item) => String(item.id) === String(p.id));
      const stock = s ? Number(s.stock) : 0;
      const estado = calcularEstado(stock);

      return {
        id: p.id,
        nombre: p.nombre_producto,
        categoria: p.categoria,
        precio: p.precio,
        stock,
        estado,
      };
    });

    // Inicialmente mostrar todos los productos
    inventarioFiltrado = [...inventarioGlobal];
    renderTablaPaginada();
    inicializarFiltros();
  } catch (err) {
    console.error("Error al procesar inventario:", err);
  }
}

function inicializarFiltros() {
  const selectCategoria = document.getElementById("filtro-categoria");
  const inputBusqueda = document.getElementById("busqueda-producto");

  selectCategoria.addEventListener("change", aplicarFiltros);
  inputBusqueda.addEventListener("input", aplicarFiltros);
}

function aplicarFiltros() {
  const categoria = document.getElementById("filtro-categoria").value;
  const busqueda = document
    .getElementById("busqueda-producto")
    .value.toLowerCase();

  inventarioFiltrado = inventarioGlobal;

  if (categoria !== "all") {
    inventarioFiltrado = inventarioFiltrado.filter(
      (item) => item.categoria === categoria
    );
  }

  if (busqueda) {
    inventarioFiltrado = inventarioFiltrado.filter((item) =>
      item.nombre.toLowerCase().includes(busqueda)
    );
  }

  paginaActual = 1; // Resetear a página 1 al filtrar
  renderTablaPaginada();
}

function renderTablaPaginada() {
  const totalPaginas = Math.ceil(
    inventarioFiltrado.length / productosPorPagina
  );
  if (paginaActual > totalPaginas) paginaActual = 1;

  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPaginados = inventarioFiltrado.slice(inicio, fin);

  renderTabla(productosPaginados);
  actualizarPaginacion(totalPaginas);
}

function calcularEstado(stock) {
  if (stock === 0) return "Agotado";
  if (stock <= 10) return "Stock Bajo";
  return "Disponible";
}

function renderTabla(productos) {
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";

  if (productos.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="7" class="text-center text-white">No hay productos que coincidan con la búsqueda o filtro.</td>`;
    tbody.appendChild(tr);
    actualizarPaginacion(0);
    return;
  }

  productos.forEach((p) => {
    const estadoBadge = `<span class="badge ${
      p.stock > 10
        ? "bg-success"
        : p.stock > 0
        ? "bg-warning text-dark"
        : "bg-danger"
    }">${p.estado}</span>`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>${p.stock}</td>
      <td>$${Number(p.precio).toLocaleString("es-CL")}</td>
      <td>${estadoBadge}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function actualizarPaginacion(totalPaginas) {
  const ul = document.querySelector(".pagination");
  ul.innerHTML = "";

  const crearLi = (page, text, disabled = false, active = false) => {
    const li = document.createElement("li");
    li.className = `page-item ${disabled ? "disabled" : ""} ${
      active ? "active" : ""
    }`;
    const a = document.createElement("a");
    a.className = "page-link";
    a.href = "#";
    a.textContent = text;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (!disabled && page !== paginaActual) {
        paginaActual = page;
        renderTablaPaginada();
      }
    });
    li.appendChild(a);
    return li;
  };

  // Botón anterior
  ul.appendChild(crearLi(paginaActual - 1, "«", paginaActual === 1));

  // Números de página
  for (let i = 1; i <= totalPaginas; i++) {
    ul.appendChild(crearLi(i, i, false, i === paginaActual));
  }

  // Botón siguiente
  ul.appendChild(
    crearLi(
      paginaActual + 1,
      "»",
      paginaActual === totalPaginas || totalPaginas === 0
    )
  );
}
