// busqueda.js
(() => {
  let allProducts = [];
  const EXCEL_URL = "../data/lista_productos.xlsx";

  function normalize(str) {
    return str
      ? str
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      : "";
  }

  async function loadProducts() {
    if (allProducts.length > 0) return allProducts;
    try {
      const res = await fetch(EXCEL_URL);
      const ab = await res.arrayBuffer();
      const wb = XLSX.read(new Uint8Array(ab), { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      allProducts = XLSX.utils.sheet_to_json(ws, { defval: "" });
      return allProducts;
    } catch (err) {
      console.error("Error cargando productos:", err);
      return [];
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const form = document.querySelector(".search-bar");
    if (!form) return;

    const input = form.querySelector("input[type=search]");
    const suggestionsBox = document.createElement("ul");
    suggestionsBox.className = "list-group position-absolute w-100 mt-1 shadow";
    suggestionsBox.style.zIndex = "2000";
    suggestionsBox.style.maxHeight = "300px";
    suggestionsBox.style.overflowY = "auto";
    suggestionsBox.style.display = "none";
    form.appendChild(suggestionsBox);

    let currentIndex = -1;

    const products = await loadProducts();

    input.addEventListener("input", () => {
      const query = normalize(input.value.trim());
      suggestionsBox.innerHTML = "";
      currentIndex = -1;

      if (!query) {
        suggestionsBox.style.display = "none";
        return;
      }

      const matches = products.filter((p) =>
        normalize(p.nombre_producto || p.nombre).includes(query)
      );

      if (matches.length === 0) {
        suggestionsBox.style.display = "none";
        return;
      }

      suggestionsBox.style.display = "block";
      matches.slice(0, 10).forEach((p, i) => {
        const li = document.createElement("li");
        li.className = "list-group-item list-group-item-action";
        li.textContent = p.nombre_producto || p.nombre;
        li.dataset.id = p.id;

        li.addEventListener("click", () => {
          window.location.href = `producto.html?id=${encodeURIComponent(
            String(p.id).trim()
          )}`;
        });

        suggestionsBox.appendChild(li);
      });
    });

    input.addEventListener("keydown", (e) => {
      const items = [...suggestionsBox.querySelectorAll("li")];
      if (items.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % items.length;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + items.length) % items.length;
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentIndex >= 0 && items[currentIndex]) {
          items[currentIndex].click();
          return;
        }
        form.dispatchEvent(new Event("submit"));
      }

      items.forEach((item, i) =>
        item.classList.toggle("active", i === currentIndex)
      );
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = normalize(input.value.trim());
      if (!query) return;

      const matches = products.filter((p) =>
        normalize(p.nombre_producto || p.nombre).includes(query)
      );

      if (matches.length === 1) {
        window.location.href = `producto.html?id=${encodeURIComponent(
          String(matches[0].id).trim()
        )}`;
      } else {
        window.location.href = `productos.html?busqueda=${encodeURIComponent(
          query
        )}`;
      }
    });
  });
})();
