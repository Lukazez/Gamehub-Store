// Cargar el carrito desde localStorage. Si no hay nada, inicia como un arreglo vacío [].
let carrito = JSON.parse(localStorage.getItem('gamehub_carrito')) || [];

const cuponesValidos = {
    "SETUP2026": 0.15,
    "DUOC10": 0.10
};

let descuentoActual = 0;

// Referencias al DOM
const contenedorProductos = document.getElementById('contenedor-productos-carrito');
const mensajeVacio = document.getElementById('mensaje-vacio');
const resumenCarrito = document.getElementById('resumen-carrito');
const txtSubtotal = document.getElementById('txt-subtotal');
const txtDescuento = document.getElementById('txt-descuento');
const txtTotal = document.getElementById('txt-total');
const inputCupon = document.getElementById('input-cupon');
const btnAplicarCupon = document.getElementById('btn-aplicar-cupon');
const mensajeCupon = document.getElementById('mensaje-cupon');
const btnVaciar = document.getElementById('btn-vaciar');
const contadorCarritoMenu = document.getElementById('contador-carrito'); // Para actualizar el número en el menú

function guardarEnLocal() {
    localStorage.setItem('gamehub_carrito', JSON.stringify(carrito));
}

function renderizarCarrito() {
    contenedorProductos.innerHTML = ''; 

    // Estado vacío explícito
    if (carrito.length === 0) {
        mensajeVacio.style.display = 'block';
        resumenCarrito.classList.add('oculto');
        if (contadorCarritoMenu) contadorCarritoMenu.textContent = "(0)";
        return;
    }

    mensajeVacio.style.display = 'none';
    resumenCarrito.classList.remove('oculto');

    let totalItems = 0;

    carrito.forEach((producto, index) => {
        totalItems += producto.cantidad;
        const articulo = document.createElement('article');
        articulo.classList.add('linea-carrito');

        const subtotalLinea = producto.precio * producto.cantidad;

        articulo.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="info-producto">
                <h3>${producto.nombre}</h3>
                <p>Precio Unitario: $${producto.precio.toLocaleString('es-CL')}</p>
            </div>
            <div class="control-cantidad">
                <label for="cant-${producto.id}">Cant:</label>
                <input type="number" id="cant-${producto.id}" value="${producto.cantidad}" min="1" max="${producto.stockMaximo}" onchange="actualizarCantidad(${index}, this.value)">
                <span class="stock-disponible">(Stock: ${producto.stockMaximo})</span>
            </div>
            <div class="subtotal-linea">
                <p>$${subtotalLinea.toLocaleString('es-CL')}</p>
            </div>
            <button class="boton-peligro btn-quitar" onclick="quitarProducto(${index})">X</button>
        `;
        contenedorProductos.appendChild(articulo);
    });

    if (contadorCarritoMenu) contadorCarritoMenu.textContent = `(${totalItems})`;
    calcularTotales();
}

// Validar y actualizar cantidad
window.actualizarCantidad = function(index, nuevaCantidad) {
    const cant = parseInt(nuevaCantidad);
    const producto = carrito[index];

    // La cantidad respeta el stock disponible
    if (cant > producto.stockMaximo) {
        alert(`No puedes agregar más de ${producto.stockMaximo} unidades de ${producto.nombre}.`);
        carrito[index].cantidad = producto.stockMaximo;
    } else if (cant < 1) {
        carrito[index].cantidad = 1;
    } else {
        carrito[index].cantidad = cant;
    }
    
    guardarEnLocal();
    renderizarCarrito();
};

window.quitarProducto = function(index) {
    carrito.splice(index, 1);
    guardarEnLocal();
    renderizarCarrito();
};

btnVaciar.addEventListener('click', () => {
    carrito = [];
    descuentoActual = 0;
    mensajeCupon.textContent = '';
    inputCupon.value = '';
    guardarEnLocal();
    renderizarCarrito();
});

btnAplicarCupon.addEventListener('click', () => {
    const codigo = inputCupon.value.trim().toUpperCase();
    
    if (cuponesValidos[codigo]) {
        descuentoActual = cuponesValidos[codigo];
        mensajeCupon.textContent = "¡Cupón aplicado exitosamente!";
        mensajeCupon.style.color = "var(--color-acento)"; 
    } else {
        descuentoActual = 0;
        mensajeCupon.textContent = "Cupón vencido o inexistente.";
        mensajeCupon.style.color = "var(--color-error)";
    }
    calcularTotales();
});

function calcularTotales() {
    let subtotal = 0;
    carrito.forEach(prod => {
        subtotal += (prod.precio * prod.cantidad);
    });

    let descuento = subtotal * descuentoActual;
    
    if (descuento > subtotal) {
        descuento = subtotal; 
    }

    const total = subtotal - descuento;

    txtSubtotal.textContent = subtotal.toLocaleString('es-CL');
    txtDescuento.textContent = descuento.toLocaleString('es-CL');
    txtTotal.textContent = total.toLocaleString('es-CL');
}

// Render inicial
renderizarCarrito();