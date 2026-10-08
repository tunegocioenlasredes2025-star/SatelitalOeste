/* ============================================================
   Satelital Oeste — generador del sitio.
   node _build/build.mjs   (desde la carpeta web/)
   ============================================================ */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE } from "./data.mjs";
import { ICO } from "./icons.mjs";
import { page, waLink } from "./layout.mjs";
import { img, fondo, ticker, banda, ctaFinal, applist, pnext, fig, phero } from "./contenido.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ---------------- mapa animado de la consola ----------------
   Las rutas se definen como puntos y de ahi salen dos cosas:
   el trazado suave del camino y los keyframes que mueven la unidad.
   Se usa translate() y no offset-path porque en elementos SVG
   offset-distance no interpola en todos los navegadores.        */
const RUTAS = [
  { id: "r1", dur: 26, dl: 0, label: "UNIDAD 07", cls: "",
    pts: [[26,252],[86,228],[130,178],[186,140],[248,124],[312,132],[366,116],[392,96]] },
  { id: "r2", dur: 34, dl: 11, label: "UNIDAD 12", cls: "u--b",
    pts: [[386,46],[336,72],[292,104],[248,142],[206,182],[152,206],[96,212],[36,238]] },
  { id: "r3", dur: 42, dl: 23, label: "UNIDAD 03", cls: "u--c",
    pts: [[72,36],[112,74],[142,120],[178,158],[224,190],[280,206],[334,220],[380,246]] }
];

/* Catmull-Rom -> Bezier: puntos sueltos convertidos en una curva suave */
function tramos(pts) {
  const t = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || pts[i + 1];
    t.push([p1,
      [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
      [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6],
      p2]);
  }
  return t;
}
const n1 = (v) => Math.round(v * 10) / 10;
function curva(pts) {
  return "M" + n1(pts[0][0]) + " " + n1(pts[0][1]) +
    tramos(pts).map(c => "C" + [c[1], c[2], c[3]].map(p => n1(p[0]) + " " + n1(p[1])).join(" ")).join("");
}
function muestras(pts, porTramo) {
  const t = tramos(pts), out = [];
  t.forEach((c, i) => {
    const hasta = i === t.length - 1 ? porTramo : porTramo - 1;
    for (let k = 0; k <= hasta; k++) {
      const u = k / porTramo, m = 1 - u;
      out.push([
        m*m*m*c[0][0] + 3*m*m*u*c[1][0] + 3*m*u*u*c[2][0] + u*u*u*c[3][0],
        m*m*m*c[0][1] + 3*m*m*u*c[1][1] + 3*m*u*u*c[2][1] + u*u*u*c[3][1]
      ]);
    }
  });
  return out;
}
const keyframes = RUTAS.map(r => {
  const m = muestras(r.pts, 5);
  const pasos = m.map((p, i) =>
    n1((i / (m.length - 1)) * 100) + "%{transform:translate(" + n1(p[0]) + "px," + n1(p[1]) + "px)}").join("");
  return "@keyframes " + r.id + "{" + pasos + "}";
}).join(String.fromCharCode(10));

const estilosMapa = "<style>" + keyframes +
  RUTAS.map(r => ".u--" + r.id + "{animation:" + r.id + " " + r.dur +
    "s linear " + (-r.dl) + "s infinite alternate}").join("") + "</style>";

const unidad = (r) => `
    <g class="u u--${r.id} ${r.cls}" style="transform:translate(${n1(r.pts[0][0])}px,${n1(r.pts[0][1])}px)">
      <circle class="halo" r="9"/><circle class="dot" r="3.6"/>
      <rect class="tag" x="13" y="-8.5" width="${r.label.length * 4.9 + 9}" height="14" rx="4"/>
      <text x="17.5" y="1.7">${r.label}</text>
    </g>`;

const mapa = `
<svg viewBox="0 0 480 300" role="img" aria-label="Mapa con unidades en movimiento" preserveAspectRatio="xMidYMid meet">
  <g class="mp-grid">
    ${Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${i * 36 + 12}" x2="480" y2="${i * 36 + 12}"/>`).join("")}
    ${Array.from({ length: 14 }, (_, i) => `<line x1="${i * 36 + 10}" y1="0" x2="${i * 36 + 10}" y2="300"/>`).join("")}
  </g>
  <path class="mp-zone" d="M150 96 262 62l64 74-58 88-96-14z"/>
  <path class="mp-zone" d="M330 168l96-26 34 84-88 40z"/>
  <path class="mp-road" d="M0 150C120 140 200 172 480 136"/>
  <path class="mp-road" d="M152 0c22 92-24 196 22 300"/>
  <path class="mp-road" d="${curva(RUTAS[0].pts)}"/>
  <path class="mp-road" d="${curva(RUTAS[1].pts)}"/>
  <path class="mp-road mp-road--hi" d="${curva(RUTAS[2].pts)}"/>
  <g>
    <circle class="mp-ring" cx="132" cy="180" r="6"/>
    <circle class="mp-ring b" cx="132" cy="180" r="6"/>
    <circle class="mp-ring c" cx="132" cy="180" r="6"/>
    <circle class="mp-base" cx="132" cy="180" r="2.6"/>
  </g>
  ${RUTAS.map(unidad).join("")}
