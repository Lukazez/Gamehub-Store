# Documento ERS - Versión 1
## GameHub Store - Frontend

### Integrantes
- [Nombre Integrante 1]
- [Nombre Integrante 2]
- [Nombre Integrante 3] (opcional, si aplica)

### Requisitos Funcionales
1. **Visualización del Catálogo**
   - Mostrar lista de productos con imagen, nombre, precio y stock.
   - Permitir filtrado por categoría, marca y rango de precio.
   - Ordenar productos por nombre (A-Z/Z-A) y precio (ascendente/descendente).
   - Carga incremental de productos ("Cargar más").

2. **Gestión del Carrito de Compras**
   - Agregar productos al carrito desde el catálogo.
   - Modificar cantidad de productos en el carrito (con límites de stock).
   - Eliminar productos del carrito.
   - Vaciar carrito completo.
   - Mostrar resumen con subtotal, descuento y total.
   - Aplicar cupones de descuento válidos (ej. SETUP2026, DUOC10).
   - Persistir estado del carrito entre vistas usando `localStorage`.

3. **Proceso de Checkout**
   - Validar que el carrito no esté vacío antes de proceder.
   - Recopilar datos de despacho: nombre, correo, teléfono, región, comuna, dirección.
   - Seleccionar método de pago (tarjeta, transferencia, contraentrega).
   - Validar todos los campos en el cliente antes del envío.
   - Mostrar resumen de la orden con descuento aplicado.
   - Simular confirmación de compra y generar número de orden.
   - Vaciar carrito tras compra exitosa.

4. **Historial de Órdenes**
   - Mostrar lista de órdenes realizadas (número, fecha, total, estado).
   - Permitir volver al catálogo para nuevas compras.

5. **Navegación y Diseño Consistente**
   - Menú de navegación común en todas las páginas (Inicio, Catálogo, Carrito, Checkout, Mis Órdenes).
   - Footer informativo con copyright y contacto.
   - Diseño responsivo que se adapta a móvil y escritorio.

### Requisitos No Funcionales
1. **Compatibilidad**
   - Compatibilidad con navegadores modernos: Chrome, Firefox, Safari, Edge (últimas versiones).
   - Soporte para dispositivos móviles y tablets (diseño responsivo).

2. **Usabilidad y Accesibilidad**
   - Interfaz intuitiva con retroalimentación visual (hover, focus, estados de carga).
   - Mensajes de error claros y asociados a los campos correspondientes.
   - Uso de atributos `label for`, `aria-label` y texto oculto para lectores de pantalla donde sea necesario.
   - Contraste de colores adecuado según normas WCAG AA.

3. **Rendimiento**
   - Carga eficiente de recursos (CSS, JS, imágenes optimizadas).
   - Minimizar manipulaciones del DOM innecesarias.
   - Uso de `localStorage` para persistencia ligera del estado del carrito.

4. **Mantenibilidad y Calidad de Código**
   - Código JavaScript modular y legible.
   - Uso de variables CSS para facilitar cambios de tema.
   - Comentarios explicativos en funciones críticas.
   - Estructura de carpetas organizada.

5. **Seguridad (Frontend)**
   - No almacenar datos sensibles (tokens, contraseñas) en `localStorage`.
   - Validación de entrada en el cliente para prevenir datos malformados.
   - Las contraseñas y autenticación se manejarán en EP3 mediante JWT en el backend.

### Herramientas Seleccionadas
- **HTML5**: Estructura semántica y accesible.
- **CSS3**: Estilos con variables, Flexbox, Grid, transiciones y media queries.
- **JavaScript (Vanilla)**: Lógica de interacción, manipulación del DOM, validación de formularios y gestión de estado.
- **localStorage**: Persistencia del carrito y cupones entre vistas y recargas.
- **Git**: Control de versiones con commits descriptivos y ramas por integrante o funcionalidad.

### Propuesta de Solución

#### Arquitectura de Carpetas
```
/Gamehub-Store
│
├── index.html          # Página de inicio
├── catalogo.html       # Vista de catálogo de productos
├── carrito.html        # Vista del carrito de compras
├── checkout.html       # Vista de checkout y pago
├── ordenes.html        # Vista de historial de órdenes
├── style.css           # Hoja de estilos compartida
│
├── catalogo.js         # Lógica del catálogo (datos, filtros, renderizado)
├── carrito.js          # Lógica del carrito (agregar, quitar, actualizar, cupones)
├── checkout.js         # Lógica del checkout (validación, envío, confirmación)
│
└── images/             # Carpeta de imágenes de productos
    ├── mouse-ajazz.jpg
    ├── Pad Mouse ATK Sky XSoft.jpg
    ├── Monitor ASUS TUF 24.jpg
    ├── Teclado Ajazz AK820.avif
    ├── Tarjeta Gráfica ASUS RTX 4060.jpg
    └── mouse-atk-blazing.jpg
```

