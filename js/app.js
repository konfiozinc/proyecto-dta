/* ===========================================================
   DTA Chanclas — Catálogo
   Los productos se cargan desde: content/catalogo.json
   (editable desde el panel CMS). Si el JSON no está disponible
   (p. ej. file://), se usan los datos por defecto de abajo.
   =========================================================== */
const WHATSAPP_NUM = "573175821372";
const ASESOR_NOMBRE = "Jaqueline";
const SITIO_NOMBRE = "DTA Chanclas";

const CATALOGO_DEFAULT = {
  categorias: [
    { id:"dama-planas", nombre:"Dama Planas", tallas:"Dama 35 a 41", precioDetal:33000, precioMayor:24000, descripcion:"Chanclas planas para dama, cómodas y elegantes.", fotos:["planas1.jpg","planas2.jpg","planas3.jpg","planas4.jpg","planas5.jpg","planas6.jpg","planas7.jpg","planas8.jpg"] },
    { id:"dama-altas", nombre:"Dama Altas", tallas:"Dama 35 a 41", precioDetal:40000, precioMayor:30000, descripcion:"Chanclas altas (plataforma) para dama.", fotos:["altas1.jpg","altas2.jpg","altas3.jpg","altas4.jpg","altas5.jpg"] },
    { id:"altas-cruzadas", nombre:"Altas Cruzadas", tallas:"Dama 35 a 41", precioDetal:40000, precioMayor:32000, descripcion:"Chanclas altas cruzadas para dama.", fotos:["cruzadas1.jpg","cruzadas2.jpg","cruzadas3.jpg"] },
    { id:"caballero", nombre:"Caballero", tallas:"Caballero 37 a 44", precioDetal:40000, precioMayor:30000, descripcion:"Chanclas para caballero, resistentes.", fotos:["caballero1.jpg","caballero2.jpg","caballero3.jpg","caballero4.jpg","caballero5.jpg"] }
  ]
};

let categorias = CATALOGO_DEFAULT.categorias;

async function cargarProductos(){
  try {
    const r = await fetch("content/catalogo.json", { cache: "no-store" });
    if (r.ok) {
      const d = await r.json();
      if (d && Array.isArray(d.categorias) && d.categorias.length) categorias = d.categorias;
    }
  } catch (e) { /* usar datos por defecto */ }
}

const fmt = n => "$" + n.toLocaleString("es-CO");

function waLink(texto){
  return `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(texto)}`;
}
function waLinkProducto(categoriaNombre, archivo){
  return waLink(`Hola, estoy interesado(a) en: ${categoriaNombre} (ref. ${archivo}). ¿Me confirmas disponibilidad?`);
}
function imgPath(catId, archivo){
  return `assets/catalogo_dta/${catId}/${archivo}`;
}
function imgOnError(){
  return `this.closest('.img-wrap, .carousel-img-wrap').innerHTML='<div class=\\'foto-pendiente\\'>Foto pendiente</div>'`;
}

/* ---------- Links de WhatsApp globales ---------- */
const linksGlobales = [
  ["navWhatsapp", "Hola, vi el catálogo DTA y quiero hacer un pedido"],
  ["btnWhatsappHero", "Hola, vi el catálogo DTA y quiero hacer un pedido"],
  ["btnWhatsappFloat", "Hola, quiero hacer un pedido"],
  ["btnWhatsappCTA", "Hola, quiero asesoría para un pedido mayorista"]
];
linksGlobales.forEach(([id, texto]) => {
  const el = document.getElementById(id);
  if(el) el.href = waLink(texto);
});

/* ---------- Render de tarjetas de categoría ---------- */
const categoriasGrid = document.getElementById("categoriasGrid");

function buildCategorias(){
  categoriasGrid.innerHTML = categorias.map(cat => `
    <div class="categoria-card" data-cat="${cat.id}">
      <div class="img-wrap">
        <img src="${imgPath(cat.id, cat.fotos[0])}" alt="${cat.nombre}" loading="lazy" decoding="async" onerror="${imgOnError()}">
        <span class="badge-count">${cat.fotos.length} fotos</span>
      </div>
      <div class="info">
        <h3>${cat.nombre}</h3>
        <div class="tallas">Tallas ${cat.tallas.replace(/^\S+\s/, '')}</div>
        <div class="precios-mini">Detal <b>${fmt(cat.precioDetal)}</b> · Mayor <b>${fmt(cat.precioMayor)}</b></div>
        <button class="btn-ver">Ver galería</button>
      </div>
    </div>
  `).join("");

  categoriasGrid.querySelectorAll(".categoria-card").forEach(card => {
    card.addEventListener("click", () => openCarousel(card.dataset.cat));
  });
}

/* ---------- Tablas de precios ---------- */
function buildPrecios(){
  document.getElementById("listaDetal").innerHTML = categorias.map(c =>
    `<li>${c.nombre} <b>${fmt(c.precioDetal)}</b></li>`
  ).join("");
  document.getElementById("listaMayor").innerHTML = categorias.map(c =>
    `<li>${c.nombre} <b>${fmt(c.precioMayor)}</b></li>`
  ).join("");
}