</svg>`;

const crow = (nombre, tipo, spd, estado) => `
  <div class="crow">
    <span class="id"><em></em><span>${nombre}</span><small>${tipo}</small></span>
    <span class="met"><span><b data-spd>${spd}</b> km/h</span><span class="st">${estado}</span></span>
  </div>`;

const consola = `
<div class="console-wrap">
  <div class="console">
    <div class="console-top">
      <span class="dots"><i></i><i></i><i></i></span>
      <span class="ttl">Panel de seguimiento</span>
      <span class="live">En vivo</span>
    </div>
    <div class="console-map">${mapa}</div>
    <div class="console-rows">
      ${crow("UNIDAD 07", "Camión", 62, "En ruta")}
      ${crow("UNIDAD 12", "Utilitario", 48, "En ruta")}
      ${crow("UNIDAD 03", "Retroexcavadora", 9, "Operando")}
    </div>
  </div>
  <p class="console-note">Representación del panel · datos ilustrativos</p>
</div>`;

/* ================= INICIO ================= */
const SOLS = [
  {
    im: "flotas", alt: "Camiones circulando por una autopista de varios carriles",
    t: "Manejo de flotas", h: "manejo-de-flotas.html",
    p: "La operación completa en un mapa a pantalla completa, para saber en cada instante qué pasa con cada vehículo y ajustar sobre la marcha.",
    li: ["Recorridos y posición en tiempo real", "Estado del vehículo y del conductor", "Taxis, distribución, logística y servicios públicos"]
  },
  {
    im: "transporte", alt: "Colectivo urbano avanzando por una avenida al anochecer",
    t: "Transporte público", h: "manejo-de-flotas.html#transporte",
    p: "Un sistema de acceso público, didáctico e intuitivo: la empresa gana control del servicio y el pasajero deja de esperar a ciegas.",
    li: ["Vista pública del recorrido", "Herramienta operativa para la empresa", "Servicio más previsible para el usuario"]
  },
  {
    im: "activos", alt: "Vista aérea de un camión avanzando por una ruta entre el monte",
    t: "Seguimiento de activos", h: "localizacion-activos.html",
    p: "Rastreadores compactos con batería de larga duración para todo lo que se mueve sin conductor fijo: maquinaria, cargas, motos y equipaje.",
    li: ["Semanas de autonomía con sensor de movimiento", "Se coloca de forma temporal", "Alertas de movimiento al usuario"]
  },
  {
    im: "personas", alt: "Trabajador con chaleco reflectivo y casco en una obra",
    t: "Rastreo de personas", h: "rastreo-de-personas.html",
    p: "El rastreador más chico del mercado, con batería incorporada. Pensado para personal que trabaja solo, fuera de la oficina o de noche.",
    li: ["Más chico que un celular", "Botón de alarma y aviso por inactividad", "También para mascotas y como señuelo en la carga"]
  }
];

const COSTOS = [
  { t: "Combustible y kilómetros", p: "Recorrido real contra recorrido previsto. Los desvíos y los kilómetros de más dejan de ser invisibles en la factura del mes." },
  { t: "Tiempos de servicio", p: "Cuánto tarda cada trabajo y cuánto tiempo estuvo la unidad detenida sin operar. Dos números que rara vez alguien tiene." },
  { t: "Horas adicionales", p: "La jornada de cada unidad queda registrada. Se factura y se paga lo que efectivamente se trabajó." },
  { t: "Forma de conducir", p: "El comportamiento al volante impacta directo en el mantenimiento, en la vida útil del vehículo y en el costo por kilómetro." }
];

const RASGOS = [
  { t: "Mapa a pantalla completa, en vivo", p: "Toda la operación en una sola vista, actualizada al instante. La gestión se hace mirando, no llamando." },
  { t: "Estado del vehículo y del conductor", p: "Las entradas y salidas del equipo reportan información del vehículo, no solamente la posición en el mapa." },
  { t: "Alarma automática y botón de pánico", p: "El dispositivo envía la alerta solo ante una eventualidad, y la persona también puede dispararla con un botón." },
  { t: "Aviso por inactividad", p: "Si una unidad o una persona queda demasiado tiempo sin moverse, la plataforma lo informa." },
  { t: "Acceso web con usuario propio", p: "Cada cliente entra con su clave y ve únicamente sus unidades, desde cualquier navegador y sin instalar nada." }
];

const PASOS = [
  { t: "Relevamiento", p: "Cuántas unidades son, qué tipo de vehículo o activo hay que equipar y qué necesitás controlar. De ahí sale la cotización, no de una lista de precios genérica." },
  { t: "Instalación de los equipos", p: "Colocamos el localizador GPS en cada unidad. En activos móviles el equipo es compacto, tiene batería propia y puede ir de forma temporal." },
  { t: "Alta en la plataforma", p: "Te entregamos usuario y clave. Desde ese momento ves tus unidades en el mapa desde cualquier navegador, en tiempo real." },
  { t: "Soporte técnico", p: "Quedás con línea directa: el 0800, WhatsApp y una casilla técnica exclusiva para lo que aparezca después de la instalación." }
];

const FAQ = [
  { q: "¿Sirve para cualquier tipo de vehículo?", a: "Sí. El sistema está orientado a control de flotas de vehículos, maquinaria pesada y transporte público, y también se aplica a motos, utilitarios y activos que no tienen conductor fijo." },
  { q: "¿Desde dónde veo mis unidades?", a: "Desde la plataforma web, con tu usuario y tu clave. Se entra por navegador, desde una computadora o desde el celular, sin instalar programas." },
  { q: "¿Qué pasa con los activos que no tienen batería del vehículo?", a: "Para eso están los rastreadores con batería de larga duración. Combinados con sensores de movimiento, pueden funcionar semanas sin recargarse ni conectarse a otra fuente de energía." },
  { q: "¿Se puede rastrear personas y no solo vehículos?", a: "Sí. Es el rastreador más chico del mercado, más chico que un celular y con batería incorporada. Se usa para personal que trabaja solo o fuera de la oficina, para mascotas y como señuelo dentro de la carga." },
  { q: "¿Atienden fuera de Buenos Aires?", a: "Sí. Hay un 0800 gratuito para todo el país: 0800 122 0789. Contános dónde operás y te decimos cómo lo cubrimos." },
  { q: "¿Cuánto sale el servicio?", a: "Depende de la cantidad de unidades y del tipo de equipo que necesite cada una. Escribinos por WhatsApp o dejanos los datos en el formulario y te pasamos la cotización armada para tu caso." }
];

const indexBody = `
<section class="hero">
  ${fondo("ruta-noche", "Vista aérea nocturna de una ciudad con el tránsito iluminado", true)}
  <div class="bg-grid"></div>
  <div class="wrap hero-in">
    <div>
      <p class="eyebrow rv">Buenos Aires y Córdoba</p>
      <h1 class="rv rv-d1">Dónde está cada unidad, <span class="hl">ahora mismo</span>.</h1>
      <p class="lead rv rv-d2">Rastreo y seguimiento en tiempo real para flotas, maquinaria pesada, transporte público, activos móviles y personas. Equipos instalados, plataforma propia y soporte técnico de este lado del teléfono.</p>
      <div class="btns rv rv-d3">
        <a class="btn btn--pri" href="${waLink("Hola Satelital Oeste, quiero una cotización del servicio de rastreo satelital.")}" target="_blank" rel="noopener">${ICO.wa} Pedir cotización</a>
        <a class="btn btn--gho" href="#soluciones">Ver soluciones ${ICO.flecha}</a>
      </div>
      <ul class="hero-trust rv rv-d4">
        <li><span>Centro de atención</span><b>${SITE.tel0800}</b></li>
        <li><span>Sucursales</span><b>Buenos Aires y Córdoba</b></li>
        <li><span>Plataforma</span><b>Acceso web para clientes</b></li>
      </ul>
    </div>
    <div class="rv rv-d2">${consola}</div>
  </div>
