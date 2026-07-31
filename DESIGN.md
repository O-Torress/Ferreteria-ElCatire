# Design System - Ferretería El Catire

## Scope

Desarrollo de una aplicación web responsiva tipo catálogo digital para la Ferretería El Catire, 
la cual cuenta con dos sedes físicas en la ciudad de Maracaibo. El objetivo principal es optimizar 
el proceso de exhibición, búsqueda y preventa de productos ferreteros, facilitando la interacción 
entre el cliente y el negocio. 

- Módulo de Clientes:

Registro e inicio de sesión de usuarios (autenticación simulada/frontend).

Búsqueda de productos en tiempo real mediante barra de búsqueda y filtros por categoría.

Visualización de detalles del producto (imagen, descripción, precio, especificaciones).

Carrito de compras dinámico con cálculo automático del total de la compra.

Integración de cierre de venta: Redirección automática a WhatsApp o Telegram mediante un enlace dinámico que envía el detalle del pedido estructurado para concretar el pago y la entrega. 

- Módulo de Administrador (CRUD):

Panel de administración protegido para gestionar el catálogo.

Capacidad de agregar nuevos productos, editar información existente y eliminar productos del catálogo.

- Persistencia de datos

Los datos seran guardos y administrados en su totalidad por Supabase.

- Fuera del Alcance (Lo estará contemplado en el sistema):

Procesamiento de pagos integrados en la web (tarjetas de crédito, transferencias automáticas, etc.).

Gestión logística de envíos o cálculo automatizado de delivery por GPS.

Sincronización automatizada con el inventario físico de la tienda real.

## Paleta de Colores
- Primary orange: `#ee6610` (Barra superior header y títulos)
- Accent Yellow: `#fbef1f` (Badges de stock, ofertas, destacados)
- Accent green `#D92B2B` (Botón "Añadir al Carrito" y "Pedir por WhatsApp")
- Background: `#F8FAFC` (Gris claro ultra limpio)
- Cards Surface: `#FFFFFF` (Blanco puro)

## Tipografía
- Headings: Poppins / Montserrat (Bold)
- Body: Inter / Roboto (Regular)

## Estilo de Componentes
- Tarjetas: Esquinas con `border-radius: 8px`, sombra suave, precio en contraste.
- Botones: Fondo rojo `#D92B2B`, texto blanco, efecto hover.
- La vista de las tarjetas de los productos tienen que ser de 3 columnas y en movil de 1 sola

## Logotipo de la tienda 

- Este se encuentra en la carpeta img\fec.jpg.

- quiero que este sea visible en todo momento 
y que funcione como un boton para volver a la pagina principal 