/* ---------- Modal Carrusel de categoría ---------- */
const carouselOverlay = document.getElementById("carouselOverlay");
const carouselTitle = document.getElementById("carouselTitle");
const carouselPrecios = document.getElementById("carouselPrecios");
const carouselImgWrap = document.getElementById("carouselImgWrap");
const carouselDotsModal = document.getElementById("carouselDotsModal");
const carouselWhatsapp = document.getElementById("carouselWhatsapp");
const carouselPrev = document.getElementById("carouselPrev");
const carouselNext = document.getElementById("carouselNext");

let catActual = null;
let indiceActual = 0;

function openCarousel(catId){
  catActual = categorias.find(c => c.id === catId);
  indiceActual = 0;
  carouselTitle.textContent = catActual.nombre;
  carouselPrecios.textContent = `Tallas ${catActual.tallas} · Detal ${fmt(catActual.precioDetal)} · Mayor ${fmt(catActual.precioMayor)}${catActual.descripcion ? ' · ' + catActual.descripcion : ''}`;
  carouselDotsModal.innerHTML = catActual.fotos.map((_, i) => `<span data-i="${i}"></span>`).join("");
  carouselDotsModal.querySelectorAll("span").forEach(dot => {
    dot.addEventListener("click", () => { indiceActual = Number(dot.dataset.i); renderCarouselImg(); });
  });
  renderCarouselImg();
  openModal(carouselOverlay);
}

function renderCarouselImg(){
  const archivo = catActual.fotos[indiceActual];
  carouselImgWrap.innerHTML = `<img src="${imgPath(catActual.id, archivo)}" alt="${catActual.nombre}" loading="lazy" decoding="async" onerror="${imgOnError()}">`;
  carouselDotsModal.querySelectorAll("span").forEach((d, i) => d.classList.toggle("active", i === indiceActual));
  carouselWhatsapp.href = waLinkProducto(catActual.nombre, archivo);
}

carouselPrev.addEventListener("click", () => {
  indiceActual = (indiceActual - 1 + catActual.fotos.length) % catActual.fotos.length;
  renderCarouselImg();
});
carouselNext.addEventListener("click", () => {
  indiceActual = (indiceActual + 1) % catActual.fotos.length;
  renderCarouselImg();
});

/* ---------- Modal QR / Compartir ---------- */
const qrOverlay = document.getElementById("qrOverlay");
const qrBox = document.getElementById("qrBox");
const qrUrlText = document.getElementById("qrUrl");
const btnCopy = document.getElementById("btnCopy");

function openModal(overlay){ overlay.classList.add("open"); }
function closeModal(overlay){ overlay.classList.remove("open"); }

document.getElementById("btnQR").addEventListener("click", () => {
  const url = window.location.href;
  if(navigator.share){
    navigator.share({ title: SITIO_NOMBRE, text: "Mira el catálogo de chanclas al por mayor", url })
      .catch(() => showQR(url));
  } else {
    showQR(url);
  }
});

function showQR(url){
  qrUrlText.textContent = url;
  qrBox.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}" alt="Código QR del catálogo">`;
  openModal(qrOverlay);
}

btnCopy.addEventListener("click", () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    btnCopy.textContent = "¡Enlace copiado!";
    setTimeout(() => { btnCopy.textContent = "Copiar enlace"; }, 2000);
  });
});

/* ---------- Modal Guardar contacto / Instalar ---------- */
const installOverlay = document.getElementById("installOverlay");
document.getElementById("btnContacto").addEventListener("click", () => openModal(installOverlay));

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    closeModal(qrOverlay);
    closeModal(installOverlay);
    closeModal(carouselOverlay);
  });
});
[qrOverlay, installOverlay, carouselOverlay].forEach(ov => {
  ov.addEventListener("click", e => { if(e.target === ov) closeModal(ov); });
});

/* vCard dinámica */
const vcard = `BEGIN:VCARD
VERSION:3.0
N:;${ASESOR_NOMBRE};;;
FN:${ASESOR_NOMBRE} - DTA Chanclas
ORG:DTA Chanclas
TEL;TYPE=CELL:+${WHATSAPP_NUM}
NOTE:Catálogo mayorista y al detal. Bucaramanga, Colombia.
END:VCARD`;
const vcardBlob = new Blob([vcard], { type: "text/vcard" });
const btnVcard = document.getElementById("btnVcard");
btnVcard.href = URL.createObjectURL(vcardBlob);
btnVcard.download = "DTA-Chanclas-Contacto.vcf";

/* ---------- Instalación PWA ---------- */
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});
document.getElementById("btnInstallPWA").addEventListener("click", async () => {
  if(deferredPrompt){
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  } else {
    alert("Para instalar: abre el menú de tu navegador y elige 'Agregar a pantalla de inicio'.");
  }
});

if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

/* ---------- Init ---------- */
(async function init(){
  await cargarProductos();
  buildCategorias();
  buildPrecios();
})();