</section>

${ticker}

<section class="section" id="porque">
  <div class="wrap">
    <div class="head rv">
      <p class="eyebrow">El punto</p>
      <h2>Una flota que no se mide se termina pagando de más.</h2>
      <p class="lead">Combustible, horas extras, desvíos y tiempos muertos no aparecen en ninguna planilla hasta que alguien los mide. Un localizador GPS convierte esa zona gris en información concreta.</p>
    </div>
    <div class="punto">
      <figure class="punto-img rv">
        <div class="marco">${img("camiones", "Fila de camiones de carga detenidos esperando para avanzar", "(min-width:960px) 40vw, 100vw")}</div>
        <figcaption>Cada hora detenida se paga igual</figcaption>
      </figure>
      <div class="costos rv rv-d1">
        ${COSTOS.map((c, i) => `<article class="costo"><span class="n">0${i + 1}</span><h3>${c.t}</h3><p>${c.p}</p></article>`).join("")}
      </div>
    </div>
  </div>
</section>

<section class="section" id="soluciones" style="padding-top:0">
  <div class="wrap">
    <div class="head rv">
      <p class="eyebrow">Soluciones</p>
      <h2>Cuatro problemas distintos. Un mismo mapa.</h2>
      <p class="lead">No es el mismo equipo el que va en un camión de larga distancia que el que se esconde dentro de una carga. Por eso la solución se arma a medida de lo que hay que controlar.</p>
    </div>
    <div class="vias">
      ${SOLS.map((s, i) => `
      <article class="via rv">
        <figure class="via-img">
          ${img(s.im, s.alt, "(min-width:900px) 50vw, 100vw")}
          <span class="via-n">0${i + 1}</span>
        </figure>
        <div class="via-tx">
          <h3>${s.t}</h3>
          <p>${s.p}</p>
          <ul class="pts">${s.li.map(x => `<li>${x}</li>`).join("")}</ul>
          <a class="via-go" href="${s.h}">Ver en detalle ${ICO.flecha}</a>
        </div>
      </article>`).join("")}
    </div>
  </div>
