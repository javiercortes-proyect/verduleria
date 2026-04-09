// ==========================================
// SCRIPT COMPLETO - COPIAR Y PEGAR TODO
// ==========================================

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
        let controles = "";
        const cantidadEnCarrito = carrito.filter(item => item.id === p.id).reduce((total, item) => total + item.cantidadElegida, 0);
        const badge = cantidadEnCarrito > 0 ? `<div class="contador-item">Llevas: ${cantidadEnCarrito}</div>` : "";

        if (p.unidad === 'kg') {
            controles = `<div class="contenedor-controles"><input type="number" class="selector-cantidad" id="qty-${p.id}" value="1" min="0.5" step="0.5"> <span>Kg</span></div>`;
        } else if (p.unidad === 'especial') { 
            controles = `<div class="contenedor-controles"><select class="selector-tipo" id="tipo-${p.id}"><option value="kg">Por Kilo ($800)</option><option value="saco">Saco ($15.000)</option></select><input type="number" class="selector-cantidad" id="qty-${p.id}" value="1" min="1"></div>`;
        }

        return `<div class="producto-card">
            <img src="${p.img}" alt="${p.nombre}" class="producto-img">
            <div class="info-producto">
                <h3>${p.nombre}</h3>
                <p class="precio">$${p.precio.toLocaleString('es-CL')} ${p.unidad === 'un' ? '<small>/ unidad</small>' : ''}</p>
                ${badge}
                ${controles}
                <button class="btn-agregar" onclick="agregar(${p.id})">Agregar al Carrito</button>
            </div>
        </div>`;
    }).join('');
}

window.agregar = function(id) {
    const p = productos.find(item => item.id === id);
    let cantidadInput = parseFloat(document.getElementById(`qty-${id}`)?.value || 1);
    let precioFinal = p.precio;
    let unidadBase = p.unidad;

    if (p.unidad === 'especial') {
        const tipo = document.getElementById(`tipo-${id}`).value;
        if (tipo === 'saco') { precioFinal = p.precioSaco; unidadBase = 'saco'; }
        else { precioFinal = p.precio; unidadBase = 'kg'; }
    }

    const itemExistente = carrito.find(item => item.id === id && item.unidadBase === unidadBase);
    if (itemExistente) {
        itemExistente.cantidadElegida += cantidadInput;
        itemExistente.subtotal = Math.round(itemExistente.cantidadElegida * precioFinal);
    } else {
        carrito.push({ id: p.id, nombreBase: p.nombre, unidadBase: unidadBase, cantidadElegida: cantidadInput, precioUnitario: precioFinal, subtotal: Math.round(cantidadInput * precioFinal) });
    }
    actualizarVista();
    dibujarProductos();
}

function actualizarVista() {
    const lista = document.getElementById('lista-carrito');
    const totalMsg = document.getElementById('carrito-total-precio');
    const contador = document.getElementById('contador-carrito');

    if (lista) {
        lista.innerHTML = carrito.map((p, i) => {
            let textoUnidad = p.unidadBase === 'un' ? (p.cantidadElegida === 1 ? 'unidad' : 'unidades') : p.unidadBase;
            return `<div class="item-carrito">
                <strong>${p.nombreBase}</strong>
                <small>${p.cantidadElegida} ${textoUnidad} x $${p.precioUnitario.toLocaleString('es-CL')}</small>
                <span>$${p.subtotal.toLocaleString('es-CL')}</span>
                <button class="btn-eliminar-item" onclick="borrar(${i})">🗑️</button>
            </div>`;
        }).join('');
    }

    const suma = carrito.reduce((t, p) => t + p.subtotal, 0);
    if (totalMsg) totalMsg.innerText = `$${suma.toLocaleString('es-CL')}`;
    if (contador) contador.innerText = carrito.length;

    // --- ELIMINAR SECCIÓN "NUESTRAS VERDURAS" Y LIMPIAR FONDO ---
    
    // 1. Borrar título y subtítulo que marcaste
    const titulosABorrar = document.querySelectorAll('h2');
    titulosABorrar.forEach(h2 => {
        if(h2.innerText.includes("Nuestras Verduras")) h2.remove();
    });

    const parrafosABorrar = document.querySelectorAll('p');
    parrafosABorrar.forEach(p => {
        if(p.innerText.includes("Selecciona lo que necesites")) p.remove();
    });

    // 2. Eliminar toda la sección verde sobrante al final
    const secciones = document.querySelectorAll('section');
    secciones.forEach(sec => {
        // Si la sección está después del contacto o contiene el catálogo duplicado, se elimina
        if(sec.id === 'productos' || sec.classList.contains('productos')) {
            sec.remove();
        }
    });

    // 3. Asegurar que el Contacto esté centrado y sin fondo verde debajo
    const contacto = document.getElementById('contacto') || document.querySelector('section#contacto');
    if (contacto) {
        contacto.style.cssText = "text-align: center; display: flex; flex-direction: column; align-items: center; background-color: white; color: black; padding: 40px 0; width: 100%; margin: 0;";
    }

    // 4. Pie de página en blanco
    const footer = document.querySelector('footer');
    if (footer) {
        footer.style.backgroundColor = "white";
        footer.style.color = "black";
        footer.style.borderTop = "1px solid #eee";
        const p = footer.querySelector('p');
        if (p) p.innerText = "© 2026 La Verdurería";
    }
}

window.borrar = function(index) {
    const producto = carrito[index];
    if (producto.cantidadElegida > 1) {
        if (producto.unidadBase === 'un' || producto.unidadBase === 'saco') {
            producto.cantidadElegida -= 1;
        } else {
            producto.cantidadElegida = Math.max(0, producto.cantidadElegida - 1);
        }
        if (producto.cantidadElegida === 0) { carrito.splice(index, 1); }
        else { producto.subtotal = Math.round(producto.cantidadElegida * producto.precioUnitario); }
    } else {
        carrito.splice(index, 1);
    }
    actualizarVista();
    dibujarProductos();
}

document.getElementById('btn-pagar').onclick = () => {
    if (carrito.length === 0) return alert("Su carrito se encuentra vacío.");
    if (confirm("¿Desea enviar su pedido por WhatsApp?")) {
        const suma = carrito.reduce((t, p) => t + p.subtotal, 0);
        const detalle = carrito.map(p => {
            let etiqueta = p.unidadBase === 'un' ? (p.cantidadElegida === 1 ? 'unidad' : 'unidades') : p.unidadBase;
            return `${p.nombreBase}: ${p.cantidadElegida} ${etiqueta} ($${p.subtotal.toLocaleString('es-CL')})`;
        }).join("%0A");
        window.open(`https://wa.me/56963536651?text=Hola Sra. Kathy! Quisiera este pedido:%0A%0A${detalle}%0A%0A*Total: $${suma.toLocaleString('es-CL')}*`, '_blank');
    }
};

document.getElementById('abrir-carrito').onclick = () => document.getElementById('carrito-lateral').classList.remove('oculto');
document.getElementById('btn-cerrar-carrito').onclick = () => document.getElementById('carrito-lateral').classList.add('oculto');
document.getElementById('btn-vaciar').onclick = () => { if(confirm("¿Vaciar todo el carrito?")) { carrito = []; actualizarVista(); dibujarProductos(); } };

// INICIO
dibujarProductos();
actualizarVista();