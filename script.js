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
        let paso = p.unidad === 'kg' ? 0.5 : 1;
        let selectorEspecial = p.unidad === 'especial' ? `
            <div class="selector-unidad">
                <input type="radio" name="tipo-${p.id}" id="kilo-${p.id}" value="kg" class="radio-unidad" checked>
                <label for="kilo-${p.id}" class="label-unidad">Kilo</label>
                <input type="radio" name="tipo-${p.id}" id="saco-${p.id}" value="saco" class="radio-unidad">
                <label for="saco-${p.id}" class="label-unidad">Saco</label>
            </div>` : "";

        return `
            <div class="producto-card">
                <img src="${p.img}" alt="${p.nombre}" class="producto-img">
                <h3>${p.nombre}</h3>
                <p class="precio">$${p.precio.toLocaleString('es-CL')}</p>
                ${selectorEspecial}
                <div class="wrapper-cantidad">
                    <button class="btn-qty" onclick="bajarQty(${p.id}, ${paso})">−</button>
                    <input type="number" class="input-cantidad-bonito" id="qty-${p.id}" value="1" step="${paso}" readonly>
                    <button class="btn-qty" onclick="subirQty(${p.id}, ${paso})">+</button>
                </div>
                <button class="btn-agregar" onclick="agregar(${p.id})">Agregar al Carrito</button>
            </div>`;
    }).join('');
}

window.subirQty = (id, paso) => { document.getElementById(`qty-${id}`).value = parseFloat(document.getElementById(`qty-${id}`).value) + paso; };
window.bajarQty = (id, paso) => { 
    let input = document.getElementById(`qty-${id}`);
    if (parseFloat(input.value) > paso) input.value = parseFloat(input.value) - paso;
};

function actualizarVista() {
    const lista = document.getElementById('lista-carrito');
    const totalMsg = document.getElementById('carrito-total-precio');
    const contador = document.getElementById('contador-carrito');

    lista.innerHTML = carrito.map((p, i) => `
        <div class="item-carrito">
            <strong>${p.nombre}</strong>
            <small>${p.cantidad} ${p.unidad} x $${p.precio.toLocaleString('es-CL')}</small>
            <span>$${p.subtotal.toLocaleString('es-CL')}</span>
            <button class="btn-eliminar-item" onclick="borrarUno(${i})">🗑️</button>
        </div>`).join('');

    const sumaTotal = carrito.reduce((t, p) => t + p.subtotal, 0);
    totalMsg.innerText = `$${sumaTotal.toLocaleString('es-CL')}`;
    contador.innerText = carrito.reduce((total, p) => total + p.cantidad, 0); 
}

window.agregar = function(id) {
    const p = productos.find(item => item.id === id);
    let cant = parseFloat(document.getElementById(`qty-${id}`).value);
    let unidadFinal = p.unidad === 'especial' ? (document.getElementById(`saco-${id}`).checked ? 'saco' : 'kg') : p.unidad;
    let nombreFinal = unidadFinal === 'saco' ? "Papa (Saco)" : (p.unidad === 'especial' ? "Papa (Kilo)" : p.nombre);
    let precioFinal = unidadFinal === 'saco' ? p.precioSaco : p.precio;

    const itemExistente = carrito.find(item => item.nombre === nombreFinal);
    if (itemExistente) {
        itemExistente.cantidad += cant;
        itemExistente.subtotal = itemExistente.cantidad * itemExistente.precio;
    } else {
        carrito.push({ nombre: nombreFinal, cantidad: cant, precio: precioFinal, subtotal: precioFinal * cant, unidad: unidadFinal });
    }
    actualizarVista();
    document.getElementById(`qty-${id}`).value = 1;
};

window.borrarUno = (index) => {
    carrito.splice(index, 1);
    actualizarVista();
};

document.getElementById('btn-pagar').onclick = () => {
    if (carrito.length === 0) return alert("Carrito vacío");
    let mensaje = "¡Hola! Mi pedido:\n\n";
    carrito.forEach(p => {
        let txtU = p.unidad === 'un' ? (p.cantidad === 1 ? "unidad" : "unidades") : (p.unidad === 'saco' ? (p.cantidad === 1 ? "saco" : "sacos") : p.unidad);
        mensaje += `• ${p.nombre}: ${p.cantidad} ${txtU} - $${p.subtotal.toLocaleString('es-CL')}\n`;
    });
    mensaje += `\n*Total: $${carrito.reduce((t, p) => t + p.subtotal, 0).toLocaleString('es-CL')}*`;
    window.open(`https://wa.me/56963536651?text=${encodeURIComponent(mensaje)}`, '_blank');
};

document.getElementById('btn-vaciar').onclick = () => { carrito = []; actualizarVista(); };
document.getElementById('abrir-carrito').onclick = () => document.getElementById('carrito-lateral').classList.remove('oculto');
document.getElementById('btn-cerrar-carrito').onclick = () => document.getElementById('carrito-lateral').classList.add('oculto');

dibujarProductos();
actualizarVista();