</section>

${banda}

<section class="section paper" id="plataforma">
  <div class="wrap">
    <div class="head rv">
      <p class="eyebrow eyebrow--ink">La plataforma</p>
      <h2>El mapa lo mira el cliente, no solamente el técnico.</h2>
      <p class="lead">Cada cliente entra con su usuario y ve únicamente sus unidades. Sin llamar a nadie, sin pedir un reporte, sin esperar al lunes.</p>
    </div>
    <div class="plat">
      <div class="rasgos rv">
        ${RASGOS.map((f, i) => `<article class="rasgo"><span class="n">0${i + 1}</span><h4>${f.t}</h4><p>${f.p}</p></article>`).join("")}
      </div>
      <div class="rv rv-d1">
        <div class="mock">
          <div class="mock-top"><span class="dots"><i></i><i></i><i></i></span><span class="ttl">Resumen de operación</span></div>
          <div class="mock-body">
            <div class="mock-cell">
              <span class="k">Unidades en línea</span>
              <span class="v">18<small>/ 20</small></span>
              <svg class="spark" viewBox="0 0 120 34" aria-hidden="true"><path class="fillp" d="M0 26 18 20 34 23 52 12 70 16 88 7 104 11 120 5v29H0z"/><path d="M0 26 18 20 34 23 52 12 70 16 88 7 104 11 120 5"/></svg>
            </div>
            <div class="mock-cell">
              <span class="k">Recorrido del día</span>
              <span class="v">1.284<small>km</small></span>
              <svg class="spark" viewBox="0 0 120 34" aria-hidden="true"><path class="fillp" d="M0 20 16 24 32 14 50 18 66 9 84 14 102 6 120 10v24H0z"/><path d="M0 20 16 24 32 14 50 18 66 9 84 14 102 6 120 10"/></svg>
            </div>
          </div>
          <ul class="mock-list">
            <li class="warn"><em></em><span>Unidad 12 — detenida fuera de recorrido</span><time>08:42</time></li>
            <li class="ok"><em></em><span>Unidad 07 — llegada a destino</span><time>09:15</time></li>
            <li><em></em><span>Unidad 03 — encendido de motor</span><time>09:31</time></li>
            <li class="warn"><em></em><span>Unidad 21 — exceso de velocidad</span><time>10:04</time></li>
          </ul>
        </div>
        <p class="console-note" style="color:#5e7286">Representación del panel · datos ilustrativos</p>
        <div class="btns" style="margin-top:1.5rem">
          <a class="btn btn--ink" href="${SITE.plataforma}" target="_blank" rel="noopener">${ICO.llave} Acceso a clientes</a>
          <a class="btn btn--ghoink" href="contacto.html">Quiero una demo</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section" id="videomonitoreo">
  <div class="wrap">
    <div class="head rv">
      <p class="eyebrow">Videomonitoreo móvil</p>
      <h2>Además del punto en el mapa, la imagen.</h2>
      <p class="lead">La cámara no es un equipo aparte: <b>ya trae el rastreador satelital adentro</b>. Se instala una sola vez, pegada al parabrisas, y desde la misma app ves dónde está la unidad y qué está pasando ahí.</p>
    </div>

    <div class="plat">
      <div class="rasgos rv">
        <article class="rasgo"><span class="n">01</span><h4>En vivo</h4>
          <p>Abrís la app y ves lo que está pasando en ese momento. Elegís la cámara de la ruta, la de la cabina o las dos juntas.</p></article>
        <article class="rasgo"><span class="n">02</span><h4>Histórico</h4>
          <p>Buscás por día, fecha y hora. La grabación queda guardada en videos de tres minutos que podés ir consultando.</p></article>
        <article class="rasgo"><span class="n">03</span><h4>Captura al instante</h4>
          <p>Una foto de lo que se está viendo, sin esperar a que cargue el video. Para cuando necesitás saber ya.</p></article>
      </div>
      <div class="rv rv-d1 dashcam-shot">
        <style>.dashcam-shot img{max-height:560px;width:auto;margin-inline:auto;display:block;border-radius:18px}
        .dashcam-shot .console-note{text-align:center}</style>
        ${img("dashcam-app", "App de Satelital Oeste mostrando la cámara frontal en vivo, con fecha, posición y velocidad", "(min-width:900px) 40vw, 80vw")}
        <p class="console-note" style="color:#5e7286">App de Satelital Oeste · cámara frontal en vivo</p>
      </div>
    </div>

    <div class="head rv" style="margin-top:3.5rem">
      <h2 style="font-size:clamp(1.3rem,3.2vw,1.8rem)">Dos modelos, según qué necesités ver</h2>
    </div>
    <div class="rasgos rv">
      <article class="rasgo"><span class="n">01</span><h4>Solo cámara frontal</h4>
        <p>Mira la ruta y el entorno del vehículo. Sirve para respaldar un siniestro, un reclamo o demostrar por dónde se pasó y cómo.</p></article>
      <article class="rasgo"><span class="n">02</span><h4>Frontal más cabina</h4>
        <p>Suma una segunda cámara gran angular que toma casi toda la cabina. Es la que resuelve el “llamo y no contesta”: en vez de suponer, mirás.</p></article>
      <article class="rasgo"><span class="n">03</span><h4>Graba sola, con botón de pánico</h4>
        <p>Graba todo el tiempo que el vehículo está en marcha, sin que nadie la active. Y el chofer tiene un botón de pánico a mano.</p></article>
    </div>

    <div class="btns" style="margin-top:2.2rem">
      <a class="btn btn--pri" href="${waLink("Hola Satelital Oeste, quiero información sobre las cámaras con videomonitoreo móvil.")}" target="_blank" rel="noopener">${ICO.wa} Consultar por las cámaras</a>
      <a class="btn btn--gho" href="contacto.html">Pedir una demo</a>
    </div>
  </div>
