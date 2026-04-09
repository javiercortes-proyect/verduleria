// 1. LISTA DE PRODUCTOS (Basada exactamente en tu carpeta de imágenes)
const productos = [
    { id: 1, nombre: "Berenjena", precio: 1500, img: "imagenes/berenjena.jpg" },
    { id: 2, nombre: "Brócoli", precio: 1800, img: "imagenes/brocoli.jpg" },
    { id: 3, nombre: "Cebolla", precio: 800, img: "imagenes/cebolla.jpg" },
    { id: 4, nombre: "Papa", precio: 800, img: "imagenes/papa.jpg" },
    { id: 5, nombre: "Tomate", precio: 1200, img: "imagenes/tomate.jpg" },
    { id: 6, nombre: "Zanahoria", precio: 800, img: "imagenes/zanahoria.jpg" }
];

let carrito = [];

// 2. FUNCIÓN PARA DIBUJAR LAS TARJETAS
function dibujarProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;

    contenedor.innerHTML = productos.map(p => `
        <div class="producto-card">
            <img src="${p.img}" alt="${p.nombre}" class="producto-img">
            <div class="info-producto">
                <h3>${p.nombre}</h3>
                <p class="precio">$${p.precio.toLocaleString('es-CL')}</p>
                <button class="btn-agregar" onclick="agregar(${p.id})">Agregar al Carrito 🛒</button>
            </div>
        </div>
    `).join('');
}

// 3. CONTROL DEL CARRITO (ABRIR/CERRAR)
function toggleCarrito() {
    const carritoLateral = document.getElementById('carrito-lateral');
    if (carritoLateral) {
        carritoLateral.classList.toggle('oculto');
    }
}

// 4. AGREGAR AL CARRITO
window.agregar = function(id) {
    const p = productos.find(item => item.id === id);
    if (p) {
        carrito.push(p);
        actualizarVista();
    }
}

// 5. ACTUALIZAR VISTA DEL CARRITO
function actualizarVista() {
    const lista = document.getElementById('lista-carrito');
    const totalMsg = document.getElementById('carrito-total-precio');
    const contador = document.getElementById('contador-carrito');

    lista.innerHTML = carrito.map((p, i) => `
        <div class="item-carrito">
            <span>${p.nombre}</span>
            <span>$${p.precio.toLocaleString('es-CL')} 
            <button class="btn-borrar" onclick="borrar(${i})">❌</button></span>
        </div>
    `).join('');

    const suma = carrito.reduce((t, p) => t + p.precio, 0);
    totalMsg.innerText = `$${suma.toLocaleString('es-CL')}`;
    contador.innerText = carrito.length;
}

// 6. BORRAR PRODUCTO
window.borrar = function(index) {
    carrito.splice(index, 1);
    actualizarVista();
}

// 7. BOTÓN DE PAGO (WHATSAPP)
document.getElementById('btn-pagar').addEventListener('click', () => {
    if (carrito.length === 0) return alert("Tu carrito está vacío");

    const suma = carrito.reduce((t, p) => t + p.precio, 0);
    let detalle = carrito.map(p => `- ${p.nombre} ($${p.precio})`).join("%0A");
    
    // RECUERDA: Cambia el número por el tuyo real
    const miNumero = "56912345678"; 
    const mensaje = `Hola Javier! Quiero hacer un pedido:%0A${detalle}%0A%0A*Total: $${suma}*`;
    
    window.open(`https://wa.me/${miNumero}?text=${mensaje}`, '_blank');
});

// EVENTOS DE BOTONES
document.getElementById('abrir-carrito').onclick = toggleCarrito;
document.getElementById('btn-cerrar-carrito').onclick = toggleCarrito;
document.getElementById('btn-vaciar').onclick = () => {
    if (confirm("¿Vaciar todo?")) {
        carrito = [];
        actualizarVista();
    }
};

// INICIAR
dibujarProductos();