/* Satelital Oeste — interacciones */
(function () {
  "use strict";
  var d = document;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- preloader ---------- */
  var pre = d.getElementById("pre");
  if (pre) {
    var hide = function () { pre.classList.add("off"); };
    var t = setTimeout(hide, 900);
    window.addEventListener("load", function () { clearTimeout(t); setTimeout(hide, 260); });
    setTimeout(hide, 2600); // plan B: nunca se queda trabado
  }

  /* ---------- header ---------- */
  var hdr = d.querySelector(".hdr");
  var fab = d.querySelector(".fab");
  var onScroll = function () {
    var y = window.pageYOffset || d.documentElement.scrollTop;
    if (hdr) hdr.classList.toggle("stuck", y > 24);
    if (fab) fab.classList.toggle("on", y > 380);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  setTimeout(function () { if (fab) fab.classList.add("on"); }, 2200);

  /* ---------- menu mobile ---------- */
  var burger = d.querySelector(".burger");
  var drawer = d.getElementById("drawer");
  if (burger && drawer) {
    var setMenu = function (open) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      drawer.classList.toggle("open", open);
      d.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", function () {
      setMenu(burger.getAttribute("aria-expanded") !== "true");
    });
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1000) setMenu(false);
    });
  }

  /* ---------- reveal al scroll (con plan B por tiempo) ---------- */
  var rv = [].slice.call(d.querySelectorAll(".rv"));
  var showAll = function () { rv.forEach(function (el) { el.classList.add("in"); }); };
  if (reduce || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    rv.forEach(function (el) { io.observe(el); });
    setTimeout(showAll, 3500); // si el observador no dispara, nada queda invisible
  }

  /* ---------- animaciones: pausarlas cuando no se ven ---------- */
  if (reduce) {
    d.documentElement.classList.add("sin-mov");
  } else if ("IntersectionObserver" in window) {
    var vivos = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        en.target.classList.toggle("quieto", !en.isIntersecting);
      });
    }, { rootMargin: "140px" });
    [].slice.call(d.querySelectorAll(".ticker, .console")).forEach(function (e) { vivos.observe(e); });
  }

  /* ---------- telemetria de la consola ---------- */
  var speeds = [].slice.call(d.querySelectorAll("[data-spd]"));
  if (speeds.length && !reduce) {
    var base = speeds.map(function (el) { return parseInt(el.textContent, 10) || 0; });
    setInterval(function () {
      speeds.forEach(function (el, i) {
        var v = base[i] + Math.round((Math.random() - 0.5) * 9);
        if (v < 0) v = 0;
        el.textContent = v;
      });
    }, 1900);
  }

  /* ---------- formulario -> WhatsApp ---------- */
  var form = d.getElementById("form-contacto");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var g = function (n) { var f = form.elements[n]; return f ? String(f.value || "").trim() : ""; };
      var partes = [
        "Hola Satelital Oeste, quiero una cotizacion.",
        "",
        "Nombre: " + (g("nombre") || "-"),
        "Empresa: " + (g("empresa") || "-"),
        "Telefono: " + (g("telefono") || "-"),
        "Email: " + (g("email") || "-"),
        "Necesito: " + (g("servicio") || "-"),
        "Unidades a equipar: " + (g("unidades") || "-"),
        "",
        "Mensaje: " + (g("mensaje") || "-")
      ];
      var url = "https://wa.me/" + form.dataset.wa + "?text=" + encodeURIComponent(partes.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------- año ---------- */
  var y = d.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();
})();
