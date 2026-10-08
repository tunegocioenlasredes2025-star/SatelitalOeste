/* ============================================================
   Satelital Oeste — contenido y bloques de las paginas.
   Todo el texto sale del sitio original del cliente, reescrito.
   ============================================================ */
import { SITE, RUBROS } from "./data.mjs";
import { ICO } from "./icons.mjs";
import { waLink } from "./layout.mjs";

/* ---------------- imagenes ----------------
   Fotos tratadas con la paleta de marca (duotono azul/cian).
   Cada una se sirve en varios anchos; el navegador elige.       */
export const IMG = {
  "ruta-noche":     { ar: 16 / 9, w: [1000, 1600] },
  "flotas":         { ar: 4 / 3,  w: [500, 700, 1000] },
  "transporte":     { ar: 4 / 3,  w: [500, 700, 1000] },
  "maquinaria":     { ar: 4 / 3,  w: [500, 700, 1000] },
  "activos":        { ar: 4 / 3,  w: [500, 700, 1000] },
  "personas":       { ar: 4 / 3,  w: [500, 700, 1000] },
  "ruta-atardecer": { ar: 21 / 9, w: [700, 1100, 1800] },
  "camiones":       { ar: 16 / 9, w: [600, 900, 1400] },
  "personal":       { ar: 16 / 9, w: [600, 900, 1400] },
  "dashcam-app":    { ar: 768 / 1664, w: [400, 600, 800] }
};

export function img(name, alt, sizes, eager = false) {
  const d = IMG[name];
  const grande = d.w[d.w.length - 1];
  const medio = d.w[Math.max(0, d.w.length - 2)];
  const carga = eager
    ? 'loading="eager" fetchpriority="high"'
    : 'loading="lazy"';
  return `<img src="assets/img/${name}-${medio}.webp"` +
    ` srcset="${d.w.map(w => `assets/img/${name}-${w}.webp ${w}w`).join(", ")}"` +
    ` sizes="${sizes}" width="${grande}" height="${Math.round(grande / d.ar)}"` +
    ` alt="${alt}" ${carga} decoding="async">`;
}

const fondo = (name, alt, eager = false) =>
  `<div class="foto">${img(name, alt, "100vw", eager)}</div>`;

/* ---------------- bloques compartidos ---------------- */
export const ticker = `
<div class="ticker" aria-hidden="true">
  <div class="ticker-track">
    ${[0, 1].map(() => RUBROS.map(r => `<span>${r}</span>`).join("")).join("")}
  </div>
</div>`;

export const banda = `
<section class="banda">
  ${fondo("ruta-atardecer", "Ruta iluminada al anochecer vista desde arriba")}
  <div class="wrap">
    <p class="eyebrow rv">Cómo trabajamos</p>
    <h2 class="rv rv-d1">La unidad se mueve. El mapa la sigue.</h2>
    <p class="lead rv rv-d2">Sucursales en Buenos Aires y en Córdoba, y un 0800 gratuito para todo el país. Lo que cambia de un cliente a otro es el equipo que se instala, no la forma de mirarlo.</p>
  </div>
</section>`;

export const ctaFinal = (titulo, texto) => `
<section class="section cta-band" id="contacto">
  <div class="wrap">
    <div class="contact-grid">
      <div class="rv">
        <p class="eyebrow">Pedí tu cotización</p>
        <h2 style="margin-block:.9rem .85rem">${titulo}</h2>
        <p class="lead">${texto}</p>
        <form class="form" id="form-contacto" data-wa="${SITE.wa}" style="margin-top:1.8rem">
          <div class="field"><label for="f-nombre">Nombre y apellido</label><input id="f-nombre" name="nombre" type="text" required placeholder="Cómo te llamás"></div>
          <div class="field"><label for="f-empresa">Empresa</label><input id="f-empresa" name="empresa" type="text" placeholder="Razón social o nombre de fantasía"></div>
          <div class="field"><label for="f-telefono">Teléfono</label><input id="f-telefono" name="telefono" type="tel" required placeholder="Con característica"></div>
          <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" placeholder="tucorreo@empresa.com"></div>
          <div class="field"><label for="f-servicio">Qué necesitás</label>
            <select id="f-servicio" name="servicio">
              <option>Manejo de flotas</option>
              <option>Maquinaria pesada</option>
              <option>Transporte público</option>
              <option>Seguimiento de activos</option>
              <option>Rastreo de personas</option>
              <option>Todavía no sé, quiero asesoramiento</option>
            </select>
          </div>
          <div class="field"><label for="f-unidades">Unidades a equipar</label><input id="f-unidades" name="unidades" type="text" placeholder="Por ejemplo: 8 camiones"></div>
          <div class="field"><label for="f-mensaje">Contanos brevemente</label><textarea id="f-mensaje" name="mensaje" placeholder="Qué querés controlar y desde qué zona operás"></textarea></div>
          <button class="btn btn--pri" type="submit">${ICO.wa} Enviar por WhatsApp</button>
          <p class="form-note">Se abre WhatsApp con el mensaje ya escrito</p>
        </form>
      </div>
      <div class="rv rv-d1">
        <p class="eyebrow">Canales directos</p>
        <h3 style="margin-block:.8rem 1.2rem;font-size:clamp(1.3rem,3.4vw,1.7rem)">Hablá con alguien ahora</h3>
        <div class="canal">
          <a href="${SITE.tel0800Href}"><span class="k">Centro de atención</span><span class="v">${SITE.tel0800}</span>${ICO.flecha}</a>
          <a href="${waLink("Hola Satelital Oeste, quiero una cotización del servicio de rastreo satelital.")}" target="_blank" rel="noopener"><span class="k">WhatsApp</span><span class="v">${SITE.telWa}</span>${ICO.flecha}</a>
          <a href="mailto:${SITE.mailContacto}"><span class="k">Consultas comerciales</span><span class="v">${SITE.mailContacto}</span>${ICO.flecha}</a>
          <a href="mailto:${SITE.mailTecnica}"><span class="k">Soporte técnico</span><span class="v">${SITE.mailTecnica}</span>${ICO.flecha}</a>
        </div>
        <ul class="branch">
          <li><span>Sucursal</span><b>Buenos Aires</b><p><a href="${SITE.telWaHref}">${SITE.telWa}</a></p></li>
        </ul>
      </div>
    </div>
  </div>
</section>`;

const appItem = (t) => `<li>${ICO.check}<span>${t}</span></li>`;
export const applist = (items) => `<ul class="applist rv">${items.map(appItem).join("")}</ul>`;

export const pnext = (items) => `
<div class="pnext rv">
  ${items.map(i => `<a href="${i.h}"><span>${i.k}</span><b>${i.t}</b>${ICO.flecha}</a>`).join("")}
</div>`;

export const fig = (name, alt, pie) => `
<figure class="fig rv">
  <div class="marco">${img(name, alt, "(min-width:1200px) 1100px, 100vw")}</div>
  <figcaption>${pie}</figcaption>
</figure>`;

export const phero = (name, alt, crumb, h1, lead) => `
<section class="phero">
  ${fondo(name, alt, true)}
  <div class="wrap">
    <p class="crumb"><a href="index.html">Inicio</a> / ${crumb}</p>
    <h1>${h1}</h1>
    <p class="lead">${lead}</p>
  </div>
</section>`;

export { fondo };
