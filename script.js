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

    // --- AJUSTES DE LIMPIEZA SIN BORRAR LOS PRODUCTOS ---
    
    // 1. Título principal arriba
    const h1 = document.querySelector('h1');
    if (h1) h1.innerText = "Frutas y Verduras Frescas";

    // 2. Título de la sección de productos (ahora Katherine Campos)
    // Buscamos el H2 que está DENTRO de la sección de productos
    const sectionProductos = document.getElementById('productos') || document.querySelector('.productos');
    if (sectionProductos) {
        const h2 = sectionProductos.querySelector('h2');
        if (h2) {
            h2.innerText = "Katherine Campos";
            h2.style.textAlign = "center";
            h2.style.color = "white";
        }
        // Borrar solo el texto "Selecciona lo que necesites..."
        const p = sectionProductos.querySelector('p');
        if (p && p.innerText.includes("Selecciona")) p.remove();
    }

    // 3. Borrar CUALQUIER OTRA sección que diga "Nuestras Verduras" al final
    document.querySelectorAll('h2').forEach(titulo => {
        if (titulo.innerText.includes("Nuestras Verduras") && titulo.parentElement.id !== 'productos') {
            titulo.parentElement.remove(); 
        }
    });

    // 4. Centrar Contacto Directo
    const contacto = document.getElementById('contacto') || document.querySelector('section#contacto');
    if (contacto) {
        contacto.style.cssText = "text-align: center; display: flex; flex-direction: column; align-items: center; background-color: white; color: black; padding: 40px 0;";
    }

    // 5. Pie de página
    const footer = document.querySelector('footer');
    if (footer) {
        footer.style.backgroundColor = "white";
        footer.style.color = "black";
        const pFooter = footer.querySelector('p');
        if (pFooter) pFooter.innerText = "© 2026 La Verdurería";
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