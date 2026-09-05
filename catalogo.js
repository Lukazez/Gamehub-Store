// Arreglo de datos simulado (Requisito EP1)
const baseProductos = [
    { id: 1, nombre: "Mouse Ajazz 139 Pro", categoria: "perifericos", marca: "ajazz", precio: 45000, stock: 5, imagen: "img/mouse-ajazz.webp" },
    { id: 2, nombre: "Pad Mouse ATK Sky XSoft", categoria: "perifericos", marca: "atk", precio: 32000, stock: 3, imagen: "img/Pad Mouse ATK Sky XSoft.webp" },
    { id: 3, nombre: "Monitor ASUS TUF 24\"", categoria: "monitores", marca: "asus", precio: 180000, stock: 0, imagen: "img/Monitor ASUS TUF 24.jpg" },
    { id: 4, nombre: "Teclado Ajazz AK820", categoria: "perifericos", marca: "ajazz", precio: 55000, stock: 10, imagen: "img/Teclado Ajazz AK820.avif" },
    { id: 5, nombre: "Tarjeta Gráfica ASUS RTX 4060", categoria: "componentes", marca: "asus", precio: 350000, stock: 2, imagen: "img/Tarjeta Gráfica ASUS RTX 4060.jpg" },
    { id: 6, nombre: "Mouse ATK Blazing Sky", categoria: "perifericos", marca: "atk", precio: 48000, stock: 7, imagen: "img/mouse-atk-blazing.jpg" }
];

let productosFiltrados = [...baseProductos];
let paginaActual = 1;
const productosPorPagina = 4; // Para la carga incremental

// Referencias al DOM
const grillaCatalogo = document.getElementById('grilla-catalogo');
const btnCargarMas = document.getElementById('btn-cargar-mas');
const btnAplicarFiltros = document.getElementById('btn-aplicar-filtros');
const errorPrecio = document.getElementById('error-precio');
const contadorCarrito = document.getElementById('contador-carrito');

// Inicializar el carrito desde localStorage para mantener sesión entre vistas
let carritoLocal = JSON.parse(localStorage.getItem('gamehub_carrito')) || [];
actualizarContadorCarrito();

function renderizarProductos() {
    grillaCatalogo.innerHTML = '';
    
    // Lógica de carga incremental (paginación)
    const productosAMostrar = productosFiltrados.slice(0, paginaActual * productosPorPagina);

    if (productosAMostrar.length === 0) {
        grillaCatalogo.innerHTML = '<p>No se encontraron productos con esos filtros.</p>';
        btnCargarMas.classList.add('oculto');
        return;
    }

    productosAMostrar.forEach(producto => {
        const articulo = document.createElement('article');
        articulo.classList.add('tarjeta-producto');
        
        // Validación: Deshabilitar botón si no hay stock
        const hayStock = producto.stock > 0;
        const claseBoton = hayStock ? 'boton-primario' : 'boton-deshabilitado';
        const textoBoton = hayStock ? 'Agregar al Carrito' : 'Sin Stock';
        const atributoDisabled = hayStock ? '' : 'disabled';

        articulo.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="info-tarjeta">
                <h3>${producto.nombre}</h3>
                <p class="precio">$${producto.precio.toLocaleString('es-CL')}</p>
                <p class="stock ${hayStock ? 'stock-ok' : 'stock-nulo'}">
                    ${hayStock ? `Stock: ${producto.stock} uds.` : 'Agotado'}
                </p>
                <button class="${claseBoton}" onclick="agregarAlCarrito(${producto.id})" ${atributoDisabled}>
                    ${textoBoton}
                </button>
            </div>
        `;
        grillaCatalogo.appendChild(articulo);
    });

    // Mostrar u ocultar botón de "Cargar más"
    if (productosFiltrados.length > productosAMostrar.length) {
        btnCargarMas.classList.remove('oculto');
    } else {
        btnCargarMas.classList.add('oculto');
    }
}

// Lógica de Ordenamiento y Filtros
btnAplicarFiltros.addEventListener('click', () => {
    const min = parseInt(document.getElementById('precio-min').value) || 0;
    const max = parseInt(document.getElementById('precio-max').value) || Infinity;
    const cat = document.getElementById('filtro-categoria').value;
    const marca = document.getElementById('filtro-marca').value;
    const orden = document.getElementById('ordenar-por').value;

    // Validación obligatoria: mínimo mayor que máximo
    if (max !== Infinity && min > max) {
        errorPrecio.classList.remove('oculto');
        return; 
    } else {
        errorPrecio.classList.add('oculto');
    }

    // Aplicar filtros
    productosFiltrados = baseProductos.filter(p => {
        const cumpleCategoria = (cat === 'todas' || p.categoria === cat);
        const cumpleMarca = (marca === 'todas' || p.marca === marca);
        const cumplePrecio = (p.precio >= min && p.precio <= max);
        return cumpleCategoria && cumpleMarca && cumplePrecio;
    });

    // Aplicar orden
    productosFiltrados.sort((a, b) => {
        if (orden === 'precio-asc') return a.precio - b.precio;
        if (orden === 'precio-desc') return b.precio - a.precio;
        if (orden === 'nombre-asc') return a.nombre.localeCompare(b.nombre);
        if (orden === 'nombre-desc') return b.nombre.localeCompare(a.nombre);
    });

    paginaActual = 1; // Reiniciar paginación al filtrar
    renderizarProductos();
});

// Paginación Incremental
btnCargarMas.addEventListener('click', () => {
    paginaActual++;
    renderizarProductos();
});

// Función para simular agregar al carrito
window.agregarAlCarrito = function(idProducto) {
    const producto = baseProductos.find(p => p.id === idProducto);
    const itemEnCarrito = carritoLocal.find(item => item.id === idProducto);

    if (itemEnCarrito) {
        if (itemEnCarrito.cantidad < producto.stock) {
            itemEnCarrito.cantidad++;
        } else {
            alert("No hay más stock disponible para este producto.");
            return;
        }
    } else {
        carritoLocal.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
            stockMaximo: producto.stock,
            imagen: producto.imagen
        });
    }

    localStorage.setItem('gamehub_carrito', JSON.stringify(carritoLocal));
    actualizarContadorCarrito();
    alert(`${producto.nombre} agregado al carrito.`);
};

function actualizarContadorCarrito() {
    const totalItems = carritoLocal.reduce((acc, item) => acc + item.cantidad, 0);
    contadorCarrito.textContent = `(${totalItems})`;
}

// Render inicial
renderizarProductos();