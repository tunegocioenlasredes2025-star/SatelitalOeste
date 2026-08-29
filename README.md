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
  data.mjs      datos del negocio (teléfonos, mails, redes) y menú
  icons.mjs     iconografía SVG propia y la marca
  layout.mjs    head, header, footer, schema, botón flotante
  build.mjs     contenido de cada página y escritura de los archivos
assets/
  css/          fonts.css · site.css (base) · blocks.css (secciones)
  js/site.js    preloader, menú, reveal, telemetría, formulario
  fonts/        woff2 auto-hospedadas, subset latin
  img/          favicon.svg · og.png · icon-180.png
```

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
