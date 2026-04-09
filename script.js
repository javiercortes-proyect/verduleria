const productos = [
    { id: 1, nombre: "Berenjena", precio: 1500, img: "imagenes/berenjena.jpg", unidad: 'un' },
    { id: 2, nombre: "Brócoli", precio: 1800, img: "imagenes/brocoli.jpg", unidad: 'un' },
    { id: 3, nombre: "Cebolla", precio: 800, img: "imagenes/cebolla.jpg", unidad: 'kg' },
    { 
        id: 4, 
        nombre: "Papa", 
        precio: 800, 
        precioSaco: 15000, 
        img: "imagenes/papa.jpg", 
        unidad: 'especial' 
    },
    { id: 5, nombre: "Tomate", precio: 1200, img: "imagenes/tomate.jpg", unidad: 'kg' },
    { id: 6, nombre: "Zanahoria", precio: 800, img: "imagenes/zanahoria.jpg", unidad: 'un' }
];

let carrito = [];

function dibujarProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;
    
    contenedor.innerHTML = productos.map(p => {
        let controles = "";
        
        // Buscamos si ya hay algo de este producto en el carrito para mostrarlo
        const cantidadEnCarrito = carrito
            .filter(item => item.id === p.id)
            .reduce((total, item) => total + item.cantidadElegida, 0);

        const badge = cantidadEnCarrito > 0 
            ? `<div class="contador-item">Llevas: ${cantidadEnCarrito}</div>` 
            : `<div class="contador-item oculto"></div>`;

        if (p.unidad === 'kg') {
            controles = `
                <div class="contenedor-controles">
                    <label>Cantidad:</label>
                    <input type="number" class="selector-cantidad" id="qty-${p.id}" value="1" min="0.5" step="0.5"> <span>Kg</span>
                </div>`;
        } else if (p.unidad === 'especial') { 
            controles = `
                <div class="contenedor-controles">
                    <select class="selector-tipo" id="tipo-${p.id}">
                        <option value="kg">Por Kilo ($800)</option>
                        <option value="saco">Saco ($15.000)</option>
                    </select>
                    <input type="number" class="selector-cantidad" id="qty-${p.id}" value="1" min="1">
                </div>`;
        }

        return `
            <div class="producto-card">
                <img src="${p.img}" alt="${p.nombre}" class="producto-img">
                <div class="info-producto">
                    <h3>${p.nombre}</h3>
                    <p class="precio">$${p.precio.toLocaleString('es-CL')} ${p.unidad === 'un' ? '<small>/ unidad</small>' : ''}</p>
                    ${badge}
                    ${controles}
                    <button class="btn-agregar" onclick="agregar(${p.id})">Agregar al Carrito</button>
                </div>
            </div>
        `;
    }).join('');
}

window.agregar = function(id) {
    const p = productos.find(item => item.id === id);
    let cantidadInput = parseFloat(document.getElementById(`qty-${id}`)?.value || 1);
    let precioFinal = p.precio;
    let unidadBase = p.unidad;

    if (p.unidad === 'especial') {
        const tipo = document.getElementById(`tipo-${id}`).value;
        if (tipo === 'saco') {
            precioFinal = p.precioSaco;
            unidadBase = 'saco';
        } else {
            precioFinal = p.precio;
            unidadBase = 'kg';
        }
    }

    const itemExistente = carrito.find(item => item.id === id && item.unidadBase === unidadBase);

    if (itemExistente) {
        itemExistente.cantidadElegida += cantidadInput;
        itemExistente.subtotal = Math.round(itemExistente.cantidadElegida * precioFinal);
    } else {
        carrito.push({
            id: p.id,
            nombreBase: p.nombre,
            unidadBase: unidadBase,
            cantidadElegida: cantidadInput,
            precioUnitario: precioFinal,
            subtotal: Math.round(cantidadInput * precioFinal)
        });
    }
    actualizarVista();
    dibujarProductos(); // Redibujamos para que aparezca el "Llevas: X" en la tarjeta
}

function actualizarVista() {
    const lista = document.getElementById('lista-carrito');
    const totalMsg = document.getElementById('carrito-total-precio');
    const contador = document.getElementById('contador-carrito');

    lista.innerHTML = carrito.map((p, i) => {
        let textoUnidad = p.unidadBase;
        if(p.unidadBase === 'un') {
            textoUnidad = p.cantidadElegida === 1 ? 'unidad' : 'unidades';
        }

        return `
            <div class="item-carrito" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                <div style="text-align: left;">
                    <strong style="color:var(--oscuro);">${p.nombreBase}</strong><br>
                    <small>${p.cantidadElegida} ${textoUnidad} x $${p.precioUnitario.toLocaleString('es-CL')}</small>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-weight:bold;">$${p.subtotal.toLocaleString('es-CL')}</span>
                    <button onclick="borrar(${i})" style="border:none; background:none; cursor:pointer; font-size:1.2rem;">❌</button>
                </div>
            </div>
        `;
    }).join('');

    const suma = carrito.reduce((t, p) => t + p.subtotal, 0);
    totalMsg.innerText = `$${suma.toLocaleString('es-CL')}`;
    contador.innerText = carrito.length;
}

window.borrar = function(index) {
    carrito.splice(index, 1);
    actualizarVista();
    dibujarProductos(); // Actualiza las tarjetas al borrar
}

document.getElementById('btn-pagar').addEventListener('click', () => {
    if (carrito.length === 0) return alert("Carrito vacío");
    const suma = carrito.reduce((t, p) => t + p.subtotal, 0);
    
    const detalle = carrito.map(p => {
        let etiquetaUnidad = p.unidadBase;
        if(p.unidadBase === 'un') {
            etiquetaUnidad = p.cantidadElegida === 1 ? 'unidad' : 'unidades';
        }
        return `${p.nombreBase}: ${p.cantidadElegida} ${etiquetaUnidad} ($${p.subtotal.toLocaleString('es-CL')})`;
    }).join("%0A");
    
    const miNumero = "56963536651"; 
    const mensaje = `¡Hola Sra. Kathy! Quiero hacer este pedido:%0A%0A${detalle}%0A%0A*Total a pagar: $${suma.toLocaleString('es-CL')}*`;
    
    window.open(`https://wa.me/${miNumero}?text=${mensaje}`, '_blank');
});

document.getElementById('abrir-carrito').onclick = () => document.getElementById('carrito-lateral').classList.remove('oculto');
document.getElementById('btn-cerrar-carrito').onclick = () => document.getElementById('carrito-lateral').classList.add('oculto');
document.getElementById('btn-vaciar').onclick = () => { if(confirm("¿Seguro quieres vaciar el carrito?")) { carrito = []; actualizarVista(); dibujarProductos(); } };

dibujarProductos();