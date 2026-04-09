const productos = [
    { id: 1, nombre: "Berenjena", precio: 1500, img: "imagenes/berenjena.jpg", unidad: 'un' },
    { id: 2, nombre: "Brócoli", precio: 1800, img: "imagenes/brocoli.jpg", unidad: 'un' },
    { id: 3, nombre: "Cebolla", precio: 800, img: "imagenes/cebolla.jpg", unidad: 'kg' },
    { id: 4, nombre: "Papa", precio: 800, precioSaco: 15000, img: "imagenes/papa.jpg", unidad: 'especial' },
    { id: 5, nombre: "Tomate", precio: 1200, img: "imagenes/tomate.jpg", unidad: 'kg' },
    { id: 6, nombre: "Zanahoria", precio: 800, img: "imagenes/zanahoria.jpg", unidad: 'kg' }
];

let carrito = [];

// --- DIBUJAR PRODUCTOS ---
function dibujarProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;
    
    contenedor.innerHTML = productos.map(p => {
        let unidadTexto = p.unidad === 'kg' ? 'Kg' : 'Un';
        let paso = p.unidad === 'kg' ? 0.5 : 1;
        
        let selectorEspecial = "";
        if (p.unidad === 'especial') {
            selectorEspecial = `
                <div class="selector-unidad">
                    <input type="radio" name="tipo-${p.id}" id="kilo-${p.id}" value="kg" class="radio-unidad" checked onclick="document.getElementById('unidad-${p.id}').innerText='Kg'">
                    <label for="kilo-${p.id}" class="label-unidad">Kilo</label>
                    <input type="radio" name="tipo-${p.id}" id="saco-${p.id}" value="saco" class="radio-unidad" onclick="document.getElementById('unidad-${p.id}').innerText='Saco'">
                    <label for="saco-${p.id}" class="label-unidad">Saco</label>
                </div>`;
            unidadTexto = 'Kg';
        }

        return `
            <div class="producto-card">
                <img src="${p.img}" alt="${p.nombre}" class="producto-img">
                <h3>${p.nombre}</h3>
                <p class="precio">$${p.precio.toLocaleString('es-CL')}</p>
                ${selectorEspecial}
                <div class="wrapper-cantidad">
                    <button class="btn-qty" onclick="bajarQty(${p.id}, ${paso})">−</button>
                    <input type="number" class="input-cantidad-bonito" id="qty-${p.id}" value="1" step="${paso}" readonly>
                    <span class="texto-unidad" id="unidad-${p.id}">${unidadTexto}</span>
                    <button class="btn-qty" onclick="subirQty(${p.id}, ${paso})">+</button>
                </div>
                <button class="btn-agregar" onclick="agregar(${p.id})">Agregar al Carrito</button>
            </div>`;
    }).join('');
}

// --- BOTONES DE CANTIDAD EN TARJETAS ---
window.subirQty = function(id, paso) {
    const input = document.getElementById(`qty-${id}`);
    input.value = (parseFloat(input.value) + paso).toFixed(1).replace('.0', '');
};

window.bajarQty = function(id, paso) {
    const input = document.getElementById(`qty-${id}`);
    if (parseFloat(input.value) > paso) {
        input.value = (parseFloat(input.value) - paso).toFixed(1).replace('.0', '');
    }
};

// --- ACTUALIZAR VISTA DEL CARRITO ---
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
            <button class="btn-eliminar-item" onclick="eliminarTotalmente(${i})">🗑️</button>
        </div>
    `).join('');

    const sumaTotal = carrito.reduce((t, p) => t + p.subtotal, 0);
    totalMsg.innerText = `$${sumaTotal.toLocaleString('es-CL')}`;
    
    // El contador muestra cuántos tipos de productos hay
    contador.innerText = carrito.length; 
}

// --- AGREGAR AL CARRITO ---
window.agregar = function(id) {
    const p = productos.find(item => item.id === id);
    let cant = parseFloat(document.getElementById(`qty-${id}`).value);
    let nombreFinal = p.nombre;
    let precioFinal = p.precio;
    let unidadFinal = p.unidad === 'especial' ? (document.getElementById(`saco-${id}`).checked ? 'saco' : 'kg') : p.unidad;

    if (p.unidad === 'especial' && unidadFinal === 'saco') {
        nombreFinal = "Papa (Saco)";
        precioFinal = p.precioSaco;
    } else if (p.unidad === 'especial') {
        nombreFinal = "Papa (Kilo)";
    }

    const itemExistente = carrito.find(item => item.nombre === nombreFinal);
    if (itemExistente) {
        itemExistente.cantidad += cant;
        itemExistente.subtotal = itemExistente.cantidad * itemExistente.precio;
    } else {
        carrito.push({ id: p.id, nombre: nombreFinal, cantidad: cant, precio: precioFinal, subtotal: precioFinal * cant, unidad: unidadFinal });
    }
    actualizarVista();
    document.getElementById(`qty-${id}`).value = 1;
    // Resetear texto de unidad si era papa
    if(p.id === 4) document.getElementById(`unidad-${p.id}`).innerText = 'Kg';
};

// --- BORRAR UNO POR UNO ---
window.borrarUno = function(index) {
    const item = carrito[index];
    const paso = (item.unidad === 'kg' || (item.nombre.includes("Kilo"))) ? 0.5 : 1;
    
    if (item.cantidad > paso) {
        item.cantidad -= paso;
        item.subtotal = item.cantidad * item.precio;
    } else {
        carrito.splice(index, 1);
    }
    actualizarVista();
};

// --- ELIMINAR PRODUCTO COMPLETO ---
window.eliminarTotalmente = function(index) {
    carrito.splice(index, 1);
    actualizarVista();
};

// --- ENVÍO A WHATSAPP ---
document.getElementById('btn-pagar').onclick = () => {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    const telefono = "56963536651";
    let mensaje = "¡Hola Katherine! Me gustaría hacer un pedido:\n\n";
    
    carrito.forEach(p => {
        let textoUnidadFinal = p.unidad;

        if (p.unidad === 'un') {
            textoUnidadFinal = (p.cantidad === 1) ? "unidad" : "unidades";
        } else if (p.unidad === 'saco') {
            textoUnidadFinal = (p.cantidad === 1) ? "saco" : "sacos";
        } else if (p.unidad === 'kg') {
            textoUnidadFinal = "Kg";
        }

        mensaje += `• ${p.nombre}: ${p.cantidad} ${textoUnidadFinal} - $${p.subtotal.toLocaleString('es-CL')}\n`;
    });

    const total = carrito.reduce((t, p) => t + p.subtotal, 0);
    mensaje += `\n*Total a pagar: $${total.toLocaleString('es-CL')}*`;

    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
};

// --- CONTROLES CARRITO LATERAL ---
document.getElementById('btn-vaciar').onclick = () => { 
    if(confirm("¿Estás seguro de vaciar el carrito?")) {
        carrito = []; 
        actualizarVista(); 
    }
};

document.getElementById('abrir-carrito').onclick = () => document.getElementById('carrito-lateral').classList.remove('oculto');
document.getElementById('btn-cerrar-carrito').onclick = () => document.getElementById('carrito-lateral').classList.add('oculto');

// --- INICIO ---
dibujarProductos();
actualizarVista();