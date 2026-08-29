# Satelital Oeste — sitio web

Rediseño completo de [satelitaloeste.com.ar](https://www.satelitaloeste.com.ar).
El sitio anterior era Bootstrap 2, sin responsive, con la última modificación en 2016.

## Cómo se regenera

```bash
node _build/build.mjs
```

Genera `index.html`, `manejo-de-flotas.html`, `localizacion-activos.html`,
`rastreo-de-personas.html`, `contacto.html`, `sitemap.xml` y `robots.txt`.
El header, el footer y los bloques de contacto salen de una sola fuente, así que un
cambio en el menú o en un teléfono se toca en un solo lugar.

```
_build/
  data.mjs        datos del negocio (teléfonos, mails, redes) y menú
  icons.mjs       iconografía SVG propia y la marca
  layout.mjs      head, header, footer, schema, botón flotante
  contenido.mjs   imágenes, ticker, banda, contacto, figuras, hero interno
  build.mjs       contenido de cada página y escritura de los archivos
assets/
  css/            fonts.css · site.css (base) · blocks.css (secciones)
  js/site.js      preloader, menú, reveal, telemetría, formulario
  fonts/          woff2 auto-hospedadas, subset latin
  img/            fotos en WebP + favicon.svg · og.png · icon-180.png
```

## Sistema visual

Dos reglas que no se rompen:

1. **Sin cajas con ícono adentro.** Las secciones se separan con líneas finas,
   numeración en mono y tipografía. Nada de tarjetas con un cuadradito de ícono
   arriba: es el bloque de plantilla más visto y el sitio no lo usa en ningún lado.
2. **La fotografía carga el peso visual.** Filas editoriales alternadas, imágenes
   de fondo en los encabezados y una banda ancha entre secciones.

## Imágenes

Fotos de Pexels (licencia libre, uso comercial, sin atribución), tratadas con un
duotono de la paleta de marca para que se lean como un mismo sistema y no como
stock suelto. El script que las genera está en `../_work` (fuera del repo): recorta
al aspecto que pide cada bloque, aplica el duotono y exporta WebP en tres anchos.

Para agregar una imagen: exportarla como `nombre-ANCHO.webp`, registrarla en el
mapa `IMG` de `_build/contenido.mjs` con su relación de aspecto y sus anchos, y
usarla con `img()`, `fig()`, `fondo()` o `phero()`.

Después de tocar CSS o JS, subir `V` en `_build/layout.mjs` para romper la caché.

## Identidad

Muestreada del logo original (globo azul con órbita).

| Rol | Color |
| --- | --- |
| Fondo | `#05090F` |
| Superficies | `#0A121D` · `#0F1A29` |
| Sección clara | `#EEF4F9` |
| Azul de marca | `#00548D` · `#0D6FB4` |
| Cian (acento) | `#35C6FF` · `#7FE0FF` |
| Texto | `#E8F1F8` · `#94AABF` |

Tipografías: **Space Grotesk** (títulos), **IBM Plex Sans** (lectura),
**IBM Plex Mono** (telemetría y etiquetas). Todas auto-hospedadas.

## SEO

Se mantienen las URLs del sitio viejo (`manejo-de-flotas.html`,
`localizacion-activos.html`, `rastreo-de-personas.html`) para no perder
posicionamiento. `vercel.json` redirige `index.php` y `contacto.php` con 308.

## Datos del negocio

Todo lo publicado sale del sitio original y de los perfiles públicos:
0800 122 0789, (011) 15-5815-5948, (03546) 15-502842, exterior 0054 11 5294-8303,
info@ / contacto@ / tecnica@satelitaloeste.com.ar, sucursales en Buenos Aires y Córdoba.

**Pendiente de confirmar con el cliente:** que el (011) 15-5815-5948 sea el número de
WhatsApp (está cableado en `_build/data.mjs` como `wa`). No hay dirección, horarios ni
reseñas publicadas, así que no se inventó ninguno.