</section>

<section class="section" id="implementacion">
  <div class="wrap">
    <div class="head rv">
      <p class="eyebrow">Cómo se pone en marcha</p>
      <h2>De la primera llamada al mapa andando.</h2>
      <p class="lead">Cuatro pasos, sin vueltas y sin sorpresas en el medio.</p>
    </div>
    <div class="steps">
      ${PASOS.map(s => `<article class="step rv"><h3>${s.t}</h3><p>${s.p}</p></article>`).join("")}
    </div>
  </div>
</section>

<section class="section" id="preguntas" style="padding-top:0">
  <div class="wrap">
    <div class="head rv">
      <p class="eyebrow">Preguntas frecuentes</p>
      <h2>Lo que nos preguntan antes de contratar.</h2>
    </div>
    <div class="faq rv">
      ${FAQ.map(f => `<details><summary>${f.q}<span class="pm"></span></summary><div class="ans"><p>${f.a}</p></div></details>`).join("")}
    </div>
  </div>
</section>

${ctaFinal("Contanos qué necesitás controlar.", "Dejanos los datos y te armamos la cotización según la cantidad de unidades y el tipo de equipo. Si preferís hablar, el 0800 es gratuito desde todo el país.")}
`;

/* ================= MANEJO DE FLOTAS ================= */
const GANANCIAS = [
  { b: "Optimizar los tiempos de servicio", p: "Saber cuánto tarda realmente cada trabajo y comparar entre equipos y entre obras." },
  { b: "Disminuir los tiempos de inactividad", p: "Detectar las horas en las que la máquina estuvo encendida sin producir." },
  { b: "Reducir la facturación de horas adicionales", p: "La jornada de cada equipo queda registrada. Se factura lo que se trabajó." },
  { b: "Reducir kilómetros y combustible", p: "Recorridos reales contra recorridos previstos, para cortar el desvío antes de que sea costumbre." },
  { b: "Bajar gastos de comunicaciones", p: "Menos llamadas para preguntar dónde está la máquina y en qué estado quedó." },
  { b: "Reducir gastos de personal", p: "Una misma persona puede coordinar más equipos cuando los ve a todos en el mismo mapa." }
];

const flotasBody = `
${phero("flotas", "Camiones circulando por una autopista de varios carriles", "Manejo de flotas",
  "Gestión de flotas: más eficiencia operativa, menos costo por kilómetro.",
  "Para muchas empresas, la localización y el estado de la flota es información de importancia vital. Conocer el estatus de los activos móviles afecta directamente la eficiencia y los costos de la operación.")}

