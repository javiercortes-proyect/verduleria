// ===== CARRITO =====
let carrito = [];

// ===== ELEMENTOS =====
const panel     = document.getElementById('carrito-panel');
const overlay   = document.getElementById('carrito-overlay');
const lista     = document.getElementById('carrito-lista');
const contador  = document.getElementById('contador');
const total     = document.getElementById('carrito-total');
const btnCerrar = document.getElementById('carrito-cerrar');
const btnVaciar = document.getElementById('btn-vaciar');

// ===== ABRIR Y CERRAR PANEL =====
document.querySelector('.btn-carrito').addEventListener('click', abrirCarrito);
btnCerrar.addEventListener('click', cerrarCarrito);
overlay.addEventListener('click', cerrarCarrito);

function abrirCarrito() {
  panel.classList.add('abierto');
  overlay.classList.add('activo');
}

function cerrarCarrito() {
  panel.classList.remove('abierto');
  overlay.classList.remove('activo');
}

// ===== AGREGAR PRODUCTO =====
document.querySelectorAll('.btn-agregar').forEach(function(boton) {
  boton.addEventListener('click', function() {

    const tarjeta = boton.parentElement;
    const nombre  = tarjeta.querySelector('h3').textContent;
    const precio  = tarjeta.querySelector('.precio').textContent;

    carrito.push({ nombre, precio });

    actualizarCarrito();

    boton.textContent = '✅ Agregado';
    boton.style.backgroundColor = '#388e3c';

    setTimeout(function() {
      boton.textContent = '🛒 Agregar al carrito';
      boton.style.backgroundColor = '';
    }, 1500);

  });
});

// ===== ELIMINAR PRODUCTO =====
function eliminarProducto(indice) {
  carrito.splice(indice, 1);
  actualizarCarrito();
}

// ===== VACIAR CARRITO =====
btnVaciar.addEventListener('click', function() {
  carrito = [];
  actualizarCarrito();
});

// ===== ACTUALIZAR VISTA =====
function actualizarCarrito() {
  contador.textContent = carrito.length;
  total.textContent = carrito.length;

  if (carrito.length === 0) {
    lista.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
    return;
  }

  lista.innerHTML = carrito.map(function(producto, indice) {
    return `
      <div class="carrito-item">
        <div class="carrito-item-info">
          <span class="carrito-item-nombre">${producto.nombre}</span>
          <span class="carrito-item-precio">${producto.precio}</span>
        </div>
        <button class="carrito-item-eliminar" onclick="eliminarProducto(${indice})">🗑</button>
      </div>
    `;
  }).join('');
}