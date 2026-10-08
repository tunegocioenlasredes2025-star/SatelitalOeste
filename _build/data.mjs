/* ============================================================
   Satelital Oeste — fuente unica de datos.
   TODO lo que aparece aca esta verificado contra el sitio real
   (satelitaloeste.com.ar) o contra sus perfiles publicos.
   No agregar datos que no esten confirmados.
   ============================================================ */

export const SITE = {
  nombre: "Satelital Oeste",
  tagline: "Seguimiento en tiempo real",
  dominio: "https://www.satelitaloeste.com.ar",
  // Telefonos CONFIRMADOS por el cliente el 05/10/2026. Dijo textual que
  // "algunos ya no existen" y que los que quedan son estos tres. Se dieron de
  // baja el 0054 11 5294-8303 ("desde el exterior") y el (03546) 15-502842
  // (sucursal Cordoba), que venian del sitio viejo.
  tel0800: "0800 122 0789",
  tel0800Href: "tel:08001220789",
  // WhatsApp de la empresa (cuenta business): es el que atiende
  telWa: "+54 9 11 3247-5460",
  telWaHref: "tel:+5491132475460",
  telBsAs: "(011) 15-5815-5948",
  telBsAsHref: "tel:+5491158155948",
  wa: "5491132475460",
  mailInfo: "info@satelitaloeste.com.ar",
  mailContacto: "contacto@satelitaloeste.com.ar",
  mailTecnica: "tecnica@satelitaloeste.com.ar",
  facebook: "https://www.facebook.com/satelital.oeste.9",
  youtube: "https://www.youtube.com/channel/UC23vfdtEky5iS7psJYRcIAw",
  plataforma: "http://www.seguimiento.from-ar.com/avl/index.php"
};

export const NAV = [
  { t: "Inicio", s: "Inicio", h: "index.html" },
  { t: "Manejo de flotas", s: "Flotas", h: "manejo-de-flotas.html" },
  { t: "Seguimiento de activos", s: "Activos", h: "localizacion-activos.html" },
  { t: "Rastreo de personas", s: "Personas", h: "rastreo-de-personas.html" },
  { t: "Contacto", s: "Contacto", h: "contacto.html" }
];

export const RUBROS = [
  "Logística y distribución", "Transporte público", "Taxis y remises",
  "Construcción", "Maquinaria pesada", "Servicios públicos",
  "Seguridad vial", "Agua y saneamiento", "Telecomunicaciones",
  "Distribución de electricidad", "Motos y utilitarios", "Cargas y equipaje",
  "Personal en calle", "Mascotas"
];