<section class="section section--tight">
  <div class="wrap">
    <div class="prose rv">
      <p>Múltiples estudios señalan que un comportamiento apropiado de los conductores tiene un impacto significativo en los costos de operación del vehículo. Contar con un sistema de gestión de flotas o de activos móviles ha demostrado proporcionar un rápido retorno de la inversión en combustible, en mantenimiento y en mejoras del servicio al cliente.</p>
      <p>La unidad de rastreo de <strong>Satelital Oeste</strong> es un potente localizador GPS, fácil de integrar en un sistema empresarial ya existente, que entrega en tiempo real información actualizada sobre la localización del vehículo o del activo. Las entradas y salidas del equipo pueden utilizarse para reunir una gran variedad de información sobre el estado del vehículo y del conductor.</p>
    </div>

    ${fig("camiones", "Fila de camiones de carga esperando para avanzar", "Distribución y logística · una de las aplicaciones más frecuentes")}

    <div class="head rv" style="margin-top:3.2rem">
      <p class="eyebrow">Dónde se aplica</p>
      <h2 style="font-size:clamp(1.5rem,4vw,2.1rem)">Rubros donde el sistema ya está trabajando</h2>
    </div>
    ${applist(["Taxis y transporte público", "Distribución y logística", "Seguridad vial", "Servicios públicos: electricidad, agua y saneamiento", "Telecomunicaciones", "Construcción", "Seguridad de conductores adolescentes"])}
  </div>
</section>

<section class="section paper" id="maquinaria">
  <div class="wrap">
    <div class="head rv">
      <p class="eyebrow eyebrow--ink">Maquinaria pesada</p>
      <h2>Una máquina parada cuesta lo mismo que una trabajando.</h2>
      <p class="lead">Las flotas de vehículos y equipos representan una inversión grande, además de los gastos de operación y mantenimiento. Las empresas que todavía no se enfocaron en maximizar la eficiencia de esos activos tienen una oportunidad concreta de mejorar su productividad.</p>
    </div>
    <div class="gains">
      ${GANANCIAS.map((g, i) => `<article class="gain rv"><span class="n">0${i + 1}</span><b>${g.b}</b><p>${g.p}</p></article>`).join("")}
    </div>
  </div>
</section>

<section class="section" id="transporte">
  <div class="wrap">
    <div class="head rv">
      <p class="eyebrow">Transporte público</p>
      <h2>Un servicio que el pasajero puede ver.</h2>
      <p class="lead">Sistema de acceso público, totalmente didáctico e intuitivo. Aplicado al transporte de pasajeros, le da a la empresa y al usuario una herramienta de suma utilidad para hacer más eficiente el servicio.</p>
    </div>
    ${fig("transporte", "Colectivo urbano avanzando por una avenida al anochecer", "Transporte de pasajeros · vista pública del recorrido")}
    ${applist(["Vista pública del recorrido para el pasajero", "Control operativo de la frecuencia real", "Registro del cumplimiento de cada ramal", "Menos reclamos por espera a ciegas"])}
    ${pnext([
      { k: "Siguiente", t: "Seguimiento de activos", h: "localizacion-activos.html" },
      { k: "Siguiente", t: "Rastreo de personas", h: "rastreo-de-personas.html" }
    ])}
  </div>
</section>

${ctaFinal("¿Cuántas unidades tenés que controlar?", "Contanos el tamaño de la flota y el tipo de vehículo o de maquinaria, y te pasamos la cotización armada para tu operación.")}
`;

/* ================= ACTIVOS ================= */
const activosBody = `
${phero("activos", "Vista aérea de un camión avanzando por una ruta entre el monte", "Seguimiento de activos",
  "Localización avanzada y monitoreo de activos móviles.",
  "Rastrear todo lo que se mueve sin conductor fijo, desde una computadora hasta el equipaje, es posible con rastreadores de batería de larga duración.")}

