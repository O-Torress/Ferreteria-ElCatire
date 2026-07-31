# Design System & Scope - Ferretería El Catire

## 1. Scope & Functional Requirements (Alcance del Proyecto)

Desarrollo de una aplicación web responsiva tipo catálogo digital para la Ferretería El Catire, la cual cuenta con dos sedes físicas en la ciudad de Maracaibo (Sede Norte y Sede Sur). El objetivo principal es optimizar la exhibición, búsqueda y preventa de productos ferreteros.

### Módulo de Clientes:
- **Selector de Sede:** Menú desplegable en el Header para seleccionar entre Sede Norte y Sede Sur de Maracaibo.
- **Autenticación:** Registro e inicio de sesión de usuarios (autenticación simulada / frontend).
- **Catálogo & Búsqueda:** Búsqueda en tiempo real mediante barra de búsqueda y filtros por categoría (Herramientas, Pinturas, Electricidad, Plomería, etc.).
- **Detalle de Producto:** Visualización de imágenes, descripción, precio, especificaciones y disponibilidad por sede.
- **Carrito de Compras:** Sidebar/Modal interactivo con cálculo automático del total en $ y Bs.
- **Cierre de Venta:** Integración con WhatsApp/Telegram mediante un enlace dinámico que genera un mensaje estructurado con el resumen del pedido para concretar pago y entrega.

### Módulo de Administrador (CRUD):
- Panel de administración protegido para gestionar el catálogo.
- Funcionalidades completas para Agregar, Editar y Eliminar productos del catálogo.

### Persistencia de Datos:
- Administrado y guardado mediante **Supabase**.

### Fuera del Alcance (Out of Scope):
- NO incluir pasarelas de pago automatizadas integradas (tarjetas, transferencias automáticas).
- NO incluir gestión logística de envíos ni cálculo de delivery por GPS.
- NO incluir sincronización automatizada con el inventario físico en tiempo real.

---

## 2. Paleta de Colores

- **Primary Orange:** `#EE6610` (Header superior, barra de navegación y títulos de sección)
- **Accent Yellow:** `#FBEF1F` (Badges de stock, ofertas y destacados)
- **Action Button / Accent:** `#D92B2B` (Botón "Añadir al Carrito" y "Pedir por WhatsApp")
- **Background:** `#F8FAFC` (Gris claro ultra limpio)
- **Cards Surface:** `#FFFFFF` (Blanco puro para tarjetas y modales)
- **Text Primary:** `#1A2536` (Texto oscuro de alta legibilidad)

---

## 3. Tipografía

- **Headings (Titulares):** Poppins o Montserrat (Weight: Bold / Semi-Bold)
- **Body (Texto general):** Inter o Roboto (Weight: Regular / Medium)

---

## 4. Branding & Logo

- **Ubicación del Logo:** Archivo localizado en `img/fec.jpg`.
- **Regla de Visualización:** Debe permanecer visible en el Header en todo momento.
- **Comportamiento:** Funciona como un botón interactivo (al hacer clic redirige a la página principal `/` o `Home`).

---

## 5. Layout & Grilla de Productos

- **Grilla del Catálogo:** - **Escritorio / Tablet (Desktop):** Layout de 3 columnas para exhibir las tarjetas de productos.
  - **Móvil (Mobile):** Layout de 1 columna responsiva.
- **Contenedor Máximo:** `1280px` centrado.

---

## 6. UI Components & States (Comportamiento de Interfaz)

- **Tarjetas de Producto (Cards):**
  - Fondo blanco `#FFFFFF` con esquinas redondeadas (`border-radius: 8px`).
  - Sombra suave al pasar el cursor (`hover:shadow-lg transition-all`).
  - Imagen del producto con proporción uniforme.
  - Título en negrita, precio en contraste y badge de disponibilidad.
- **Botones de Acción Principales:**
  - Fondo Rojo `#D92B2B`, texto blanco en negrita, bordes redondeados (`rounded-md`).
  - Transición suave de elevación o cambio de tono en `hover`.
- **Selector de Sedes:**
  - Ubicado en el Header con ícono de ubicación (Maracaibo: Sede Norte / Sede Sur).
- **Notificaciones (Toasts):**
  - Mensaje emergente en la esquina superior derecha al agregar un producto al carrito.