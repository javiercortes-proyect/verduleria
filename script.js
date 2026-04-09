const productos = [
    { id: 1, nombre: "Repollo", precio: 3000, img: "imagenes/repollo.jpg", unidad: 'un' },
    { id: 2, nombre: "Coliflor", precio: 2000, img: "imagenes/coliflor.jpg", unidad: 'un' },
    { id: 3, nombre: "Brócoli", precio: 1800, img: "imagenes/brocoli.jpg", unidad: 'un' },
    { id: 4, nombre: "Beterraga", precio: 1500, img: "imagenes/beterraga.jpg", unidad: 'kg' },
    { id: 5, nombre: "Ajíes", precio: 100, img: "imagenes/ajises.jpg", unidad: 'un' },
    { id: 6, nombre: "Zapallo", precio: 1000, img: "imagenes/zapallo.jpg", unidad: 'kg' },
    { id: 7, nombre: "Z. Italiano (3x1000)", precio: 333, img: "imagenes/zapallo-italiano.jpg", unidad: 'un' },
    { id: 8, nombre: "Pepinos", precio: 500, img: "imagenes/pepino.jpg", unidad: 'un' },
    { id: 9, nombre: "Ajo", precio: 300, precioSaco: 500, precioPromo: 1000, img: "imagenes/ajo.jpg", unidad: 'ajo-especial' },
    { id: 10, nombre: "Cebolla", precio: 800, img: "imagenes/cebolla.jpg", unidad: 'kg' },
    { id: 11, nombre: "Zanahoria", precio: 800, img: "imagenes/zanahoria.jpg", unidad: 'kg' },
    { id: 12, nombre: "Papa", precio: 800, precioSaco: 3500, img: "imagenes/papa.jpg", unidad: 'especial' },
    { id: 13, nombre: "Lechuga Escarola", precio: 1000, img: "imagenes/escarola.jpg", unidad: 'un' },
    { id: 14, nombre: "Lechuga Chilena", precio: 800, img: "imagenes/chilena.jpg", unidad: 'un' },
    { id: 15, nombre: "Lechuga Marina", precio: 600, img: "imagenes/marina.jpg", unidad: 'un' },
    { id: 16, nombre: "Lechuga Española", precio: 600, img: "imagenes/espanola.jpg", unidad: 'un' },
    { id: 17, nombre: "Lechuga Francesa", precio: 600, img: "imagenes/francesa.jpg", unidad: 'un' },
    { id: 18, nombre: "Lechuga Milanesa", precio: 600, img: "imagenes/milanesa.jpg", unidad: 'un' },
    { id: 19, nombre: "Acelga", precio: 500, img: "imagenes/acelga.jpg", unidad: 'un' },
    { id: 20, nombre: "Espinacas", precio: 1000, img: "imagenes/espinaca.jpg", unidad: 'un' },
    { id: 21, nombre: "Cilantro", precio: 800, img: "imagenes/cilantro.jpg", unidad: 'un' },
    { id: 22, nombre: "Choclo Americano (3x1000)", precio: 333, img: "imagenes/choclo.jpg", unidad: 'un' },
    { id: 23, nombre: "Bruselas (Malla)", precio: 1000, img: "imagenes/bruselas.jpg", unidad: 'un' },
    { id: 24, nombre: "Palta", precio: 3000, img: "imagenes/palta.jpg", unidad: 'kg' },
    { id: 25, nombre: "Limón", precio: 1500, img: "imagenes/limon.jpg", unidad: 'kg' },
    { id: 26, nombre: "Perejil", precio: 600, img: "imagenes/perejil.jpg", unidad: 'un' },
    { id: 27, nombre: "Pimentón Rojo", precio: 800, img: "imagenes/pimenton-rojo.jpg", unidad: 'un' },
    { id: 28, nombre: "Pimentón Verde", precio: 700, img: "imagenes/pimenton-verde.jpg", unidad: 'un' },
    { id: 29, nombre: "Morrones", precio: 500, img: "imagenes/pimenton.jpg", unidad: 'un' }
];