<section class="section section--tight">
  <div class="wrap">
    <div class="prose rv">
      <p>La combinación de una gestión avanzada de energía con componentes de alta calidad da como resultado un dispositivo compacto de rastreo de activos, con aplicaciones en una amplia gama de áreas.</p>
      <p>Con sensores de movimiento, estos dispositivos pueden durar <strong>semanas</strong> sin necesidad de recargarse ni de estar conectados a otras fuentes de energía. Pueden colocarse de forma temporal en la parte inferior de vehículos o motocicletas y enviarle al usuario alertas de movimiento.</p>
    </div>

    <div class="specs rv">
      <div class="spec"><span>Autonomía</span><b>Semanas sin recarga</b></div>
      <div class="spec"><span>Formato</span><b>Dispositivo compacto</b></div>
      <div class="spec"><span>Sensor</span><b>Detección de movimiento</b></div>
      <div class="spec"><span>Montaje</span><b>Colocación temporal</b></div>
    </div>

    ${fig("maquinaria", "Maquinaria pesada moviendo tierra en una cantera", "Maquinaria y activos que se mueven sin conductor fijo")}

    <div class="head rv" style="margin-top:3.2rem">
      <p class="eyebrow">Dónde se aplica</p>
      <h2 style="font-size:clamp(1.5rem,4vw,2.1rem)">Activos que hoy se pierden de vista</h2>
    </div>
    ${applist(["Monitoreo de vehículos en alquiler y alarmas inalámbricas", "Rastreo satelital de mascotas", "Rastreo de motocicletas", "Seguimiento y monitoreo de equipaje", "Cuidado infantil", "Monitoreo de conductores adolescentes"])}

    ${pnext([
      { k: "Ver también", t: "Manejo de flotas", h: "manejo-de-flotas.html" },
      { k: "Ver también", t: "Rastreo de personas", h: "rastreo-de-personas.html" }
    ])}
  </div>
</section>

${ctaFinal("¿Qué activo necesitás no perder de vista?", "Contanos qué querés rastrear y en qué condiciones se mueve. Con eso definimos el equipo y te pasamos el presupuesto.")}
`;

/* ================= PERSONAS ================= */
const personasBody = `
${phero("personas", "Trabajador con chaleco reflectivo y casco en una obra", "Rastreo de personas",
  "Asegurá a tus trabajadores en todo momento.",
  "En muchas industrias los empleados trabajan sin supervisión, en ambientes que exigen mayor esfuerzo físico o jornadas extensas. En la mayoría de esos casos su seguridad personal queda expuesta, y eso no solo baja la productividad: aumenta la responsabilidad de la empresa.")}

<section class="section section--tight">
  <div class="wrap">
    <div class="head rv">
      <p class="eyebrow">A quiénes protege</p>
      <h2 style="font-size:clamp(1.5rem,4vw,2.1rem)">Trabajadores que pasan el día fuera del alcance de la vista</h2>
    </div>
    ${applist(["Empleados independientes", "Personal que trabaja fuera de las oficinas: transporte, pintura, decoración, trabajos eléctricos y reparaciones", "Personas que trabajan fuera del horario de oficina, como seguridad o limpieza nocturna", "Trabajadores móviles, como vendedores que están solos gran parte de la jornada", "Personas que trabajan desde su casa"])}

    ${fig("personal", "Trabajadora con casco de seguridad en una planta industrial", "Personal que trabaja fuera de la vista del supervisor")}

    <div class="prose rv" style="margin-top:3rem">
      <h2>La responsabilidad del empleador no se delega</h2>
      <p>Proteger la salud y la seguridad de todos los trabajadores es obligación de la empresa. En muchas ocasiones no es posible supervisar continuamente a cada persona, pero comunicarse con ellas y monitorear sus condiciones y prácticas de trabajo resulta de vital importancia para reducir los riesgos asociados.</p>
      <p>El rastreador GPS de <strong>Satelital Oeste</strong> permite que la ubicación del personal esté monitoreada de manera continua y que se envíe un mensaje cuando el trabajador regresó a salvo de su jornada. Ante cualquier eventualidad, el dispositivo envía automáticamente una alarma a la base, o el propio trabajador puede presionar un botón para dispararla. Los dispositivos también avisan cuando detectan un período largo de inactividad.</p>
    </div>

    <div class="specs rv">
      <div class="spec"><span>Tamaño</span><b>Más chico que un celular</b></div>
      <div class="spec"><span>Energía</span><b>Batería incorporada</b></div>
      <div class="spec"><span>Emergencia</span><b>Botón de alarma</b></div>
      <div class="spec"><span>Automático</span><b>Aviso por inactividad</b></div>
    </div>

    <div class="head rv" style="margin-top:3.2rem">
      <p class="eyebrow">Otros usos</p>
      <h2 style="font-size:clamp(1.5rem,4vw,2.1rem)">El mismo equipo, otras necesidades</h2>
      <p class="lead">Por su tamaño y su batería, el rastreador de personas también se aplica a la localización de mascotas y como señuelo dentro de la carga.</p>
    </div>

    ${pnext([
      { k: "Ver también", t: "Manejo de flotas", h: "manejo-de-flotas.html" },
      { k: "Ver también", t: "Seguimiento de activos", h: "localizacion-activos.html" }
    ])}
  </div>
