const productos = [
    { id: 1, nombre: "Berenjena", precio: 1500, img: "imagenes/berenjena.jpg" },
    { id: 2, nombre: "Brócoli", precio: 1800, img: "imagenes/brocoli.jpg" },
    { id: 3, nombre: "Cebolla", precio: 800, img: "imagenes/cebolla.jpg" },
    { id: 4, nombre: "Papa", precio: 800, img: "imagenes/papa.jpg" },
    { id: 5, nombre: "Tomate", precio: 1200, img: "imagenes/tomate.jpg" },
    { id: 6, nombre: "Zanahoria", precio: 800, img: "imagenes/zanahoria.jpg" }
];

let carrito = [];

function dibujarProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;
    contenedor.innerHTML = productos.map(p => `
        <div class="producto-card">
            <img src="${p.img}" alt="${p.nombre}" class="producto-img">
            <div class="info-producto">
                <h3>${p.nombre}</h3>
                <p class="precio">$${p.precio.toLocaleString('es-CL')}</p>
                <button class="btn-agregar" onclick="agregar(${p.id})">Agregar al Carrito</button>
            </div>
        </div>
    `).join('');
}

window.agregar = function(id) {
    const p = productos.find(item => item.id === id);
    if (p) {
        carrito.push(p);
        actualizarVista();
    }
}

function actualizarVista() {
    const lista = document.getElementById('lista-carrito');
    const totalMsg = document.getElementById('carrito-total-precio');
    const contador = document.getElementById('contador-carrito');

    lista.innerHTML = carrito.map((p, i) => `
        <div class="item-carrito">
            <span>${p.nombre}</span>
            <span>$${p.precio} <button onclick="borrar(${i})">❌</button></span>
        </div>
    `).join('');

    const suma = carrito.reduce((t, p) => t + p.precio, 0);
    totalMsg.innerText = `$${suma.toLocaleString('es-CL')}`;
    contador.innerText = carrito.length;
}

window.borrar = function(index) {
    carrito.splice(index, 1);
    actualizarVista();
}

document.getElementById('btn-pagar').addEventListener('click', () => {
    if (carrito.length === 0) return alert("Carrito vacío");
    const suma = carrito.reduce((t, p) => t + p.precio, 0);
    const detalle = carrito.map(p => `- ${p.nombre} ($${p.precio})`).join("%0A");
    const miNumero = "56963536651"; 
    const mensaje = `Hola Sra.Kathy! Quiero hacer un pedido:%0A${detalle}%0A%0A*Total: $${suma}*`;
    window.open(`https://wa.me/${miNumero}?text=${mensaje}`, '_blank');
});

document.getElementById('abrir-carrito').onclick = () => document.getElementById('carrito-lateral').classList.remove('oculto');
document.getElementById('btn-cerrar-carrito').onclick = () => document.getElementById('carrito-lateral').classList.add('oculto');
document.getElementById('btn-vaciar').onclick = () => { carrito = []; actualizarVista(); };

dibujarProductos();