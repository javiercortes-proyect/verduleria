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
                    <p class="precio">$${p.precio.toLocaleString('es-CL')} ${p.unidad === 'un' ? '<small>/ un</small>' : ''}</p>
                    ${controles}
                    <button class="btn-agregar" onclick="agregar(${p.id})">Agregar al Carrito</button>
                </div>
            </div>
        `;
    }).join('');
}

window.agregar = function(id) {
    const p = productos.find(item => item.id === id);
    let cantidad = parseFloat(document.getElementById(`qty-${id}`)?.value || 1);
    let precioFinal = p.precio;
    let unidadFinal = p.unidad === 'un' ? 'un' : 'kg';

    if (p.unidad === 'especial') {
        const tipo = document.getElementById(`tipo-${id}`).value;
        if (tipo === 'saco') {
            precioFinal = p.precioSaco;
            unidadFinal = 'Saco';
        } else {
            precioFinal = p.precio;
            unidadFinal = 'kg';
        }
    }

    if (p && cantidad > 0) {
        const itemCarrito = {
            ...p,
            nombreUnidad: `${p.nombre} (${unidadFinal})`,
            cantidadElegida: cantidad,
            subtotal: Math.round(precioFinal * cantidad)
        };
        carrito.push(itemCarrito);
        actualizarVista();
    }
}

function actualizarVista() {
    const lista = document.getElementById('lista-carrito');
    const totalMsg = document.getElementById('carrito-total-precio');
    const contador = document.getElementById('contador-carrito');

    lista.innerHTML = carrito.map((p, i) => `
        <div class="item-carrito" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
            <div style="text-align: left;">
                <strong style="color:var(--oscuro);">${p.nombreUnidad}</strong><br>
                <small>${p.cantidadElegida} x $${(p.subtotal/p.cantidadElegida).toLocaleString('es-CL')}</small>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-weight:bold;">$${p.subtotal.toLocaleString('es-CL')}</span>
                <button onclick="borrar(${i})" style="border:none; background:none; cursor:pointer; font-size:1.2rem;">❌</button>
            </div>
        </div>
    `).join('');

    const suma = carrito.reduce((t, p) => t + p.subtotal, 0);
    totalMsg.innerText = `$${suma.toLocaleString('es-CL')}`;
    contador.innerText = carrito.length;
}

window.borrar = function(index) {
    carrito.splice(index, 1);
    actualizarVista();
}

document.getElementById('btn-pagar').addEventListener('click', () => {
    if (carrito.length === 0) return alert("Carrito vacío");
    const suma = carrito.reduce((t, p) => t + p.subtotal, 0);
    const detalle = carrito.map(p => `✅ ${p.nombreUnidad}: ${p.cantidadElegida} ($${p.subtotal.toLocaleString('es-CL')})`).join("%0A");
    const miNumero = "56963536651"; 
    const mensaje = `¡Hola Sra.Kathy! 🛒 Quiero hacer este pedido:%0A%0A${detalle}%0A%0A💰 *Total a pagar: $${suma.toLocaleString('es-CL')}*`;
    window.open(`https://wa.me/${miNumero}?text=${mensaje}`, '_blank');
});

document.getElementById('abrir-carrito').onclick = () => document.getElementById('carrito-lateral').classList.remove('oculto');
document.getElementById('btn-cerrar-carrito').onclick = () => document.getElementById('carrito-lateral').classList.add('oculto');
document.getElementById('btn-vaciar').onclick = () => { if(confirm("¿Seguro quieres vaciar el carrito?")) { carrito = []; actualizarVista(); } };

dibujarProductos();