</section>

${ctaFinal("Poné a tu gente en el mapa.", "Contanos cuántas personas trabajan fuera de la oficina y en qué condiciones. Te asesoramos sobre el equipo que corresponde.")}
`;

/* ================= CONTACTO ================= */
const contactoBody = `
${phero("ruta-noche", "Vista aérea nocturna de una ciudad con el tránsito iluminado", "Contacto",
  "Hablemos de tu operación.",
  "Un 0800 gratuito para todo el país, WhatsApp, correo por área y sucursales en Buenos Aires y Córdoba. Elegí el canal que te quede más cómodo.")}

${ctaFinal("Contanos de tu operación y armamos la propuesta.", "Cuantos más datos nos dejes sobre la cantidad de unidades y el tipo de vehículo o activo, más precisa sale la cotización.")}

<section class="section section--tight">
  <div class="wrap">
    <div class="head rv">
      <p class="eyebrow">Ya sos cliente</p>
      <h2 style="font-size:clamp(1.5rem,4vw,2.1rem)">Entrá a tu panel de seguimiento</h2>
      <p class="lead">Accedé con tu usuario y tu clave para ver tus unidades en el mapa. Si necesitás ayuda técnica, escribinos a ${SITE.mailTecnica}.</p>
    </div>
    <div class="btns rv" style="margin-top:1.7rem">
      <a class="btn btn--pri" href="${SITE.plataforma}" target="_blank" rel="noopener">${ICO.llave} Acceso a clientes</a>
      <a class="btn btn--gho" href="mailto:${SITE.mailTecnica}">${ICO.mail} Soporte técnico</a>
    </div>
  </div>
</section>
`;

/* ---------------- escritura ---------------- */
const PAGES = [
  {
    file: "index.html", active: "index.html", body: indexBody, extraHead: estilosMapa,
    title: "Satelital Oeste | Rastreo satelital GPS en tiempo real para flotas y personas",
    desc: "Rastreo y seguimiento satelital en tiempo real: control de flotas de vehículos, maquinaria pesada, transporte público, activos móviles y personas. Sucursales en Buenos Aires y Córdoba. 0800 122 0789."
  },
  {
    file: "manejo-de-flotas.html", active: "manejo-de-flotas.html", body: flotasBody,
    title: "Manejo de flotas y maquinaria pesada | Satelital Oeste",
    desc: "Gestión de flotas con localizador GPS: recorridos en tiempo real, estado del vehículo y del conductor, control de maquinaria pesada y de transporte público. Reducí combustible, horas adicionales y tiempos de inactividad."
  },
  {
    file: "localizacion-activos.html", active: "localizacion-activos.html", body: activosBody,
    title: "Seguimiento y localización de activos móviles | Satelital Oeste",
    desc: "Rastreadores compactos con batería de larga duración y sensor de movimiento para motos, cargas, equipaje, vehículos en alquiler y mascotas. Alertas de movimiento en tiempo real."
  },
  {
    file: "rastreo-de-personas.html", active: "rastreo-de-personas.html", body: personasBody,
    title: "Rastreo de personas y personal en calle | Satelital Oeste",
    desc: "El rastreador GPS más chico del mercado, con batería incorporada, botón de alarma y aviso por inactividad. Para personal que trabaja solo, fuera de la oficina o de noche."
  },
  {
    file: "contacto.html", active: "contacto.html", body: contactoBody,
    title: "Contacto | Satelital Oeste — 0800 122 0789",
    desc: "Contactate con Satelital Oeste: 0800 122 0789, WhatsApp, correo comercial y técnico, sucursales en Buenos Aires y Córdoba. Pedí tu cotización de rastreo satelital."
  }
];

for (const p of PAGES) {
  writeFileSync(join(ROOT, p.file), page(p), "utf8");
  console.log("· " + p.file);
}

const hoy = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(p => `  <url><loc>${SITE.dominio}/${p.file === "index.html" ? "" : p.file}</loc><lastmod>${hoy}</lastmod><changefreq>monthly</changefreq><priority>${p.file === "index.html" ? "1.0" : "0.8"}</priority></url>`).join("\n")}
</urlset>`;
writeFileSync(join(ROOT, "sitemap.xml"), sitemap, "utf8");
writeFileSync(join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.dominio}/sitemap.xml\n`, "utf8");
console.log("· sitemap.xml + robots.txt");
console.log("Listo. " + PAGES.length + " páginas generadas.");
