# NOVA CHAINS

Tienda estática en HTML, CSS y JavaScript, sin dependencias de compilación.

## Ver localmente

Abre `index.html` en un navegador. Para servirla desde un servidor local, ejecuta desde esta carpeta `python -m http.server 8000` y visita `http://localhost:8000`.

## Personalización

- Número de WhatsApp y fotografías de la colección: `config.js`.
- Estilos, colores y diseño adaptable: `styles.css`, en particular las variables al inicio.
- Las fotos actuales están en `public/images/cadena-1.jpeg`, `cadena-2.jpeg` y `cadena-3.jpeg`. Para añadir o cambiar fotos, actualiza el arreglo `collectionImages` en `config.js`; una imagen faltante mostrará un marcador.

## Sección de desarrollo

- El mensaje que prepara el botón “Hablemos de tu proyecto” se cambia en `developmentContactMessage`, dentro de `config.js`. El enlace reutiliza `whatsappNumber` y abre WhatsApp para que la persona complete y envíe el mensaje.
- Los seis servicios y sus iconos se editan en el arreglo `developmentServices` de `config.js`.
- `developerProfile` está preparado para agregar posteriormente nombre profesional, correo o portafolio.
- Los textos de presentación y la firma se encuentran en la sección `developer` de `index.html`; su diseño adaptable está al final de `styles.css`.

Para publicar, sube todos estos archivos y la carpeta `public/images` a un servicio de alojamiento de sitios estáticos. No se requiere base de datos ni proceso de compilación.
