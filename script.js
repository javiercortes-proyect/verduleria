// ===== CARRITO =====
let carrito = [];

// ===== BOTONES AGREGAR =====
const botonesAgregar = document.querySelectorAll('.btn-agregar');

botonesAgregar.forEach(function(boton) {
  boton.addEventListener('click', function() {

    const tarjeta = boton.parentElement;
    const nombre  = tarjeta.querySelector('h3').textContent;
    const precio  = tarjeta.querySelector('.precio').textContent;

    carrito.push({ nombre: nombre, precio: precio });

    actualizarContador();

    boton.textContent = '✅ Agregado';
    boton.style.backgroundColor = '#388e3c';

    setTimeout(function() {
      boton.textContent = '🛒 Agregar al carrito';
      boton.style.backgroundColor = '';
    }, 1500);

  });
});

// ===== ACTUALIZAR CONTADOR =====
function actualizarContador() {
  document.getElementById('contador').textContent = carrito.length;
}

// ===== VER CARRITO =====
document.querySelector('.btn-carrito').addEventListener('click', function() {

  if (carrito.length === 0) {
    alert('Tu carrito está vacío 🛒');
    return;
  }

  let mensaje = '🛒 Tu carrito:\n\n';

  carrito.forEach(function(producto, indice) {
    mensaje += (indice + 1) + '. ' + producto.nombre + ' — ' + producto.precio + '\n';
  });

  mensaje += '\nTotal de productos: ' + carrito.length;

  alert(mensaje);

});