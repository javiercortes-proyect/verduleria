// 1. BASE DE DATOS DE PRODUCTOS (Agregamos la unidad: 'kg' o 'un')
const productos = [
    { id: 1, nombre: "Berenjena", precio: 1500, img: "imagenes/berenjena.jpg", unidad: 'un' },
    { id: 2, nombre: "Brócoli", precio: 1800, img: "imagenes/brocoli.jpg", unidad: 'un' },
    { id: 3, nombre: "Cebolla", precio: 800, img: "imagenes/cebolla.jpg", unidad: 'kg' },
    { id: 4, nombre: "Papa", precio: 800, img: "imagenes/papa.jpg", unidad: 'kg' },
    { id: 5, nombre: "Tomate", precio: 1200, img: "imagenes/tomate.jpg", unidad: 'kg' },
    { id: 6, nombre: "Zanahoria", precio: 800, img: "imagenes/zanahoria.jpg", unidad: 'un' }
];

let carrito = [];

// 2. DIBUJAR PRODUCTOS EN LA PÁGINA
function dibujarProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;
    
    contenedor.innerHTML = productos.map(p => {
        // Si el producto es por kilo, mostramos un input de número, si no, solo el botón
        const controlCantidad = p.unidad === 'kg' 
            ? `<div class="selector-peso">
                <input type="number" id="qty-${p.id}" value="1" min="0.5" step="0.5"> <span>Kg</span>
               </div>`
            : "";

        return `
            <div class="producto-card">
                <img src="${p.img}" alt="${p.nombre}" class="producto-img">
                <div class="info-producto">
                    <h3>${p.nombre}</h3>
                    <p class="precio">$${p.precio.toLocaleString('es-CL')} / ${p.unidad}</p>
                    ${controlCantidad}
                    <button class="btn-agregar" onclick="agregar(${p.id})">Agregar al Carrito</button>
                </div>
            </div>
        `;
    }).join('');
}

// 3. AGREGAR AL CARRITO (Manejando pesos y unidades)
window.agregar = function(id) {
    const p = productos.find(item => item.id === id);
    let cantidad = 1;

    // Si el producto tiene selector de peso, tomamos ese valor
    const inputPeso = document.getElementById(`qty-${id}`);
    if (inputPeso) {
        cantidad = parseFloat(inputPeso.value);
    }

    if (p && cantidad > 0) {
        // Creamos una copia del producto con la cantidad/peso elegida
        const itemCarrito = {
            ...p,
            cantidadElegida: cantidad,
            subtotal: Math.round(p.precio * cantidad)
        };
        carrito.push(itemCarrito);
        actualizarVista();
        
        // Opcional: Feedback visual al agregar
        alert(`${p.nombre} (${cantidad} ${p.unidad}) agregado.`);
    }
}

// 4. ACTUALIZAR LA VISTA DEL CARRITO
function actualizarVista() {
    const lista = document.getElementById('lista-carrito');
    const totalMsg = document.getElementById('carrito-total-precio');
    const contador = document.getElementById('contador-carrito');

    lista.innerHTML = carrito.map((p, i) => `
        <div class="item-carrito" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #eee;">
            <div style="text-align: left;">
                <span style="display: block; font-weight: bold;">${p.nombre}</span>
                <small>${p.cantidadElegida} ${p.unidad} x $${p.precio}</small>
            </div>
            <span>$${p.subtotal.toLocaleString('es-CL')} <button onclick="borrar(${i})" style="border:none; background:none; cursor:pointer;">❌</button></span>
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

// 5. BOTÓN DE PAGO (WhatsApp con detalle de kilos)
document.getElementById('btn-pagar').addEventListener('click', () => {
    if (carrito.length === 0) return alert("El carrito está vacío");
    
    const suma = carrito.reduce((t, p) => t + p.subtotal, 0);
    const detalle = carrito.map(p => `• ${p.nombre}: ${p.cantidadElegida}${p.unidad} ($${p.subtotal})`).join("%0A");
    
    const miNumero = "56963536651"; 
    const mensaje = `¡Hola Javier! Quiero hacer un pedido:%0A${detalle}%0A%0A*Total a pagar: $${suma.toLocaleString('es-CL')}*`;
    
    window.open(`https://wa.me/${miNumero}?text=${mensaje}`, '_blank');
});

// 6. EVENTOS DE INTERFAZ
document.getElementById('abrir-carrito').onclick = () => document.getElementById('carrito-lateral').classList.remove('oculto');
document.getElementById('btn-cerrar-carrito').onclick = () => document.getElementById('carrito-lateral').classList.add('oculto');
document.getElementById('btn-vaciar').onclick = () => { if(confirm("¿Vaciar carrito?")) { carrito = []; actualizarVista(); } };

// Inicializar
dibujarProductos();