let carrito = [];

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
                    <label for="kilo-${p.id}" class="label-unidad">Kilo $800</label>
                    <input type="radio" name="tipo-${p.id}" id="saco-${p.id}" value="saco" class="radio-unidad">
                    <label for="saco-${p.id}" class="label-unidad">5kg x $3500</label>
                </div>`;
        } else if (p.unidad === 'ajo-especial') {
            selectorEspecial = `
                <div class="selector-unidad">
                    <input type="radio" name="tipo-${p.id}" id="u-${p.id}" value="u" class="radio-unidad" checked>
                    <label for="u-${p.id}" class="label-unidad">1x$300</label>
                    <input type="radio" name="tipo-${p.id}" id="p2-${p.id}" value="p2" class="radio-unidad">
                    <label for="p2-${p.id}" class="label-unidad">2x$500</label>
                    <input type="radio" name="tipo-${p.id}" id="p5-${p.id}" value="p5" class="radio-unidad">
                    <label for="p5-${p.id}" class="label-unidad">5x$1000</label>
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
    contador.innerText = carrito.length; 
}

window.agregar = function(id) {
    const p = productos.find(item => item.id === id);
    let cant = parseFloat(document.getElementById(`qty-${id}`).value);
    let nombreFinal = p.nombre;
    let precioFinal = p.precio;
    let unidadFinal = p.unidad;

    if (p.unidad === 'especial') {
        if (document.getElementById(`saco-${id}`).checked) {
            nombreFinal = "Papa (Promo 5kg)";
            precioFinal = p.precioSaco;
            unidadFinal = "promo";
        } else {
            nombreFinal = "Papa (Kilo)";
            precioFinal = p.precio;
            unidadFinal = "kg";
        }
    } else if (p.unidad === 'ajo-especial') {
        if (document.getElementById(`p2-${id}`).checked) {
            nombreFinal = "Ajo (Promo 2x500)";
            precioFinal = p.precioSaco; // 500
            unidadFinal = "promo";
        } else if (document.getElementById(`p5-${id}`).checked) {
            nombreFinal = "Ajo (Promo 5x1000)";
            precioFinal = p.precioPromo; // 1000
            unidadFinal = "promo";
        } else {
            nombreFinal = "Ajo (Unidad)";
            precioFinal = p.precio; // 300
            unidadFinal = "un";
        }
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
};

window.borrarUno = function(index) {
    const item = carrito[index];
    const paso = (item.unidad === 'kg' || item.nombre.includes("Kilo")) ? 0.5 : 1;
    if (item.cantidad > paso) {
        item.cantidad -= paso;
        item.subtotal = item.cantidad * item.precio;
    } else {
        carrito.splice(index, 1);
    }
    actualizarVista();
};

window.eliminarTotalmente = function(index) {
    carrito.splice(index, 1);
    actualizarVista();
};

document.getElementById('btn-pagar').onclick = () => {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }
    const telefono = "56963536651";
    let mensaje = "¡Hola Katherine! Me gustaría hacer un pedido:\n\n";
    carrito.forEach(p => {
        let txtU = p.unidad === 'kg' ? 'Kg' : (p.cantidad === 1 ? 'unidad' : 'unidades');
        if(p.unidad === 'promo') txtU = 'promo(s)';
        mensaje += `• ${p.nombre}: ${p.cantidad} ${txtU} - $${p.subtotal.toLocaleString('es-CL')}\n`;
    });
    const total = carrito.reduce((t, p) => t + p.subtotal, 0);
    mensaje += `\n*Total a pagar: $${total.toLocaleString('es-CL')}*`;
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
};

document.getElementById('btn-vaciar').onclick = () => { if(confirm("¿Vaciar carrito?")) { carrito = []; actualizarVista(); } };
document.getElementById('abrir-carrito').onclick = () => document.getElementById('carrito-lateral').classList.remove('oculto');
document.getElementById('btn-cerrar-carrito').onclick = () => document.getElementById('carrito-lateral').classList.add('oculto');

dibujarProductos();
actualizarVista();