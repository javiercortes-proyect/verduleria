const productos = [
    { id: 1, nombre: "Berenjena", precio: 1500, img: "imagenes/berenjena.jpg", unidad: 'un' },
    { id: 2, nombre: "Brócoli", precio: 1800, img: "imagenes/brocoli.jpg", unidad: 'un' },
    { id: 3, nombre: "Cebolla", precio: 800, img: "imagenes/cebolla.jpg", unidad: 'kg' },
    { id: 4, nombre: "Papa", precio: 800, precioSaco: 15000, img: "imagenes/papa.jpg", unidad: 'especial' },
    { id: 5, nombre: "Tomate", precio: 1200, img: "imagenes/tomate.jpg", unidad: 'kg' },
    { id: 6, nombre: "Zanahoria", precio: 800, img: "imagenes/zanahoria.jpg", unidad: 'kg' }
];

let carrito = [];

function dibujarProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;
    
    contenedor.innerHTML = productos.map(p => {
        let controles = "";
        if (p.unidad === 'especial') {
            controles = `
                <div class="selector-unidad">
                    <input type="radio" name="tipo-${p.id}" id="kilo-${p.id}" value="kg" class="radio-unidad" checked>
                    <label for="kilo-${p.id}" class="label-unidad">Por Kilo</label>
                    <input type="radio" name="tipo-${p.id}" id="saco-${p.id}" value="saco" class="radio-unidad">
                    <label for="saco-${p.id}" class="label-unidad">Por Saco</label>
                </div>
                <div class="control-cantidad-wrapper">
                    <input type="number" class="selector-cantidad" id="qty-${p.id}" value="1" min="1">
                </div>`;
        } else if (p.unidad === 'kg') {
            controles = `
                <div class="control-cantidad-wrapper">
                    <input type="number" class="selector-cantidad" id="qty-${p.id}" value="1" min="0.5" step="0.5"> Kg
                </div>`;
        } else {
            controles = `
                <div class="control-cantidad-wrapper">
                    <input type="number" class="selector-cantidad" id="qty-${p.id}" value="1" min="1"> Un
                </div>`;
        }

        return `
            <div class="producto-card">
                <img src="${p.img}" alt="${p.nombre}" class="producto-img">
                <h3>${p.nombre}</h3>
                <p class="precio">$${p.precio.toLocaleString('es-CL')}${p.unidad === 'kg' ? ' /kg' : ''}</p>
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
                <button class="btn-menos" onclick="borrarUno(${i})">-</button>
                <small>${p.cantidad} ${p.unidad} x $${p.precio.toLocaleString('es-CL')}</small>
            </div>
            <span>$${p.subtotal.toLocaleString('es-CL')}</span>
            <button class="btn-eliminar-item" onclick="borrarUno(${i})">🗑️</button>
        </div>
    `).join('');

    const sumaTotal = carrito.reduce((t, p) => t + p.subtotal, 0);
    totalMsg.innerText = `$${sumaTotal.toLocaleString('es-CL')}`;

    // NUEVA LÓGICA DEL CONTADOR: Suma todas las cantidades individuales
    // El número que aparece arriba del carro reflejará el total real de artículos.
    const cantidadTotalArticulos = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    contador.innerText = cantidadTotalArticulos; 
}

window.agregar = function(id) {
    const p = productos.find(item => item.id === id);
    let cant = parseFloat(document.getElementById(`qty-${id}`).value);
    let nombreFinal = p.nombre;
    let precioFinal = p.precio;
    let unidadFinal = p.unidad;

    if (p.unidad === 'especial') {
        const esSaco = document.getElementById(`saco-${id}`).checked;
        if (esSaco) {
            nombreFinal = "Papa (Saco)";
            precioFinal = p.precioSaco;
            unidadFinal = "saco";
        } else {
            nombreFinal = "Papa (Kilo)";
            unidadFinal = "kg";
        }
    }

    const itemExistente = carrito.find(item => item.nombre === nombreFinal);

    if (itemExistente) {
        itemExistente.cantidad += cant;
        itemExistente.subtotal = itemExistente.cantidad * itemExistente.precio;
    } else {
        carrito.push({
            id: p.id,
            nombre: nombreFinal,
            cantidad: cant,
            precio: precioFinal,
            subtotal: precioFinal * cant,
            unidad: unidadFinal
        });
    }
    actualizarVista();
};

window.borrarUno = function(index) {
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

document.getElementById('btn-vaciar').onclick = () => { carrito = []; actualizarVista(); };
document.getElementById('abrir-carrito').onclick = () => document.getElementById('carrito-lateral').classList.remove('oculto');
document.getElementById('btn-cerrar-carrito').onclick = () => document.getElementById('carrito-lateral').classList.add('oculto');

dibujarProductos();
actualizarVista();