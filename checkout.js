// ------- Datos simulados: regiones y comunas -------
// Se usan para poblar los selects y para validar la coherencia región/comuna.
const regionesComunas = {
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Concón"],
    "Metropolitana de Santiago": ["Santiago", "Providencia", "Las Condes", "Maipú"],
    "Biobío": ["Concepción", "Talcahuano", "Los Ángeles"]
};

// ------- Estado: carrito y cupón guardados desde la vista Carrito -------
const carrito = JSON.parse(localStorage.getItem('gamehub_carrito')) || [];
const cuponGuardado = JSON.parse(localStorage.getItem('gamehub_cupon')) || null;

// ------- Referencias al DOM -------
const avisoCarritoVacio = document.getElementById('aviso-carrito-vacio');
const contenidoCheckout = document.getElementById('contenido-checkout');
const confirmacionOrden = document.getElementById('confirmacion-orden');
const formCheckout = document.getElementById('form-checkout');

const selectRegion = document.getElementById('input-region');
const selectComuna = document.getElementById('input-comuna');

const lineasResumen = document.getElementById('lineas-resumen-checkout');
const txtSubtotal = document.getElementById('checkout-subtotal');
const txtDescuento = document.getElementById('checkout-descuento');
const txtTotal = document.getElementById('checkout-total');

const contadorCarritoMenu = document.getElementById('contador-carrito');
if (contadorCarritoMenu) {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contadorCarritoMenu.textContent = `(${totalItems})`;
}

// ------- Validación obligatoria: no se avanza con el carrito vacío -------
if (carrito.length === 0) {
    avisoCarritoVacio.classList.remove('oculto');
    contenidoCheckout.classList.add('oculto');
} else {
    inicializarCheckout();
}

function inicializarCheckout() {
    poblarRegiones();
    renderizarResumen();

    formCheckout.addEventListener('submit', manejarEnvio);

    // Validación en vivo al salir de cada campo (mejor experiencia que solo validar al enviar)
    ['input-nombre', 'input-correo', 'input-telefono', 'input-direccion'].forEach(id => {
        document.getElementById(id).addEventListener('blur', () => validarCampo(id));
    });

    selectRegion.addEventListener('change', () => {
        actualizarComunas();
        validarCampo('input-region');
    });
    selectComuna.addEventListener('change', () => validarCampo('input-comuna'));

    document.querySelectorAll('input[name="pago"]').forEach(radio => {
        radio.addEventListener('change', validarMetodoPago);
    });
}

// ------- Resumen de la orden (solo lectura, con el mismo cálculo que el carrito) -------
function renderizarResumen() {
    lineasResumen.innerHTML = '';
    let subtotal = 0;

    carrito.forEach(producto => {
        const subtotalLinea = producto.precio * producto.cantidad;
        subtotal += subtotalLinea;

        const linea = document.createElement('p');
        linea.classList.add('linea-resumen');
        linea.textContent = `${producto.nombre} x${producto.cantidad} — $${subtotalLinea.toLocaleString('es-CL')}`;
        lineasResumen.appendChild(linea);
    });

    const descuento = cuponGuardado ? Math.min(subtotal * cuponGuardado.descuento, subtotal) : 0;
    const total = subtotal - descuento;

    txtSubtotal.textContent = subtotal.toLocaleString('es-CL');
    txtDescuento.textContent = descuento.toLocaleString('es-CL');
    txtTotal.textContent = total.toLocaleString('es-CL');
}

// ------- Región -> Comuna (cascada) -------
function poblarRegiones() {
    Object.keys(regionesComunas).forEach(region => {
        const opcion = document.createElement('option');
        opcion.value = region;
        opcion.textContent = region;
        selectRegion.appendChild(opcion);
    });
}

function actualizarComunas() {
    const region = selectRegion.value;
    selectComuna.innerHTML = '';

    if (!region) {
        selectComuna.disabled = true;
        selectComuna.innerHTML = '<option value="">Primero selecciona una región</option>';
        return;
    }

    selectComuna.disabled = false;
    selectComuna.innerHTML = '<option value="">Selecciona una comuna</option>';
    regionesComunas[region].forEach(comuna => {
        const opcion = document.createElement('option');
        opcion.value = comuna;
        opcion.textContent = comuna;
        selectComuna.appendChild(opcion);
    });
}

// ------- Validaciones por campo -------
// Cada validador recibe el valor actual y responde si es válido.
// "input-comuna" además verifica coherencia: la comuna debe pertenecer a la región elegida.
const validadores = {
    'input-nombre': valor => valor.trim().length >= 3,
    'input-correo': valor => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim()),
    'input-telefono': valor => /^\d{9}$/.test(valor.trim()),
    'input-region': valor => valor !== '',
    'input-comuna': valor => {
        const region = selectRegion.value;
        return valor !== '' && !!region && regionesComunas[region].includes(valor);
    },
    'input-direccion': valor => valor.trim().length >= 5
};

function validarCampo(id) {
    const campo = document.getElementById(id);
    const idError = 'error-' + id.replace('input-', '');
    const error = document.getElementById(idError);
    const valido = validadores[id](campo.value);

    if (valido) {
        error.classList.add('oculto');
        campo.classList.remove('campo-invalido');
    } else {
        error.classList.remove('oculto');
        campo.classList.add('campo-invalido');
    }
    return valido;
}

function validarMetodoPago() {
    const seleccionado = document.querySelector('input[name="pago"]:checked');
    const error = document.getElementById('error-pago');
    if (seleccionado) {
        error.classList.add('oculto');
        return true;
    }
    error.classList.remove('oculto');
    return false;
}

// ------- Envío del formulario -------
function manejarEnvio(evento) {
    evento.preventDefault();

    const camposAValidar = ['input-nombre', 'input-correo', 'input-telefono', 'input-region', 'input-comuna', 'input-direccion'];
    const resultados = camposAValidar.map(validarCampo);
    const pagoValido = validarMetodoPago();

    const todoValido = resultados.every(valido => valido) && pagoValido;

    // El envío se bloquea mientras existan errores
    if (!todoValido) {
        return;
    }

    confirmarOrden();
}

// ------- Confirmación simulada de la orden (EP1: sin backend real) -------
function confirmarOrden() {
    const numeroOrden = 'GH-' + Date.now().toString().slice(-6);
    const correoIngresado = document.getElementById('input-correo').value.trim();

    document.getElementById('numero-orden').textContent = numeroOrden;
    document.getElementById('correo-confirmacion').textContent = correoIngresado;

    contenidoCheckout.classList.add('oculto');
    confirmacionOrden.classList.remove('oculto');

    // Se vacía el carrito simulado tras confirmar la compra
    localStorage.removeItem('gamehub_carrito');
    localStorage.removeItem('gamehub_cupon');
    if (contadorCarritoMenu) contadorCarritoMenu.textContent = '(0)';
}
