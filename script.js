const productos = [
    { id: 1, nombre: "Berenjena", precio: 1500, img: "imagenes/berenjena.jpg", unidad: 'un' },
    { id: 2, nombre: "Brócoli", precio: 1800, img: "imagenes/brocoli.jpg", unidad: 'un' },
    { id: 3, nombre: "Cebolla", precio: 800, img: "imagenes/cebolla.jpg", unidad: 'kg' },
    { id: 4, nombre: "Papa", precio: 800, precioSaco: 15000, img: "imagenes/papa.jpg", unidad: 'especial' },
    { id: 5, nombre: "Tomate", precio: 1200, img: "imagenes/tomate.jpg", unidad: 'kg' },
    { id: 6, nombre: "Zanahoria", precio: 800, img: "imagenes/zanahoria.jpg", unidad: 'kg' }
];

let carrito = [];

// DIBUJAR PRODUCTOS EN LA TIENDA
function dibujarProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;
    
    contenedor.innerHTML = productos.map(p => {
        let paso = p.unidad === 'kg' ? 0.5 : 1;
        
        let selectorEspecial = "";
        if (p.unidad === 'especial') {
            selectorEspecial = `
                <div class="selector-unidad">
                    <input type="radio" name="tipo-${p.id}" id="kilo-${p.id}" value="kg" class="radio-unidad" checked>
                    <label for="kilo-${p.id}" class="label-unidad">Kilo</label>
                    <input type="radio" name="tipo-${p.id}" id="saco-${p.id}" value="saco" class="radio-unidad">
                    <label for="saco-${p.id}" class="label-unidad">Saco</label>
                </div>`;
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
                    <button class="btn-qty" onclick="subirQty(${p.id}, ${paso})">+</button>
                </div>
                <button class="btn-agregar" onclick="agregar(${p.id})">Agregar al Carrito</button>
            </div>`;
    }).join('');
}

// FUNCIONES PARA LOS BOTONES + Y -
window.subirQty = function(id, paso) {
    const input = document.getElementById(`qty-${id}`);
    input.value = parseFloat(input.value) + paso;
};

window.bajarQty = function(id, paso) {
    const input = document.getElementById(`qty-${id}`);
    if (parseFloat(input.value) > paso) {
        input.value = parseFloat(input.value) - paso;
    }
};

// ACTUALIZAR EL CARRITO Y EL CONTADOR
function actualizarVista() {
    const lista = document.getElementById('lista-carrito');
    const totalMsg = document.getElementById('carrito-total-precio');
    const contador = document.getElementById('contador-carrito');

    lista.innerHTML = carrito.map((p, i) => `
        <div class="item-carrito">
            <div>
                <strong>${p.nombre}</strong><br>
                <small>${p.cantidad} ${p.unidad} x $${p.precio.toLocaleString('es-CL')}</small>
            </div>
            <span>$${p.subtotal.toLocaleString('es-CL')}</span>
            <button onclick="borrarUno(${i})" style="background:none; border:none; cursor:pointer; color:red; margin-left:10px;">🗑️</button>
        </div>
    `).join('');

    const sumaTotal = carrito.reduce((t, p) => t + p.subtotal, 0);
    totalMsg.innerText = `$${sumaTotal.toLocaleString('es-CL')}`;
    contador.innerText = carrito.length; 
}

// AGREGAR AL CARRITO
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

// BORRAR ELEMENTO
window.borrarUno = (index) => {
    carrito.splice(index, 1);
    actualizarVista();
};

// ENVÍO A WHATSAPP CON LÓGICA DE PLURALES
document.getElementById('btn-pagar').onclick = () => {
    if (carrito.length === 0) return alert("El carrito está vacío");

    const telefono = "56963536651";
    let mensaje = "¡Hola! Me gustaría hacer un pedido:\n\n";
    
    carrito.forEach(p => {
        let txtU = p.unidad;
        // Ajuste de plurales solo para el mensaje de texto
        if (p.unidad === 'un') {
            txtU = (p.cantidad === 1 ? "unidad" : "unidades");
        } else if (p.unidad === 'saco') {
            txtU = (p.cantidad === 1 ? "saco" : "sacos");
        }
        
        mensaje += `• ${p.nombre}: ${p.cantidad} ${txtU} - $${p.subtotal.toLocaleString('es-CL')}\n`;
    });

    const total = carrito.reduce((t, p) => t + p.subtotal, 0);
    mensaje += `\n*Total a pagar: $${total.toLocaleString('es-CL')}*`;

    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
};

// BOTONES DEL CARRITO LATERAL
document.getElementById('btn-vaciar').onclick = () => { carrito = []; actualizarVista(); };
document.getElementById('abrir-carrito').onclick = () => document.getElementById('carrito-lateral').classList.remove('oculto');
document.getElementById('btn-cerrar-carrito').onclick = () => document.getElementById('carrito-lateral').classList.add('oculto');

// INICIALIZACIÓN
dibujarProductos();
actualizarVista();