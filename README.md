# NOVA CHAINS

Tienda estática en HTML, CSS y JavaScript, sin dependencias de compilación.

## Ver localmente

Abre `index.html` en un navegador. Para servirla desde un servidor local, ejecuta desde esta carpeta `python -m http.server 8000` y visita `http://localhost:8000`.

## Personalización

- Número de WhatsApp, precio, promoción del dije de cruz y fotografías de las cadenas: `config.js`.
- Estilos, colores y diseño adaptable: `styles.css`, en particular las variables al inicio.
- Las nueve fotos de cadenas y la foto del dije de cruz están en `public/images`. Para añadir o cambiar modelos, actualiza el arreglo `collectionImages` en `config.js`; la imagen del regalo se configura en `giftImage`.
- La galería de clientes usa `public/images/clientes` y el arreglo `customerPhotos` de `config.js`. Para agregar una foto, copia su archivo a esa carpeta y agrega un elemento con `image`, `alt` y `caption` al arreglo; sube el archivo y los cambios de configuración al repositorio.

## Sección de desarrollo

- El mensaje que prepara el botón “Hablemos de tu proyecto” se cambia en `developmentContactMessage`, dentro de `config.js`. El enlace reutiliza `whatsappNumber` y abre WhatsApp para que la persona complete y envíe el mensaje.
- Los seis servicios y sus iconos se editan en el arreglo `developmentServices` de `config.js`.
- `developerProfile` está preparado para agregar posteriormente nombre profesional, correo o portafolio.
- Los textos de presentación y la firma se encuentran en la sección `developer` de `index.html`; su diseño adaptable está al final de `styles.css`.

Para publicar, sube todos estos archivos y la carpeta `public/images` a un servicio de alojamiento de sitios estáticos. No se requiere base de datos ni proceso de compilación.