#### Flujo de Datos
1. **Carga Inicial**
   - Al abrir `index.html`, se carga `style.css` y se renderiza el contenido estático.
   - El carrito se inicializa leyendo `localStorage.getItem('gamehub_carrito')` o un arreglo vacío.

2. **Navegación entre Vistas**
   - Al cambiar de página (ej. ir al catálogo), el nuevo HTML se carga y su script asociado se ejecuta.
   - Cada script lee el estado necesario de `localStorage` (carrito, cupon) para mantener coherencia.
   - El contador del carrito en el `<nav>` se actualiza en cada vista leyendo `localStorage`.

3. **Interacción con el Catálogo**
   - `catalogo.js` contiene un arreglo `baseProductos` con los datos simulados.
   - Los filtros y ordenamiento generan un nuevo arreglo `productosFiltrados`.
   - Los productos se renderizan creando elementos `<article>` con clases CSS y eventos `onclick` que llaman a `agregarAlCarrito(id)`.
   - `agregarAlCarrito` busca el producto en `baseProductos`, lo agrega o incrementa su cantidad en `carritoLocal` (arreglo en memoria), lo guarda en `localStorage` y actualiza el contador del nav.

4. **Gestión del Carrito**
   - `carrito.js` lee el carrito de `localStorage` al cargar.
   - Las funciones `actualizarCantidad` y `quitarProducto` modifican el arreglo `carrito`, lo guardan en `localStorage` y llaman a `renderizarCarrito` para actualizar la UI.
   - El cupón se aplica mediante un input y botón; el código descuento se guarda en `localStorage` como `gamehub_cupon` para que el checkout lo lea.
   - Los totales se recalculan en cada cambio (cantidad, cupón) y se muestran en el resumen.

5. **Proceso de Checkout**
   - `checkout.js` verifica si el carrito está vacío; si lo está, muestra un aviso y bloquea el contenido.
   - Si hay productos, inicializa los selects de región/comuna y adjunta eventos de validación.
   - Al enviar el formulario, se validan todos los campos (nombre, email, teléfono, región, comuna, dirección, método de pago).
   - Si todo es válido, se simula la confirmación: se genera un número de orden, se muestra una sección de éxito y se vacían `gamehub_carrito` y `gamehub_cupon` en `localStorage`.

6. **Historial de Órdenes**
   - `ordenes.html` lee un arreglo simulado de órdenes desde `localStorage` (clave `gamehub_ordenes`).
   - En EP1 este arreglo está vacío o con datos de ejemplo; en EP3 se podrá llenar con respuestas del backend.
   - Se renderiza una tabla con las órdenes existentes o un mensaje de vacío.

#### Cómo se Mantiene el Estado del Carrito
- El carrito se almacena como un arreglo de objetos en `localStorage` bajo la clave `gamehub_carrito`.
- Cada objeto representa un producto en el carrito y contiene: `id`, `nombre`, `precio`, `cantidad`, `stockMaximo` y `imagen`.
- Toda operación que modifica el carrito (agregar, cambiar cantidad, quitar, vaciar) actualiza este arreglo en `localStorage` y luego vuelve a renderizar la vista afectada.
- Al cargar cualquier vista, el script primero lee `localStorage` para obtener el estado más reciente del carrito, asegurando consistencia entre pestañas y recargas (aunque no en tiempo real entre pestañas sin eventos `storage`; esto podría mejorarse en EP2).

#### Consideraciones para EP2 y EP3
- En EP2, migrar a React con Bootstrap, manteniendo la misma lógica de estado (puede usar Context API o Redux) y agregando pruebas unitarias con Jasmine y Karma.
- En EP3, reemplazar los datos simulados y `localStorage` por llamadas a API REST de microservicios Spring Boot, autenticación JWT y manejo de sesiones en el backend.

---
*Este documento constituye la propuesta inicial (versión 1) para el desarrollo del frontend de GameHub Store. Puede ser actualizado conforme avance el proyecto y se reciban retroalimentaciones del docente o asistentes.*