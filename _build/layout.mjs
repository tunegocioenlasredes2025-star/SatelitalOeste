import { SITE, NAV } from "./data.mjs";
import { ICO, marca } from "./icons.mjs";

export const V = "13"; // cache busting de css/js

export const waLink = (msg) =>
  `https://wa.me/${SITE.wa}?text=${encodeURIComponent(msg)}`;

const schema = () => JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": SITE.dominio + "/#negocio",
  name: "Satelital Oeste",
  slogan: "Seguimiento en tiempo real",
  description: "Rastreo satelital GPS en tiempo real para flotas de vehículos, maquinaria pesada, transporte público, activos móviles y personas. Sucursales en Buenos Aires y Córdoba.",
  url: SITE.dominio + "/",
  telephone: ["+54-800-122-0789", "+54-11-5815-5948", "+54-3546-502842"],
  email: SITE.mailInfo,
  areaServed: { "@type": "Country", name: "Argentina" },
  address: [
    { "@type": "PostalAddress", addressRegion: "Buenos Aires", addressCountry: "AR" },
    { "@type": "PostalAddress", addressRegion: "Córdoba", addressCountry: "AR" }
  ],
  sameAs: [SITE.facebook, SITE.youtube],
  knowsAbout: ["Rastreo satelital", "Gestión de flotas", "Localización GPS", "Seguimiento de activos"]
});

function header(active) {
  const links = NAV.map(n =>
    `<a href="${n.h}"${n.h === active ? ' aria-current="page"' : ""}>${n.s || n.t}</a>`).join("");
  return `
<header class="hdr">
  <div class="wrap bar">
    <a class="logo" href="index.html" aria-label="Satelital Oeste — inicio">
      ${marca("h")}
      <span class="txt"><span class="n">Satelital Oeste</span><span class="t">Seguimiento en tiempo real</span></span>
    </a>
    <nav class="nav" aria-label="Principal">${links}</nav>
    <div class="hdr-cta">
      <a class="hdr-tel" href="${SITE.tel0800Href}"><span>Centro de atención</span><b>${SITE.tel0800}</b></a>
      <a class="btn btn--pri" href="${SITE.plataforma}" target="_blank" rel="noopener">${ICO.llave} Acceso a clientes</a>
    </div>
    <button class="burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Abrir menú">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
<div class="drawer" id="drawer">
  <nav aria-label="Menú">
    ${NAV.map((n, i) => `<a class="d-link" href="${n.h}"><i>0${i + 1}</i>${n.t}</a>`).join("")}
  </nav>
  <div class="d-foot">
    <a class="d-tel" href="${SITE.tel0800Href}">Centro de atención<b>${SITE.tel0800}</b></a>
    <a class="btn btn--pri" href="${SITE.plataforma}" target="_blank" rel="noopener">${ICO.llave} Acceso a clientes</a>
    <a class="btn btn--gho" href="${waLink("Hola Satelital Oeste, quiero información sobre el servicio de rastreo.")}" target="_blank" rel="noopener">${ICO.wa} Escribir por WhatsApp</a>
  </div>
</div>`;
}

function footer() {
  return `
<footer class="ftr">
  <div class="wrap">
    <div class="ftr-top">
      <div class="ftr-brand">
        <a class="logo" href="index.html" aria-label="Satelital Oeste">
          ${marca("f")}
          <span class="txt"><span class="n">Satelital Oeste</span><span class="t">Seguimiento en tiempo real</span></span>
        </a>
        <p>Rastreo satelital y desarrollo de soluciones informáticas. Control de flotas, maquinaria pesada, transporte público, activos móviles y personas, con sucursales en Buenos Aires y Córdoba.</p>
        <div class="ftr-soc">
          <a href="${SITE.facebook}" target="_blank" rel="noopener" aria-label="Facebook de Satelital Oeste">${ICO.fb}</a>
          <a href="${SITE.youtube}" target="_blank" rel="noopener" aria-label="Canal de YouTube de Satelital Oeste">${ICO.yt}</a>
          <a href="${waLink("Hola Satelital Oeste, quiero información sobre el servicio de rastreo.")}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICO.wa}</a>
        </div>
      </div>
      <div class="ftr-cols">
        <div>
          <h4>Servicios</h4>
          <ul>
            <li><a href="manejo-de-flotas.html">Manejo de flotas</a></li>
            <li><a href="manejo-de-flotas.html#maquinaria">Maquinaria pesada</a></li>
            <li><a href="manejo-de-flotas.html#transporte">Transporte público</a></li>
            <li><a href="localizacion-activos.html">Seguimiento de activos</a></li>
            <li><a href="rastreo-de-personas.html">Rastreo de personas</a></li>
          </ul>
        </div>
        <div>
          <h4>Sitio</h4>
          <ul>
            <li><a href="index.html">Inicio</a></li>
            <li><a href="index.html#plataforma">La plataforma</a></li>
            <li><a href="index.html#preguntas">Preguntas frecuentes</a></li>
            <li><a href="contacto.html">Contacto</a></li>
            <li><a href="${SITE.plataforma}" target="_blank" rel="noopener">Acceso a clientes</a></li>
          </ul>
        </div>
        <div>
          <h4>Contacto</h4>
          <ul>
            <li><a href="${SITE.tel0800Href}">${SITE.tel0800}</a></li>
            <li><a href="${SITE.telBsAsHref}">${SITE.telBsAs}</a></li>
            <li><a href="${SITE.telCbaHref}">${SITE.telCba}</a></li>
            <li><a href="${SITE.telExteriorHref}">${SITE.telExterior}</a></li>
            <li><a href="mailto:${SITE.mailInfo}">${SITE.mailInfo}</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="ftr-bot">
      <p>&copy; <span id="y">2026</span> Satelital Oeste. Todos los derechos reservados.</p>
      <p>Buenos Aires · Córdoba · Argentina</p>
    </div>
  </div>
</footer>
<a class="fab" href="${waLink("Hola Satelital Oeste, quiero una cotización del servicio de rastreo satelital.")}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">
  ${ICO.wa}<span>WhatsApp</span>
</a>`;
}

export function page({ file, title, desc, active, body, extraHead = "" }) {
  const canonical = SITE.dominio + "/" + (file === "index.html" ? "" : file);
  return `<!DOCTYPE html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#05090f">
<meta name="author" content="Satelital Oeste">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_AR">
<meta property="og:site_name" content="Satelital Oeste">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE.dominio}/assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${SITE.dominio}/assets/img/og.png">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/img/icon-180.png">
<link rel="preload" href="assets/fonts/space-grotesk-500-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/ibm-plex-sans-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/fonts.css?v=${V}">
<link rel="stylesheet" href="assets/css/site.css?v=${V}">
<link rel="stylesheet" href="assets/css/blocks.css?v=${V}">
${extraHead}<script type="application/ld+json">${schema()}</script>
</head>
<body>
<div id="pre"><div class="in"><div class="mark">${marca("p")}</div><div class="bar"></div><div class="lbl">Conectando</div></div></div>
<a class="skip" href="#main">Ir al contenido</a>
${header(active)}
<main id="main">
${body}
</main>
${footer()}
<script src="assets/js/site.js?v=${V}" defer></script>
</body>
</html>`;
}
