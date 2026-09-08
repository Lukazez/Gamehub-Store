# GameHub Store - Frontend

## Integrantes
- Lukas
- Gustavo
- ariel

## Requisitos previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- No se requiere instalación de dependencias adicionales; el proyecto se ejecuta directamente abriendo `index.html`.

## Instrucciones de ejecución
1. Clonar o descargar el repositorio.
2. Abrir el archivo `index.html` en el navegador.
3. Navegar por las secciones: Inicio, Catálogo, Carrito, Checkout, Mis Órdenes.
4. Interactuar con el catálogo, agregar productos al carrito, aplicar cupones, completar el checkout y ver el historial de órdenes (simulado).

## Estructura de carpetas
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

## Funcionalidades implementadas (EP1)
- Navegación común con header y footer.
- Catálogo de productos renderizado dinámicamente desde un arreglo JavaScript.
- Filtros por categoría, marca, rango de precio y ordenamiento.
- Carga incremental de productos ("Cargar más").
- Carrito de compras con persistencia en `localStorage`.
- Validación de formularios en el checkout (campos obligatorios, formato de email, teléfono, región/comuna, método de pago).
- Aplicación de cupones de descuento.
- Diseño responsivo con Flexbox y Grid.
- Estado del carrito mantenido entre vistas mediante `localStorage`.
- Página de historial de órdenes (ordenes.html) con datos simulados.

## Próximos pasos (EP2 y EP3)
- Migrar a React con Bootstrap y agregar pruebas unitarias con Jasmine y Karma.
- Integrar con el backend de microservicios Spring Boot mediante API REST y autenticación JWT.
- Implementar manejo de sesiones y roles de usuario (Administrador, Operador, Cliente, Visitante).
