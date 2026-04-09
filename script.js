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
        let controles = `<input type="number" class="selector-cantidad" id="qty-${p.id}" value="1" min="1" style="width: 60px; padding: 5px; margin-bottom: 10px;">`;
        if (p.unidad === 'kg') {
            controles = `<div><input type="number" class="selector-cantidad" id="qty-${p.id}" value="1" min="0.5" step="0.5" style="width: 60px; padding: 5px;"> Kg</div>`;
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
        <div style="border-bottom: 1px solid #eee; padding: 10px;">
            <strong>${p.nombre}</strong><br>
            ${p.cantidad} x $${p.precio} = $${p.subtotal.toLocaleString('es-CL')}
            <button onclick="borrar(${i})" style="color: red; border: none; background: none; cursor: pointer; margin-left: 10px;">🗑️</button>
        </div>
    `).join('');

    const suma = carrito.reduce((t, p) => t + p.subtotal, 0);
    totalMsg.innerText = `$${suma.toLocaleString('es-CL')}`;
    contador.innerText = carrito.length;
}

window.agregar = function(id) {
    const p = productos.find(item => item.id === id);
    const cant = parseFloat(document.getElementById(`qty-${id}`).value);
    carrito.push({
        nombre: p.nombre,
        cantidad: cant,
        precio: p.precio,
        subtotal: p.precio * cant
    });
    actualizarVista();
};

window.borrar = function(index) {
    carrito.splice(index, 1);
    actualizarVista();
};

document.getElementById('abrir-carrito').onclick = () => document.getElementById('carrito-lateral').classList.remove('oculto');
document.getElementById('btn-cerrar-carrito').onclick = () => document.getElementById('carrito-lateral').classList.add('oculto');

dibujarProductos();
actualizarVista();