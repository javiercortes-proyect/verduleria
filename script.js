const productos = [
    { id: 1, nombre: "Berenjena", precio: 1500, img: "imagenes/berenjena.jpg", unidad: 'un' },
    { id: 2, nombre: "Brócoli", precio: 1800, img: "imagenes/brocoli.jpg", unidad: 'un' },
    { id: 3, nombre: "Cebolla", precio: 800, img: "imagenes/cebolla.jpg", unidad: 'kg' },
    { id: 4, nombre: "Papa", precio: 800, precioSaco: 15000, img: "imagenes/papa.jpg", unidad: 'especial' },
    { id: 5, nombre: "Tomate", precio: 1200, img: "imagenes/tomate.jpg", unidad: 'kg' },
    { id: 6, nombre: "Zanahoria", precio: 800, img: "imagenes/zanahoria.jpg", unidad: 'un' }
];

let carrito = [];

function dibujarProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;
    
    contenedor.innerHTML = productos.map(p => {
        let controles = `<input type="number" class="selector-cantidad" id="qty-${p.id}" value="1" min="1">`;
        if (p.unidad === 'kg') {
            controles = `<div style="color:white; margin-bottom:10px;"><input type="number" class="selector-cantidad" id="qty-${p.id}" value="1" min="0.5" step="0.5"> Kg</div>`;
        }

        return `
            <div class="producto-card">
                <img src="${p.img}" alt="${p.nombre}" class="producto-img">
                <h3>${p.nombre}</h3>
                <p class="precio">$${p.precio.toLocaleString('es-CL')}</p>
                ${controles}
                <button class="btn-agregar" onclick="agregar(${p.id})">Agregar al Carrito</button>
            </div>`;
    }).join('');
}

function actualizarVista() {
    const lista = document.getElementById('lista-carrito');
    const totalMsg = document.getElementById('carrito-total-precio');
    const contador = document.getElementById('contador-carrito');

    lista.innerHTML = carrito.map((p, i) => `
        <div class="item-carrito">
            <strong>${p.nombre}</strong>
            <div class="controles-item-carrito">
                <button class="btn-menos" onclick="borrar(${i})">-</button>
                <small>${p.cantidad} ${p.unidad === 'kg' ? 'Kg' : 'un'} x $${p.precio.toLocaleString('es-CL')}</small>
            </div>
            <span>$${p.subtotal.toLocaleString('es-CL')}</span>
            <button class="btn-eliminar-item" onclick="eliminarFila(${i})">🗑️</button>
        </div>
    `).join('');

    const suma = carrito.reduce((t, p) => t + p.subtotal, 0);
    totalMsg.innerText = `$${suma.toLocaleString('es-CL')}`;
    contador.innerText = carrito.length;
}

window.agregar = function(id) {
    const p = productos.find(item => item.id === id);
    const cant = parseFloat(document.getElementById(`qty-${id}`).value);
    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.cantidad += cant;
        itemExistente.subtotal = itemExistente.cantidad * itemExistente.precio;
    } else {
        carrito.push({
            id: p.id,
            nombre: p.nombre,
            cantidad: cant,
            precio: p.precio,
            subtotal: p.precio * cant,
            unidad: p.unidad
        });
    }
    actualizarVista();
};

// NUEVA FUNCIÓN: Borra 1x1 (o 0.5 si es kilo)
window.borrar = function(index) {
    const item = carrito[index];
    const paso = item.unidad === 'kg' ? 0.5 : 1;

    if (item.cantidad > paso) {
        item.cantidad -= paso;
        item.subtotal = item.cantidad * item.precio;
    } else {
        carrito.splice(index, 1);
    }
    actualizarVista();
};

// Para eliminar el producto completo de una vez
window.eliminarFila = function(index) {
    carrito.splice(index, 1);
    actualizarVista();
};

document.getElementById('btn-vaciar').onclick = () => {
    carrito = [];
    actualizarVista();
};

document.getElementById('abrir-carrito').onclick = () => document.getElementById('carrito-lateral').classList.remove('oculto');
document.getElementById('btn-cerrar-carrito').onclick = () => document.getElementById('carrito-lateral').classList.add('oculto');

dibujarProductos();
actualizarVista();