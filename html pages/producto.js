document.addEventListener("DOMContentLoaded", () => {
  actualizarBadgeCarrito();
});


const btnAgregar = document.getElementById("btn-agregar-carrito");
 btnAgregar.addEventListener("click", () => {
    const nombre = document.querySelector(".highlight").innerText;
    const precio = parseFloat(document.querySelector(".price").innerText.replace("$","").replace(".",""));
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const imagen = document.querySelector(".col-md-6 img").src;
    const descripcion = document.querySelector(".desc").innerText;

    const producto = { nombre, precio, cantidad, imagen, descripcion };

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const indexExistente = carrito.findIndex(item => item.nombre === nombre);
    if(indexExistente !== -1){
    carrito[indexExistente].cantidad += cantidad;
    } else {
    carrito.push({ nombre, precio, cantidad, imagen });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarBadgeCarrito();
    alert(`Se agregó ${cantidad} "${nombre}" al carrito ✅`);
});


function actualizarBadgeCarrito() {
  const badge = document.getElementById("cantidad-carrito");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  badge.innerText = totalCantidad;
}
